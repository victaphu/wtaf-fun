
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./BattleRoyaleToken.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IBattleRoyale {
  function registerToken(address tokenAddress) external;
}

contract MemeCoinFactory is AccessControl {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    IBattleRoyale public immutable gameContract;

    event TokenCreated(address indexed tokenAddress, string name, string symbol, string emoji, string description);

    constructor(address _gameContract, address admin) {
        gameContract = IBattleRoyale(_gameContract);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(CREATOR_ROLE, admin);
    }

    function createToken(
        string memory name,
        string memory symbol,
        string memory emoji,
        string memory description
    ) external returns (address) {
        BattleRoyaleToken newToken = new BattleRoyaleToken(
            name,
            symbol,
            address(gameContract),
            msg.sender,
            emoji,
            description
        );

        gameContract.registerToken(address(newToken));

        emit TokenCreated(address(newToken), name, symbol, emoji, description);
        return address(newToken);
    }
}
