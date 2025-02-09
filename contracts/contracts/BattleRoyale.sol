// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BattleRoyale is AccessControl, ReentrancyGuard {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    enum GameState {
        PREPARING,
        STAKING,
        VOTING,
        EVALUATING,
        REVEALING,
        FINISHED
    }

    struct Token {
        address addr;
        bool isAlive;
        uint256 votesReceived;
        uint256 totalStaked;
        uint256 price;
    }

    struct Round {
        uint256 roundNumber;
        uint256 startTime;
        uint256 endTime;
        uint256 totalStaked;
    }

    // Game state variables
    GameState public currentState;
    Round public currentRound;
    uint256 public constant ROUND_DURATION = 1 minutes;
    uint256 public constant MINIMUM_STAKE = 0.0001 ether;
    
    // Token tracking
    mapping(address => Token) public tokens;
    address[] public activeTokens;
    mapping(address => uint256) private tokenIndex;

    // Staking and voting tracking
    mapping(address => mapping(address => uint256)) public userStakes;
    mapping(address => mapping(address => uint256)) public userVotes;

    // Events
    event TokenEliminated(address indexed tokenAddress);
    event GameStateChanged(GameState newState);
    event StakePlaced(address indexed user, address indexed token, uint256 amount);
    event VoteCast(address indexed user, address indexed token, uint256 amount);
    event RoundStarted(uint256 roundNumber);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    modifier inState(GameState state) {
        require(currentState == state, "Invalid game state");
        _;
    }

    function startNewRound() external onlyRole(OPERATOR_ROLE) inState(GameState.FINISHED) {
        currentRound.roundNumber++;
        currentRound.startTime = block.timestamp;
        currentRound.endTime = block.timestamp + ROUND_DURATION;
        currentRound.totalStaked = 0;
        
        currentState = GameState.STAKING;
        
        emit RoundStarted(currentRound.roundNumber);
        emit GameStateChanged(GameState.STAKING);
    }

    function stake(address tokenAddress) external payable nonReentrant inState(GameState.STAKING) {
        require(msg.value >= MINIMUM_STAKE, "Insufficient stake amount");
        require(tokens[tokenAddress].isAlive, "Token not active");

        userStakes[msg.sender][tokenAddress] += msg.value;
        tokens[tokenAddress].totalStaked += msg.value;
        currentRound.totalStaked += msg.value;

        emit StakePlaced(msg.sender, tokenAddress, msg.value);
    }

    function vote(address tokenAddress, uint256 amount) external nonReentrant inState(GameState.VOTING) {
        require(tokens[tokenAddress].isAlive, "Token not active");
        require(userStakes[msg.sender][tokenAddress] >= amount, "Insufficient stake");

        userVotes[msg.sender][tokenAddress] += amount;
        tokens[tokenAddress].votesReceived += amount;

        emit VoteCast(msg.sender, tokenAddress, amount);
    }

    function eliminateTokens(address[] calldata tokensToEliminate) external onlyRole(OPERATOR_ROLE) inState(GameState.EVALUATING) {
        for (uint i = 0; i < tokensToEliminate.length; i++) {
            address tokenAddr = tokensToEliminate[i];
            require(tokens[tokenAddr].isAlive, "Token already eliminated");
            
            tokens[tokenAddr].isAlive = false;
            
            uint256 index = tokenIndex[tokenAddr];
            uint256 lastIndex = activeTokens.length - 1;
            address lastToken = activeTokens[lastIndex];
            
            if (index != lastIndex) {
                activeTokens[index] = lastToken;
                tokenIndex[lastToken] = index;
            }
            
            activeTokens.pop();
            delete tokenIndex[tokenAddr];
            
            emit TokenEliminated(tokenAddr);
        }
    }

    function advanceState() external onlyRole(OPERATOR_ROLE) {
        require(uint8(currentState) < uint8(GameState.FINISHED), "Game already finished");
        currentState = GameState(uint8(currentState) + 1);
        emit GameStateChanged(currentState);
    }

    function getActiveTokens() external view returns (address[] memory) {
        return activeTokens;
    }

    function isTokenAlive(address tokenAddr) external view returns (bool) {
        return tokens[tokenAddr].isAlive;
    }

    // Emergency functions
    function emergencyWithdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }
}