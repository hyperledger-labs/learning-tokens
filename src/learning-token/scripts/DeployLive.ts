/// ------------------------ Deploy to local testnet ----------------------

import { ethers } from "hardhat";
import dotenv from "dotenv";

async function main() {
  const LearningToken = await ethers.getContractFactory("LearningToken");
  const learningToken = await LearningToken.deploy();

  console.log(`LearningToken Contract deployed to ${learningToken.address}`);
  console.log(
    `LearningToken Contract Owner address ${await learningToken.owner()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
