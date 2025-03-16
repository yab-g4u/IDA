const hre = require("hardhat");

async function main() {
    console.log("Deploying Wallet contract...");

    // Get the contract factory
    const Wallet = await hre.ethers.getContractFactory("Wallet");

    // Deploy the contract
    const wallet = await Wallet.deploy();
    await wallet.waitForDeployment();

    console.log("Wallet contract deployed to:", await wallet.getAddress());
}

// Run the script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

