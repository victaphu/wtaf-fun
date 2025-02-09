import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BattleRoyaleFactoryModule = buildModule("BattleRoyaleFactoryModule", (m) => {
  const admin = "0xEc62204b06C2aabdfE6D98F0c4E13CEA1E937d09"; // Example admin address - this is my agent that was deployed
  const battleRoyale = m.contract("BattleRoyale", [admin]);
  const memeCoinFactory = m.contract("MemeCoinFactory", [battleRoyale, admin]);

  console.log("BattleRoyaleFactoryModule", {
    battleRoyale: battleRoyale,
    memeCoinFactory: memeCoinFactory,
  });

  return { battleRoyale, memeCoinFactory };
});

export default BattleRoyaleFactoryModule;