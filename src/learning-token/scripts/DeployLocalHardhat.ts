import { ethers } from "hardhat";
import dotenv from "dotenv";

async function main() {
  type EnvVariables = {
    SUPER_ADMIN_PRI_KEY_HARDHATNODE: string;
  };
  const { SUPER_ADMIN_PRI_KEY_HARDHATNODE } = process.env as EnvVariables; // Use "as" to cast process.env to the defined type

  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );
  const superAdminWallet = new ethers.Wallet(
    SUPER_ADMIN_PRI_KEY_HARDHATNODE,
    provider
  );
  const LearningToken = await ethers.getContractFactory("LearningToken");
  const learningToken = await LearningToken.connect(superAdminWallet).deploy();
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
