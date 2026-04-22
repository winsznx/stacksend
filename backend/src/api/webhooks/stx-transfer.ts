import { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { telegramService } from '../../services/telegram.js';
import { config } from '../../config/env.js';
import { isWebhookAuthorized } from '../../utils/security.js';

function normalizeContractIdentifier(contractIdentifier: string): string {
    return contractIdentifier.replace('::', '.');
}

export async function handleSTXTransferWebhook(req: Request, res: Response): Promise<void> {
    try {
        if (!isWebhookAuthorized(req)) {
            res.status(401).json({ error: 'Unauthorized webhook request' });
            return;
        }

        const payload = req.body;
        const contractIdentifier = normalizeContractIdentifier(payload.chainhook?.predicate?.contract_identifier || '');
        const network = contractIdentifier.startsWith('SP') ? 'mainnet'
            : contractIdentifier.startsWith('ST') ? 'testnet'
                : 'unknown';
        const expectedContracts = new Set([
            normalizeContractIdentifier(config.contracts.mainnet),
            normalizeContractIdentifier(config.contracts.testnet),
        ]);

        console.log('===== STX WEBHOOK =====');
        console.log('STX webhook received');
        console.log(`Network from contract: ${network}`);
        console.log(`Contract: ${contractIdentifier}`);
        console.log(`Chainhook UUID: ${payload.chainhook?.uuid}`);

        if (!expectedContracts.has(contractIdentifier)) {
            console.warn(`Unexpected contract identifier: ${contractIdentifier}`);
            res.status(400).json({ error: 'Unexpected contract identifier' });
            return;
        }

        if (!payload?.apply || !Array.isArray(payload.apply)) {
            console.warn('Invalid payload structure');
            res.status(400).json({ error: 'Invalid payload structure' });
            return;
        }

        for (const block of payload.apply) {
            const blockHeight = block.block_identifier?.index;
            const timestamp = block.timestamp;
            const transactions = Array.isArray(block.transactions) ? block.transactions : [];

            if (typeof blockHeight !== 'number' || typeof timestamp !== 'number') {
                continue;
            }

            console.log(`Block ${blockHeight}, ${transactions.length} transaction(s)`);

            for (const tx of transactions) {
                const txId = tx.transaction_identifier?.hash;
                const success = tx.metadata?.success;
                const operations = Array.isArray(tx.operations) ? tx.operations : [];

                if (!txId || !success) {
                    continue;
                }

                const description = tx.metadata?.description || '';
                if (!description.includes('send-many-stx')) {
                    continue;
                }

                const senderAddress = tx.metadata?.sender;
                if (!senderAddress) {
                    continue;
                }

                const creditOps = operations.filter((op: {
                    type?: string;
                    account?: { address?: string };
                    amount?: { value?: string; currency?: { symbol?: string } };
                }) => op.type === 'CREDIT');
                const recipients: Array<{ address: string; amount: number }> = [];
                let totalAmount = 0;

                for (const op of creditOps) {
                    const recipient = op.account?.address;
                    const amount = Number.parseInt(op.amount?.value || '0', 10);

                    if (
                        recipient &&
                        Number.isFinite(amount) &&
                        amount > 0 &&
                        op.amount?.currency?.symbol === 'STX' &&
                        recipient !== senderAddress
                    ) {
                        recipients.push({ address: recipient, amount });
                        totalAmount += amount;
                    }
                }

                if (recipients.length === 0) {
                    continue;
                }

                const alreadyProcessed = await db.transferExists(txId);
                if (alreadyProcessed) {
                    continue;
                }

                const insertedTransferId = await db.insertTransfer({
                    tx_id: txId,
                    block_height: blockHeight,
                    timestamp,
                    sender_address: senderAddress,
                    transfer_type: 'STX',
                    token_contract: null,
                    total_amount: totalAmount,
                    recipient_count: recipients.length,
                    network,
                });
                const transferId = insertedTransferId ?? await db.getTransferIdByTxId(txId);

                if (!transferId) {
                    console.warn(`Unable to resolve transfer ID for ${txId}`);
                    continue;
                }

                for (let i = 0; i < recipients.length; i++) {
                    const { address: recipientAddress, amount } = recipients[i];
                    const amountInSTX = amount / 1_000_000;

                    const recipientId = await db.insertRecipient({
                        transfer_id: transferId,
                        recipient_address: recipientAddress,
                        amount,
                        amount_decimals: amountInSTX,
                        position_in_list: i,
                    });

                    const user = await db.getUserByAddress(recipientAddress);
                    if (user?.telegram_chat_id && user.notification_enabled) {
                        const messageId = await telegramService.sendTransferNotification({
                            chatId: user.telegram_chat_id,
                            recipientAddress,
                            amount: amountInSTX.toFixed(6),
                            tokenSymbol: 'STX',
                            txId,
                            senderAddress,
                            network,
                        });

                        await db.insertNotification({
                            recipient_id: recipientId,
                            telegram_chat_id: user.telegram_chat_id,
                            message_text: `Received ${amountInSTX} STX`,
                            message_sent: messageId !== null,
                            telegram_message_id: messageId,
                        });

                        if (messageId) {
                            await db.markNotificationSent(recipientId);
                        }
                    }

                    await db.insertActivityFeed({
                        user_address: recipientAddress,
                        event_type: 'received',
                        transfer_id: transferId,
                        recipient_id: recipientId,
                        metadata: {
                            amount: amountInSTX,
                            token: 'STX',
                            from: senderAddress,
                        },
                    });
                }

                const senderUser = await db.getUserByAddress(senderAddress);
                if (senderUser?.telegram_chat_id && senderUser.notification_enabled) {
                    await telegramService.sendSenderNotification({
                        chatId: senderUser.telegram_chat_id,
                        senderAddress,
                        recipientCount: recipients.length,
                        totalAmount: totalAmount / 1_000_000,
                        txId,
                        network,
                    });
                }

                await db.insertActivityFeed({
                    user_address: senderAddress,
                    event_type: 'sent',
                    transfer_id: transferId,
                    recipient_id: null,
                    metadata: {
                        recipient_count: recipients.length,
                        total_amount: totalAmount / 1_000_000,
                        token: 'STX',
                    },
                });
            }
        }

        console.log('===== END WEBHOOK =====');
        res.status(200).json({ received: true });
    } catch (error: unknown) {
        console.error('Webhook error:', error);
        console.error('Stack:', error.stack);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process webhook' });
        }
    }
}
