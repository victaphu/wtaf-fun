
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./BattleRoyaleToken.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MemeCoinFactory is AccessControl {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    address public immutable gameContract;

    event TokenCreated(address indexed tokenAddress, string name, string symbol, string emoji);

    constructor(address _gameContract, address admin) {
        gameContract = _gameContract;
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
            gameContract,
            msg.sender,
            emoji,
            description
        );

        emit TokenCreated(address(newToken), name, symbol, emoji);
        return address(newToken);
    }
}
