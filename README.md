
# WTAF.fun - The Most WTF Token Game Ever

## Overview
WTAF.fun is a revolutionary meme token battle royale platform built on BASE chain that combines AI-driven chaos, community engagement, and DeFi mechanics into an addictive gaming experience.

## Core Features

### 🎮 Battle Royale Mechanics
- 5 rounds of AI-driven elimination chaos
- 100+ random elimination criteria
- 1-minute trading windows between rounds
- Dynamic token burning system

### 🚀 Token Launch System
- Easy meme token creation via smart contract (0xA418a6a536d8f806b52E7ec2821Bbe0DfE07C7d0)
- Custom emoji and token metadata support
- Instant BASE chain deployment
- Automated liquidity pool creation

### 💰 Prize Distribution
- 50% Winners Pool (Final survivors)
- 20% Token Shareholders
- 20% Liquidity Pool
- 10% WTAF Development Fund

### 🤖 AI Game Master
- Autonomous elimination rules
- Real-time chaos generation
- Dynamic difficulty scaling
- Community-influenced decision making

## Technical Stack
- Frontend: Next.js, TypeScript, Tailwind CSS
- Smart Contracts: Solidity
- Chain: BASE (Optimized for low fees)
- AI Integration: Custom battle royale logic

## Getting Started
1. Visit WTAF.fun
2. Connect your wallet
3. Launch your meme token
4. Join the battle arena
5. Survive to win!

## For the Developers
- Clone the repository

### For the User Interface
- cd web
- npm install
- npm run dev

### For the Smart Contracts
- cd contracts
- npm install
- npx hardhat compile
- configure .env (cp .env.example .env)
- npx hardhat ignition deploy ./ignition/modules/modules/BattleRoyaleDeploy.ts --network base-sepolia
- Grab the BattleRoyale and MemeCoinFactory addresses.
- Change BattleRoyale contract address in the file agentic/typescript/agentkit/src/action-providers/battle-royale/battleRoyaleGame.ts
- Change BattleRoyale and MemeCoinFactory addresses in the file web/src/app/launchpad/page.tsx
- Change BattleRoyale and MemeCoinFactory addresses in the file web/src/hooks/use-game.ts
- Change BattleRoyale and MemeCoinFactory addresses in the file contracts/scripts/mock-memetokens.ts
- npx hardhat run scripts//mock-memetokens.ts --network base-sepolia

### For AI Game Master
- Configure .env file in agentic/typescript/examples/langchain-cdp-chatbot/.env (copy the sample)
- cd agentic/typescript
- npm run install
- npm run build
- cd agentic/typescript/examples/langchain-cdp-chatbot
- npm run install
- npm run dev

Ask it about BattleRoyale, and run some commands, the AgentKit will execute stuff. If you run in autonomous mode it will try to run a game

## Links
- Website: https://wtaf.fun
- Memecoin Factory Smart Contract: 0xA418a6a536d8f806b52E7ec2821Bbe0DfE07C7d0 / BASE Explorer: [View on BaseScan](https://sepolia.basescan.org/address/0xA418a6a536d8f806b52E7ec2821Bbe0DfE07C7d0)
- Battle Royale Game Smart Contract: 0x71a22A353092479c0558fa9Fe6D89ebB9835ED19 / BASE Explorer: [View on BaseScan](https://sepolia.basescan.org/address/0x71a22A353092479c0558fa9Fe6D89ebB9835ED19)
- Github: https://github.com/victaphu/wtaf.fun

## Agentic Source Code
- The agentic source code used inside the Coinbase AgentKit ()

## 

## Why We'll Win ETHGlobal
WTAF.fun represents the perfect fusion of meme culture, AI technology, and DeFi mechanics. Our platform delivers:
- Innovative gameplay mechanics
- Seamless user experience
- Real economic value
- Community-driven development
- Scalable architecture

Built for the BASE ecosystem, WTAF.fun demonstrates the future of blockchain gaming where fun meets finance in the most chaotic way possible.
