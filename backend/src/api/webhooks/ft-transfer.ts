import { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { telegramService } from '../../services/telegram.js';
import { config } from '../../config/env.js';
import { isWebhookAuthorized } from '../../utils/security.js';

function normalizeContractIdentifier(contractIdentifier: string): string {
    return contractIdentifier.replace('::', '.');
}

export async function handleFTTransferWebhook(req: Request, res: Response): Promise<void> {
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

        console.log('===== FT WEBHOOK =====');
        console.log('FT webhook received');
        console.log(`Network from contract: ${network}`);
        console.log(`Contract: ${contractIdentifier}`);

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

            for (const tx of transactions) {
                const txId = tx.transaction_identifier?.hash;
                const success = tx.metadata?.success;
                const operations = Array.isArray(tx.operations) ? tx.operations : [];

                if (!txId || !success) {
                    continue;
                }

                const contractCallOp = operations.find(
                    (op: any) => op.type === 'CONTRACT_CALL' && op.metadata?.function_name === 'send-many-ft'
                );

                if (!contractCallOp) {
                    continue;
                }

                const senderAddress = contractCallOp.account?.address || tx.metadata?.sender;
                if (!senderAddress) {
                    continue;
                }

                const functionArgs = contractCallOp.metadata?.function_args_decoded || contractCallOp.metadata?.function_args;
                if (!Array.isArray(functionArgs) || functionArgs.length < 2) {
                    continue;
                }

                const tokenContract = String(functionArgs[0] || '');
                const recipientsList = functionArgs[1];
                if (!Array.isArray(recipientsList)) {
                    continue;
                }

                const tokenSymbol = tokenContract.includes('Wrapped-Bitcoin')
                    ? 'sBTC'
                    : tokenContract.split('.').pop() || 'FT';
                const decimals = tokenSymbol === 'sBTC' ? 8 : 6;

                const totalAmount = recipientsList.reduce((sum: number, r: any) => {
                    return sum + (typeof r.amount === 'number' ? r.amount : Number.parseInt(r.amount || '0', 10));
                }, 0);

                const alreadyProcessed = await db.transferExists(txId);
                if (alreadyProcessed) {
                    continue;
                }

                const insertedTransferId = await db.insertTransfer({
                    tx_id: txId,
                    block_height: blockHeight,
                    timestamp,
                    sender_address: senderAddress,
                    transfer_type: 'FT',
                    token_contract: tokenContract,
                    total_amount: totalAmount,
                    recipient_count: recipientsList.length,
                    network,
                });
                const transferId = insertedTransferId ?? await db.getTransferIdByTxId(txId);

                if (!transferId) {
                    console.warn(`Unable to resolve transfer ID for ${txId}`);
                    continue;
                }

                for (let i = 0; i < recipientsList.length; i++) {
                    const recipient = recipientsList[i];
                    const recipientAddress = recipient.to;
                    const amount = typeof recipient.amount === 'number'
                        ? recipient.amount
                        : Number.parseInt(recipient.amount || '0', 10);

                    if (!recipientAddress || !Number.isFinite(amount) || amount <= 0) {
                        continue;
                    }

                    const amountInTokens = amount / Math.pow(10, decimals);

                    const recipientId = await db.insertRecipient({
                        transfer_id: transferId,
                        recipient_address: recipientAddress,
                        amount,
                        amount_decimals: amountInTokens,
                        position_in_list: i,
                    });

                    const user = await db.getUserByAddress(recipientAddress);
                    if (user?.telegram_chat_id && user.notification_enabled) {
                        const messageId = await telegramService.sendTransferNotification({
                            chatId: user.telegram_chat_id,
                            recipientAddress,
                            amount: amountInTokens.toFixed(decimals),
                            tokenSymbol,
                            txId,
                            senderAddress,
                            network,
                        });

                        await db.insertNotification({
                            recipient_id: recipientId,
                            telegram_chat_id: user.telegram_chat_id,
                            message_text: `Received ${amountInTokens} ${tokenSymbol}`,
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
                            amount: amountInTokens,
                            token: tokenSymbol,
                            from: senderAddress,
                            token_contract: tokenContract,
                        },
                    });
                }

                await db.insertActivityFeed({
                    user_address: senderAddress,
                    event_type: 'sent',
                    transfer_id: transferId,
                    recipient_id: null,
                    metadata: {
                        recipient_count: recipientsList.length,
                        total_amount: totalAmount / Math.pow(10, decimals),
                        token: tokenSymbol,
                        token_contract: tokenContract,
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
