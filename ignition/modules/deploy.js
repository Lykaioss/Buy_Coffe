async function main() {
  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");

  // Deploy the contract
  const buyMeACoffee = await BuyMeACoffee.deploy();
  
  // Wait until the contract is deployed
  await buyMeACoffee.waitForDeployment();

  // Get the deployed contract address
  console.log("BuyMeACoffee deployed to:", await buyMeACoffee.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  
  // 0x5FbDB2315678afecb367f032d93F642f64180aa3   contract address.