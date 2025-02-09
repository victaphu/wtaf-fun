import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const adjectives = ['Super', 'Mega', 'Ultra', 'Hyper', 'Epic', 'Magic', 'Cosmic', 'Lucky'];
const nouns = ['Moon', 'Rocket', 'Star', 'Doge', 'Cat', 'Pepe', 'Shiba', 'Coin'];
const emojiList = ['🌙', '🚀', '⭐', '🐕', '🐱', '🐸', '🐕', '💰', '🎮', '🎯', '🎲', '🎪'];

const generateRandomToken = () => {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const tokenName = `${randomAdjective} ${randomNoun}`;
  const tokenSymbol = `${randomAdjective.substring(0, 1)}${randomNoun.substring(0, 3)}`.toUpperCase();
  const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
  const description = `The next generation ${tokenName.toLowerCase()} token for the web3 revolution!`;

  return {
    tokenName,
    tokenSymbol,
    emoji,
    description
  };
};

async function main() {
  if (!process.env.WALLET_KEY) {
    throw new Error("Please set your PRIVATE_KEY in the .env file");
  }

  const wallet = new ethers.Wallet(process.env.WALLET_KEY, ethers.provider);
  const factory = await ethers.getContractAt(
    "MemeCoinFactory",
    "0x90EcC427c18F2d1aAB478822238B9a68Ba7b8CDa",
    wallet
  );

  console.log("Starting to create 100 tokens...");

  for (let i = 0; i < 100; i++) {
    const token = generateRandomToken();
    try {
      const tx = await factory.createToken(
        token.tokenName,
        token.tokenSymbol,
        token.emoji,
        token.description
      );
      const receipt = await tx.wait();
      console.log(`Token ${i + 1} created: ${token.tokenName} (${token.tokenSymbol})`);

      if (receipt) {

        const event = receipt.logs.find(
          log => factory.interface.parseLog(log)?.name === 'TokenCreated'
        );
        if (event) {
          const parsedLog = factory.interface.parseLog(event)!;
          console.log(`Token address: ${parsedLog.args.tokenAddress}`);
        }
      }

    } catch (error) {
      console.error(`Failed to create token ${i + 1}:`, error);
    }
  }

  console.log("Finished creating tokens!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
