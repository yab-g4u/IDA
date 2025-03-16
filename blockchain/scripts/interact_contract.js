const hre = require("hardhat");

async function main() {
    const [deployer, user1] = await hre.ethers.getSigners();
    const WALLET_CONTRACT_ADDRESS = "0xYourDeployedContractAddress"; // Replace with actual deployed address

    console.log("Interacting with Wallet contract at:", WALLET_CONTRACT_ADDRESS);

    // Get the deployed contract instance
    const Wallet = await hre.ethers.getContractFactory("Wallet");
    const wallet = await Wallet.attach(WALLET_CONTRACT_ADDRESS);

    // Deposit ETH into the contract
    console.log("Depositing 1 ETH into the wallet...");
    const depositTx = await wallet.connect(deployer).deposit({ value: hre.ethers.parseEther("1") });
    await depositTx.wait();
    console.log("Deposit successful!");

    // Get contract balance
    const balance = await wallet.getBalance();
    console.log("Wallet Balance:", hre.ethers.formatEther(balance), "ETH");

    // Transfer ETH from deployer to user1
    console.log(`Transferring 0.5 ETH from deployer to ${user1.address}...`);
    const transferTx = await wallet.connect(deployer).transfer(user1.address, hre.ethers.parseEther("0.5"));
    await transferTx.wait();
    console.log("Transfer successful!");

    // Withdraw ETH from the contract
    console.log("Withdrawing 0.3 ETH from the contract...");
    const withdrawTx = await wallet.connect(deployer).withdraw(hre.ethers.parseEther("0.3"));
    await withdrawTx.wait();
    console.log("Withdrawal successful!");
}

// Run the script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

