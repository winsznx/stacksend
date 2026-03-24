# StackSend

<div align="center">
  <img src="public/favicon.svg" alt="StackSend Logo" width="80" height="80">
  
  **A multisend DApp for the Stacks blockchain**
  
  Send STX and SIP-010 tokens to multiple recipients in a single transaction.
  
  [Live Demo](https://stacksend.vercel.app) · [Report Bug](https://github.com/winsznx/stacksend/issues) · [Request Feature](https://github.com/winsznx/stacksend/issues)
</div>

---

## Overview

StackSend is a decentralized application built on the Stacks blockchain that allows users to send STX or SIP-010 fungible tokens to multiple recipients in a single transaction. This saves time and reduces transaction fees compared to sending individual transfers.

### Key Features

| Feature | Description |
|---------|-------------|
| **Multisend STX** | Send STX to up to 50 recipients at once |
| **Multisend FT** | Send any SIP-010 fungible token to multiple addresses |
| **Plan Tiers** | Starter (5), Pro (10), Max (20), Ultra (50) recipients per transaction |
| **Network Toggle** | Seamlessly switch between Mainnet and Testnet |
| **Auto Network Detection** | Automatically detects network from connected wallet |
| **Bulk Paste** | Quickly paste multiple addresses from a spreadsheet or list |
| **Dark/Light Mode** | Full theme support with system preference detection |
| **STX Input** | Enter amounts in STX (automatically converts to microSTX) |
| **Clarity 4** | Built with latest Stacks features for enhanced security |

---

## Screenshots

<details>
<summary>View Screenshots</summary>

### Landing Page
Professional landing page with wallet connection and feature highlights.

### App Dashboard
Clean interface for managing recipients and sending transactions.

### Dark Mode
Full dark theme support for comfortable viewing.

</details>

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **Wallet** | @stacks/connect v8 + Reown AppKit |
| **Transactions** | @stacks/transactions v7 |
| **Smart Contract** | Clarity 4 |
| **Icons** | react-icons + Lucide React |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel |

---

## Published Package

This repository also publishes `@winsznx/stacks-utils`, a small validation and formatting package for Stacks principals and transfer amounts.

```bash
npm install @winsznx/stacks-utils zod
```

```bash
npm install @winsznx/stacks-utils zod --registry https://npm.pkg.github.com --@winsznx:registry=https://npm.pkg.github.com
```

`zod` is required because `@winsznx/stacks-utils` declares it as a peer dependency.

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm**
- **Clarinet** v2+ ([Installation Guide](https://docs.hiro.so/clarinet/getting-started))
- **Stacks Wallet** (Leather or Xverse)

### Installation

```bash
# Clone the repository
git clone https://github.com/winsznx/stacksend.git
cd stacksend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

Telegram linking and transfer activity also require the backend service described in `backend/README.md`.

### Environment Variables

Create a `.env` file in the root directory:

```env
# Mainnet contract address
VITE_CONTRACT_ADDRESS_MAINNET=SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV.multisend

# Testnet contract address
VITE_CONTRACT_ADDRESS_TESTNET=ST31DP8F8CF2GXSZBHHHK5J6Y061744E1TP7FRGHT.multisend
```

---

## Smart Contract

The Clarity smart contract powers all multisend operations securely on-chain.

### Contract Addresses

| Network | Contract Address |
|---------|-----------------|
| **Mainnet** | `SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV.multisend` |
| **Testnet** | `ST31DP8F8CF2GXSZBHHHK5J6Y061744E1TP7FRGHT.multisend` |

### Contract Functions

| Function | Description | Max Recipients |
|----------|-------------|----------------|
| `send-many-stx` | Batch STX transfers | 50 |
| `send-many-ft` | Batch FT transfers | 10 per call |
| `get-max-recipients` | Returns max allowed (50) | N/A |

### Clarity 4 Features

This contract utilizes Clarity 4's newest security features:

- **`restrict-assets?`** - Explicitly limits asset outflows for enhanced security
- **`contract-hash?`** - Verifies FT contracts exist before transfers
- **`with-stx`** - Declares maximum STX transfer limits

### Deploy Your Own Contract

```bash
# Validate contract syntax
clarinet check

# Deploy to Testnet
clarinet deployments generate --testnet --low-cost
clarinet deployments apply --testnet

# Deploy to Mainnet
clarinet deployments generate --mainnet --low-cost
clarinet deployments apply --mainnet
```

After deployment, update the contract addresses in your `.env` file.

---

## Project Structure

```
stacksend/
├── contracts/                    # Clarity smart contracts
│   ├── multisend.clar           # Main multisend contract
│   └── traits/
│       └── sip-010-trait-ft-standard.clar
├── src/
│   ├── components/              # React components
│   │   ├── WalletConnect.tsx    # Landing page & wallet connection
│   │   ├── RecipientTable.tsx   # Main form for recipients
│   │   ├── NetworkToggle.tsx    # Network switcher
│   │   ├── PlanSelector.tsx     # Plan tier selector
│   │   └── PasteModal.tsx       # Bulk address paste modal
│   ├── hooks/
│   │   └── useAuth.ts           # Wallet authentication hook
│   ├── utils/
│   │   ├── constants.ts         # App configuration & contracts
│   │   └── validation.ts        # Address & amount validation
│   ├── App.tsx                  # Main app component
│   ├── index.css                # Global styles & themes
│   └── main.tsx                 # React entry point
├── public/
│   ├── favicon.svg              # App favicon
│   └── logo.png                 # App logo
├── settings/
│   ├── Devnet.toml              # Clarinet devnet config
│   ├── Testnet.toml             # Clarinet testnet config
│   └── Mainnet.toml             # Clarinet mainnet config
├── deployments/                 # Generated deployment plans
├── backend/                     # Chainhooks + Telegram notification service
├── packages/
│   └── stacks-utils/            # Published Stacks validation utilities package
├── Clarinet.toml                # Clarinet project config
├── vercel.json                  # Vercel deployment config
├── package.json
└── README.md
```

---

## Usage Guide

### Connecting Your Wallet

1. Choose **Stacks Wallet** or **Bitcoin Wallet** on the landing page
2. Click the connect button for the wallet type you selected
3. Approve the connection request in Leather, Xverse, or another compatible wallet
4. The app automatically detects your network (Mainnet/Testnet)

### Sending STX to Multiple Recipients

1. Make sure **STX** tab is selected
2. Click **"Add Recipient"** or use **"Paste Addresses"** for bulk entry
3. Enter recipient addresses and amounts in STX (e.g., `0.001`)
4. Review the total amount
5. Click **"Send Transaction"**
6. Approve the transaction in your wallet

### Sending Fungible Tokens

1. Select the **"Fungible Token"** tab
2. Enter the token contract address (e.g., `SP...token-name`)
3. Set token decimals to match the asset you are sending
4. Add recipients and amounts
5. Send and approve the transaction

### Address Format

| Network | Address Prefix | Example |
|---------|---------------|---------|
| Mainnet | `SP` | `SP2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC` |
| Testnet | `ST` | `ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC` |

**Important:** Use addresses matching your selected network to avoid errors.

---

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Validate smart contract
clarinet check

# Run contract tests
clarinet test
```

### GitHub CI

Pushes and pull requests run GitHub Actions builds for the root web app, `backend`, and `packages/stacks-utils`.

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `VITE_CONTRACT_ADDRESS_MAINNET`
   - `VITE_CONTRACT_ADDRESS_TESTNET`
4. Deploy!

### Manual Deployment

```bash
npm run build
# Upload contents of dist/ to your hosting provider
```

---

## Security

- All transactions are signed client-side by your wallet
- Post-conditions prevent unexpected token transfers
- Contract uses Clarity 4's `restrict-assets?` for explicit security
- No private keys are ever stored or transmitted

---

## Troubleshooting

### "BadAddressVersionByte" Error

This means you're using addresses from the wrong network:
- **Testnet** requires addresses starting with `ST`
- **Mainnet** requires addresses starting with `SP`

### Transaction Failed

1. Check you have enough STX for the transaction + gas fees
2. Verify recipient addresses are valid
3. Ensure your wallet is on the correct network

### Wallet Not Connecting

1. Make sure you have Leather or Xverse installed
2. Try refreshing the page
3. Check if your wallet is unlocked

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Stacks Foundation](https://stacks.org) for the blockchain infrastructure
- [Hiro](https://hiro.so) for developer tools (Clarinet, Stacks.js)
- [Leather Wallet](https://leather.io) & [Xverse](https://xverse.app) for wallet integration

---

<div align="center">
  <p>Built with ❤️ on Stacks</p>
  <p>
    <a href="https://stacks.co">Learn about Stacks</a> ·
    <a href="https://explorer.stacks.co">Block Explorer</a> ·
    <a href="https://docs.stacks.co">Documentation</a>
  </p>
</div>
