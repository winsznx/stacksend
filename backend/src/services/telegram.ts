import TelegramBot from 'node-telegram-bot-api';
import { db } from '../db/client.js';
import { config } from '../config/env.js';

class TelegramService {
    private bot: TelegramBot;

    constructor() {
        // Enable polling to listen for commands
        this.bot = new TelegramBot(config.telegram.botToken, { polling: true });

        // Set up command handlers
        this.setupCommands();

        console.log('✅ Telegram bot initialized with polling');
    }

    private escapeMarkdown(text: string): string {
        return text.replace(/([_*`\[])/g, '\\$1');
    }

    private setupCommands() {
        // Handle /start command (with optional wallet address parameter)
        this.bot.onText(/\/start(.*)/, async (msg, match) => {
            const chatId = msg.chat.id;
            const username = msg.from?.username;

            // Extract wallet address from deep link parameter
            const param = match?.[1]?.trim();

            if (param && param.length > 0) {
                // User clicked deep link with wallet address
                const walletAddress = param;

                // Validate Stacks address format (starts with SP or ST)
                if (walletAddress.startsWith('SP') || walletAddress.startsWith('ST')) {
                    try {
                        // Link wallet to Telegram
                        await db.linkTelegram(walletAddress, chatId, username);

                        // Send success message
                        await this.sendWelcomeMessage(chatId, walletAddress);

                        console.log(`✅ Linked wallet ${walletAddress} to Telegram chat ${chatId}`);
                    } catch (error: unknown) {
                        console.error('Failed to link Telegram:', error);
                        await this.bot.sendMessage(chatId, '❌ Failed to link your wallet. Please try again.');
                    }
                } else {
                    await this.bot.sendMessage(chatId, '❌ Invalid wallet address. Please use the link from the StackSend app.');
                }
            } else {
                // Regular /start without parameter
                await this.handleStartCommand(chatId);
            }
        });


        // Handle /status command
        this.bot.onText(/\/status/, async (msg) => {
            const chatId = msg.chat.id;
            const user = await db.getUserByTelegramChatId(chatId);

            if (!user) {
                await this.bot.sendMessage(chatId, '❌ No wallet linked. Use the "Link Telegram" button in the StackSend app.');
                return;
            }

            await this.sendStatusMessage(chatId, user.wallet_address, user.notification_enabled);
        });

        // Handle /enable command
        this.bot.onText(/\/enable/, async (msg) => {
            const chatId = msg.chat.id;
            const user = await db.getUserByTelegramChatId(chatId);

            if (!user) {
                await this.bot.sendMessage(chatId, '❌ No wallet linked. Use the "Link Telegram" button in the StackSend app.');
                return;
            }

            await db.setNotificationEnabled(user.wallet_address, true);
            await this.bot.sendMessage(chatId, '✅ Notifications enabled!');
        });

        // Handle /disable command
        this.bot.onText(/\/disable/, async (msg) => {
            const chatId = msg.chat.id;
            const user = await db.getUserByTelegramChatId(chatId);

            if (!user) {
                await this.bot.sendMessage(chatId, '❌ No wallet linked. Use the "Link Telegram" button in the StackSend app.');
                return;
            }

            await db.setNotificationEnabled(user.wallet_address, false);
            await this.bot.sendMessage(chatId, '🔕 Notifications disabled.');
        });

        console.log('✅ Bot commands registered');
    }

    /**
     * Send transfer notification to user
     */
    async sendTransferNotification(params: {
        chatId: number;
        recipientAddress: string;
        amount: string;
        tokenSymbol: string;
        txId: string;
        senderAddress: string;
        network: string;
    }): Promise<number | null> {
        const { chatId, recipientAddress, amount, tokenSymbol, txId, senderAddress, network } = params;
        const safeAmount = this.escapeMarkdown(amount);
        const safeTokenSymbol = this.escapeMarkdown(tokenSymbol);
        const safeRecipient = this.escapeMarkdown(`${recipientAddress.slice(0, 8)}...${recipientAddress.slice(-6)}`);
        const safeSender = this.escapeMarkdown(`${senderAddress.slice(0, 8)}...${senderAddress.slice(-6)}`);

        const explorerUrl = network === 'mainnet'
            ? `https://explorer.hiro.so/txid/${txId}`
            : `https://explorer.hiro.so/txid/${txId}?chain=testnet`;

        const message = `
🎉 *You received ${safeAmount} ${safeTokenSymbol}!*

💰 *Amount:* ${safeAmount} ${safeTokenSymbol}
📬 *To:* \`${safeRecipient}\`
👤 *From:* \`${safeSender}\`
🔗 [View Transaction](${explorerUrl})
    `.trim();

        try {
            const result = await this.bot.sendMessage(chatId, message, {
                parse_mode: 'Markdown',
                disable_web_page_preview: false,
            });
            console.log(`✅ Telegram notification sent to ${chatId} for tx ${txId.slice(0, 10)}...`);
            return result.message_id;
        } catch (error: unknown) {
            console.error(`❌ Failed to send Telegram message to ${chatId}:`, error.message);
            return null;
        }
    }

    /**
     * Send notification to sender after multisend
     */
    async sendSenderNotification(params: {
        chatId: number;
        senderAddress: string;
        recipientCount: number;
        totalAmount: number;
        txId: string;
        network: string;
    }): Promise<number | null> {
        const { chatId, senderAddress, recipientCount, totalAmount, txId, network } = params;
        const safeSender = this.escapeMarkdown(`${senderAddress.slice(0, 8)}...${senderAddress.slice(-6)}`);

        const explorerUrl = network === 'mainnet'
            ? `https://explorer.hiro.so/txid/${txId}`
            : `https://explorer.hiro.so/txid/${txId}?chain=testnet`;

        const message = `
📤 *You sent ${totalAmount} STX to ${recipientCount} recipients!*

💰 *Total Amount:* ${totalAmount} STX
👥 *Recipients:* ${recipientCount}
📬 *From:* \`${safeSender}\`
🔗 [View Transaction](${explorerUrl})
    `.trim();

        try {
            const result = await this.bot.sendMessage(chatId, message, {
                parse_mode: 'Markdown',
                disable_web_page_preview: false,
            });
            console.log(`✅ Sender notification sent to ${chatId} for tx ${txId.slice(0, 10)}...`);
            return result.message_id;
        } catch (error: unknown) {
            console.error(`❌ Failed to send sender notification to ${chatId}:`, error.message);
            return null;
        }
    }

    /**
     * Send welcome message when user links their wallet
     */
    async sendWelcomeMessage(chatId: number, walletAddress: string): Promise<void> {
        const safeWalletAddress = this.escapeMarkdown(walletAddress);
        const message = `
👋 *Welcome to StackSend Notifications!*

Your wallet has been linked:
\`${safeWalletAddress}\`

You'll receive instant notifications whenever you receive STX or fungible tokens via StackSend.

🔔 Notifications are *enabled* by default.

*Commands:*
/status - Check your notification status
/disable - Disable notifications
/enable - Enable notifications
    `.trim();

        try {
            await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            console.log(`✅ Welcome message sent to ${chatId}`);
        } catch (error: unknown) {
            console.error(`❌ Failed to send welcome message:`, error.message);
        }
    }

    /**
     * Send test notification
     */
    async sendTestNotification(chatId: number): Promise<void> {
        const message = '✅ *Test notification successful!*\n\nYou\'re all set up to receive StackSend notifications.';
        try {
            await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            console.log(`✅ Test notification sent to ${chatId}`);
        } catch (error: unknown) {
            console.error(`❌ Failed to send test notification:`, error.message);
        }
    }

    /**
     * Send status message
     */
    async sendStatusMessage(chatId: number, walletAddress: string, enabled: boolean): Promise<void> {
        const status = enabled ? '✅ Enabled' : '🔕 Disabled';
        const safeWalletAddress = this.escapeMarkdown(walletAddress);
        const message = `
📊 *Notification Status*

Wallet: \`${safeWalletAddress}\`
Status: ${status}

${enabled ? 'You will receive notifications when you receive STX or fungible tokens.' : 'Notifications are currently disabled. Use /enable to turn them back on.'}
    `.trim();

        try {
            await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        } catch (error: unknown) {
            console.error(`❌ Failed to send status message:`, error.message);
        }
    }

    /**
     * Handle /start command
     */
    async handleStartCommand(chatId: number): Promise<void> {
        const message = `
👋 *Welcome to StackSend Notifications!*

To start receiving notifications, you need to link your Stacks wallet address.

*How to link your wallet:*
1. Go to the StackSend app
2. Connect your wallet
3. Click on "Link Telegram" in the settings
4. Your Telegram will be automatically linked

Once linked, you'll receive instant notifications whenever you receive STX or fungible tokens via StackSend!

*Commands:*
/status - Check your notification status
/disable - Disable notifications
/enable - Enable notifications
    `.trim();

        try {
            await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        } catch (error: unknown) {
            console.error(`❌ Failed to handle /start command:`, error.message);
        }
    }
}

export const telegramService = new TelegramService();
