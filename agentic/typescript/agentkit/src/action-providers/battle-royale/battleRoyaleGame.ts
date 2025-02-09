import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { CreateAction } from "../actionDecorator";
import { abi } from "./constants";
import { encodeFunctionData, Hex } from "viem";
import { EvmWalletProvider } from "../../wallet-providers";

const battleRoyaleAddress = "0xFcD18dbA40c43b6e01f09D3D1858B7C4706cf6Ca";

/**
 * BattleRoyaleGame class represents a game where players create meme tokens and hope the AI Overlord doesn't eliminate them.
 */
export class BattleRoyaleGame extends ActionProvider<EvmWalletProvider> {
  /**
   * Constructor for the BattleRoyaleGame
   */
  constructor() {
    super("battleRoyale", []);
  }

  /**
    * Starts a new round in the Battle Royale game.
    */
  @CreateAction({
    name: "start_new_round",
    description: `
    This tool will start a new round in the Battle Royale game.
    `,
    schema: z.object({}),
  })
  async startNewRound(
    walletProvider: EvmWalletProvider,
  ): Promise<string> {
    try {
      const hash = await walletProvider.sendTransaction({
        to: battleRoyaleAddress as Hex,
        data: encodeFunctionData({
          abi,
          functionName: "startNewRound",
          args: [],
        }),
      })

      await walletProvider.waitForTransactionReceipt(hash)

      return `Successfully started new round. Transaction hash: ${hash}`
    } catch (error) {
      return `Error starting new round: ${error}`
    }
  }

  /**
    * Eliminates tokens from the game.
    */
  @CreateAction({
    name: "eliminate_tokens",
    description: `
    This tool will eliminate specified tokens from the Battle Royale game.
    `,
    schema: z.object({
      tokensToEliminate: z.array(z.string()),
    }),
  })
  async eliminateTokens(
    walletProvider: EvmWalletProvider,
    args: { tokensToEliminate: string[] },
  ): Promise<string> {
    try {
      const hash = await walletProvider.sendTransaction({
        to: battleRoyaleAddress as Hex,
        data: encodeFunctionData({
          abi,
          functionName: "eliminateTokens",
          args: [args.tokensToEliminate as Hex[]],
        }),
      })

      await walletProvider.waitForTransactionReceipt(hash)

      return `Successfully eliminated tokens. Transaction hash: ${hash}`
    } catch (error) {
      return `Error eliminating tokens: ${error}`
    }
  }

  /**
    * Advances the game state.
    */
  @CreateAction({
    name: "advance_state",
    description: `
    This tool will advance the game state to the next phase.
    `,
    schema: z.object({}),
  })
  async advanceState(
    walletProvider: EvmWalletProvider,
  ): Promise<string> {
    try {
      const hash = await walletProvider.sendTransaction({
        to: battleRoyaleAddress as Hex,
        data: encodeFunctionData({
          abi,
          functionName: "advanceState",
          args: [],
        }),
      })

      await walletProvider.waitForTransactionReceipt(hash)

      return `Successfully advanced game state. Transaction hash: ${hash}`
    } catch (error) {
      return `Error advancing game state: ${error}`
    }
  }

  /**
   * Checks if the ERC20 action provider supports the given network.
   *
   * @param _ - The network to check.
   * @returns True if the ERC20 action provider supports the network, false otherwise.
   */
  supportsNetwork = (_: Network) => true;
}

export const battleRoyaleActionProvider = () => new BattleRoyaleGame();
