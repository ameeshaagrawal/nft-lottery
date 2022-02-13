const { deployments, run } = require("hardhat");

const deployAndVerify = async (
  contractName,
  args,
  deployer,
  contractPath,
  chainId
) => {
  const contractInstance = await deployments.deploy(contractName, {
    from: deployer,
    args,
    log: true,
    deterministicDeployment: false,
  });

  console.log(`${contractName} deployed: ${contractInstance.address}`);
  console.log("verifying the contract:");

  try {
    if (chainId.toString() !== "31337") {
      await sleep(30);
      await run("verify:verify", {
        address: contractInstance.address,
        contract: contractPath,
        constructorArguments: args,
      });
    }
  } catch (error) {
    console.log("Error during verification", error);
  }

  return contractInstance;
};

const sleep = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay * 1000));

module.exports = {
  deployAndVerify,
  sleep,
};
