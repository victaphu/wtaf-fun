// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./BattleRoyale.sol";

contract BattleRoyaleToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    BattleRoyale public immutable gameContract;
    
    string public emoji;
    string public description;
    
    event TokensBurned(address indexed from, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);
    
    constructor(
        string memory name,
        string memory symbol,
        address _gameContract,
        address admin,
        string memory _emoji,
        string memory _description
    ) ERC20(name, symbol) {
        gameContract = BattleRoyale(_gameContract);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        emoji = _emoji;
        description = _description;
    }

    modifier onlyAlive() {
        require(gameContract.isTokenAlive(address(this)), "Token eliminated");
        _;
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) onlyAlive {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) external onlyAlive {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) external onlyAlive {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        if (!gameContract.isTokenAlive(address(this))) {
            return 0;
        }
        return super.balanceOf(account);
    }

    function transfer(address to, uint256 amount) public virtual override onlyAlive returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(amount > 0, "Transfer amount must be positive");
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public virtual override onlyAlive returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(amount > 0, "Transfer amount must be positive");
        return super.transferFrom(from, to, amount);
    }

    function approve(address spender, uint256 amount) public virtual override onlyAlive returns (bool) {
        require(spender != address(0), "Approve to zero address");
        return super.approve(spender, amount);
    }
}