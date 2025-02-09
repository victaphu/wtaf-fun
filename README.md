
# WTAF.fun - The Most WTF Token Game Ever

## Overview
WTAF.fun is a revolutionary meme token battle royale platform built on BASE chain that combines AI-driven chaos, community engagement, and DeFi mechanics into an addictive gaming experience.

## Prizes I'm applying for
- Autonome: https://autonome.alt.technology/wtaf-wjxyax
- Coinbase Developer Platform 
- Base

## Core Features

### 🎮 Battle Royale Mechanics
- 5 rounds of AI-driven elimination chaos
- 100+ random elimination criteria
- 1-minute trading windows between rounds
- Dynamic token burning system

### 🚀 Token Launch System
- Easy meme token creation via smart contract (0x90EcC427c18F2d1aAB478822238B9a68Ba7b8CDa)
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
Examples:
```
Available modes:
1. chat    - Interactive chat mode
2. auto    - Autonomous action mode

Choose a mode (enter number or name): 1
1
Starting chat mode... Type 'exit' to end.

Prompt: tell me about the battle royale actions you have access to
tell me about the battle royale actions you have access to
I can assist with the following Battle Royale actions:

1. **Start a New Round:** Initiate a new round in the Battle Royale game.
   
2. **Eliminate Tokens:** Remove specified tokens from the game.
   
3. **Advance Game State:** Move the game state to the next phase.

If you have any specific requests related to these actions, feel free to ask!
-------------------

Prompt: please help me to advance the game state for the battle royale contract
please help me to advance the game state for the battle royale contract

-------------------
Successfully advanced game state. Transaction hash: 0xe10b0383e34d8240214920a53ade9e0995e59eb5dbf254627be2bbd1a08e0e5d
-------------------
The game state has been successfully advanced in the Battle Royale contract. You can reference the transaction hash: `0xe10b0383e34d8240214920a53ade9e0995e59eb5dbf254627be2bbd1a08e0e5d` for tracking. If you need any further assistance, let me know!
```
https://sepolia.basescan.org/tx/0xe10b0383e34d8240214920a53ade9e0995e59eb5dbf254627be2bbd1a08e0e5d


## Links
- Website: https://wtaf.fun
- Memecoin Factory Smart Contract: 0x90EcC427c18F2d1aAB478822238B9a68Ba7b8CDa / BASE Explorer: [View on BaseScan](https://sepolia.basescan.org/address/0x90EcC427c18F2d1aAB478822238B9a68Ba7b8CDa)
- Battle Royale Game Smart Contract: 0xFcD18dbA40c43b6e01f09D3D1858B7C4706cf6Ca / BASE Explorer: [View on BaseScan](https://sepolia.basescan.org/address/0xFcD18dbA40c43b6e01f09D3D1858B7C4706cf6Ca)
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
