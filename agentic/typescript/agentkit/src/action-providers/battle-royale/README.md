
# Battle Royale Smart Contract Game

A decentralized elimination-style game where tokens compete to survive through multiple rounds. The game is controlled by operators and progresses through different states.

## Game Overview

The Battle Royale game consists of the following key elements:

### Game States
1. PREPARING - Initial setup phase
2. STAKING - Players can stake ETH on tokens
3. VOTING - Players vote using their staked amounts
4. EVALUATING - Votes are tallied and evaluated
5. REVEALING - Results are revealed
6. FINISHED - Round is complete

### Key Features
- Players can stake ETH (minimum 0.0001 ETH) on active tokens
- Players can vote with their staked amounts
- Tokens can be eliminated based on voting results
- Rounds last for 1 minute each
- Operators control game state progression
- Tracks active tokens and their stats (votes received, total staked, price)

### Token Properties
- Address
- Alive status
- Votes received
- Total amount staked
- Price

### Round Information
- Round number
- Start time
- End time
- Total staked amount

### Key Functions
- `startNewRound()` - Begins a new round
- `stake()` - Stake ETH on tokens
- `vote()` - Cast votes using staked amounts
- `eliminateTokens()` - Remove tokens from the game
- `advanceState()` - Progress to next game state

### Security Features
- Access control for admin/operator functions
- Reentrancy protection
- Emergency withdrawal capability
