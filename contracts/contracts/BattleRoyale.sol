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
    uint256 public constant MAX_ROUNDS = 5;

    // Token tracking
    mapping(address => Token) public tokens;
    address[] public activeTokens;
    mapping(address => uint256) private tokenIndex;

    // Round tracking
    string[] public eliminationRules;
    mapping(uint256 => string) public roundToEliminationRule;

    // Staking and voting tracking
    mapping(address => mapping(address => uint256)) public userStakes;
    mapping(address => mapping(address => uint256)) public userVotes;

    // Events
    event TokenEliminated(address indexed tokenAddress);
    event TokenRegistered(address indexed tokenAddress);
    event GameStateChanged(GameState newState);
    event StakePlaced(
        address indexed user,
        address indexed token,
        uint256 amount
    );
    event VoteCast(address indexed user, address indexed token, uint256 amount);
    event RoundStarted(uint256 roundNumber);
    event EliminationRuleAdded(uint256 roundNumber, string rule);

    address public creator;
    address public memeCoinFactory;

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        creator = msg.sender;
        currentRound.roundNumber = 0;
    }

    function setMemeCoinFactory(address _memeCoinFactory) external {
        require(msg.sender == creator, "Only creator can set factory");
        require(memeCoinFactory == address(0), "Factory already set");
        memeCoinFactory = _memeCoinFactory;
    }

    modifier inState(GameState state) {
        require(currentState == state, "Invalid game state");
        _;
    }

    function addEliminationRule(string calldata rule) external onlyRole(OPERATOR_ROLE) {
        require(currentRound.roundNumber < MAX_ROUNDS, "Maximum rounds reached");
        require(activeTokens.length > 1, "Not enough active tokens");
        
        roundToEliminationRule[currentRound.roundNumber] = rule;
        eliminationRules.push(rule);
        
        emit EliminationRuleAdded(currentRound.roundNumber, rule);
        
        currentRound.roundNumber++;
        // if (currentRound.roundNumber >= MAX_ROUNDS || activeTokens.length <= 1) {
        //     currentState = GameState.FINISHED;
        //     emit GameStateChanged(GameState.FINISHED);
        // }
    }

    function startNewRound()
        external
        onlyRole(OPERATOR_ROLE)
        inState(GameState.FINISHED)
    {
        require(currentRound.roundNumber <= MAX_ROUNDS, "Cannot exceed maximum rounds");
        currentRound.roundNumber = 0;
        currentRound.startTime = block.timestamp;
        currentRound.endTime = block.timestamp + ROUND_DURATION;
        currentRound.totalStaked = 0;
        
        delete eliminationRules;

        currentState = GameState.STAKING;

        emit RoundStarted(currentRound.roundNumber);
        emit GameStateChanged(GameState.STAKING);
    }

    function registerToken(address tokenAddress) external {
        require(msg.sender == memeCoinFactory, "Only factory can register tokens");
        require(!tokens[tokenAddress].isAlive, "Token already registered");

        tokens[tokenAddress] = Token(tokenAddress, true, 0, 0, 0);
        activeTokens.push(tokenAddress);
        tokenIndex[tokenAddress] = activeTokens.length - 1;

        emit TokenRegistered(tokenAddress);
    }

    function stake(
        address tokenAddress
    ) external payable nonReentrant inState(GameState.STAKING) {
        require(msg.value >= MINIMUM_STAKE, "Insufficient stake amount");
        require(tokens[tokenAddress].isAlive, "Token not active");

        userStakes[msg.sender][tokenAddress] += msg.value;
        tokens[tokenAddress].totalStaked += msg.value;
        currentRound.totalStaked += msg.value;

        emit StakePlaced(msg.sender, tokenAddress, msg.value);
    }

    function vote(
        address tokenAddress,
        uint256 amount
    ) external nonReentrant inState(GameState.VOTING) {
        require(tokens[tokenAddress].isAlive, "Token not active");
        require(
            userStakes[msg.sender][tokenAddress] >= amount,
            "Insufficient stake"
        );

        userVotes[msg.sender][tokenAddress] += amount;
        tokens[tokenAddress].votesReceived += amount;

        emit VoteCast(msg.sender, tokenAddress, amount);
    }

    function eliminateTokens(
        address[] calldata tokensToEliminate
    ) external onlyRole(OPERATOR_ROLE) inState(GameState.EVALUATING) {
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
        require(
            uint8(currentState) < uint8(GameState.FINISHED),
            "Game already finished"
        );
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
