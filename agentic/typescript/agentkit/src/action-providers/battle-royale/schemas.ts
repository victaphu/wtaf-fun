import { z } from "zod";

/**
 * Input schema for start new round action.
 */
export const StartNewRoundSchema = z
  .object({})
  .strip()
  .describe("Instructions for starting a new round");

/**
 * Input schema for eliminate tokens action.
 */
export const EliminateTokensSchema = z
  .object({
    tokensToEliminate: z.array(z.string()).describe("Array of token addresses to eliminate"),
  })
  .strip()
  .describe("Instructions for eliminating tokens");

/**
 * Input schema for advance state action.
 */
export const AdvanceStateSchema = z
  .object({})
  .strip()
  .describe("Instructions for advancing game state");