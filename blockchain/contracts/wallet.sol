// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Wallet {
    address public owner;
    mapping(address => uint256) public balances;

    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed recipient, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Deposit Ether to the wallet
    function deposit() external payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    // Withdraw Ether from the wallet
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }

    // Transfer funds to another address
    function transfer(address payable recipient, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        recipient.transfer(amount);
        emit Transferred(msg.sender, recipient, amount);
    }

    // Get wallet balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

