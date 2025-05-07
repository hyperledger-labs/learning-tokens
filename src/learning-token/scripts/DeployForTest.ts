/// ------------------------ Deploy to local hyperledger besu ----------------------
import { ethers } from "hardhat";
import dotenv from "dotenv";
// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = ethers.utils.parseEther("0.001");

//   const Lock = await ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log(
//     `Lock with ${ethers.utils.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
//   );
// }

// Helper function to log transaction status
async function logTransactionStatus(txResponse, operationName) {
  try {
    const receipt = await txResponse.wait();
    if (receipt.status === 1) {
      console.log(`${operationName} transaction was successful. Hash: ${receipt.transactionHash}`);
      return true;
    } else {
      console.error(`${operationName} transaction failed.`);
      return false;
    }
  } catch (error) {
    console.error(`Error in ${operationName} transaction:`, error);
    return false;
  }
}

async function main() {
  let learningTokenInstance: any,
    events: any,
    superadminWallet: any,
    superadminAddress: any,
    institutionWallet: any,
    institutionAddress: any,
    instructor1Wallet: any,
    instructor1Address: any,
    instructor2Wallet: any,
    instructor2Address: any,
    instructor3Wallet: any,
    instructor3Address: any,
    learner1Wallet: any,
    learner1Address: any,
    learner2Wallet: any,
    learner2Address: any,
    learner3Wallet: any,
    learner3Address: any,
    randomUserWallet: any,
    randomUserAddress: any,
    learnerAddress: any;
  const institutionLatitude = "23.8882748";
  const institutionLongitude = "903880846";
  const learnerLatitude = "23.8669432";
  const learnerLongitude = "90.4070788";
  const learner2Latitude = "23.6345742";
  const learner2Longitude = "-102.5939836";
  const institutionName =
    "International University Of Business Agriculture & Technology";
  const instructorName = "Alfonso";
  const learner1Name = "Piash";
  const learner2Name = "Tanjin";
  const learner3Name = "Pinu";
  const courseName = "CS50";
  const totalSupply = 100;
  const courseId = 0;
  const inistitution1Id = 0;
  const instructor1Id = 0;
  const learner1Id = 0;
  const learner2Id = 1;
  const learner3Id = 2;
  const course1Id = 0;
  const tokenId = 0;
  const fieldOfKnowledge = "Blockcahin";
  const skillName = "Solidity";
  const amount = 1;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const scoringGuideGradingPolicyBookURL =
    "https://docs.google.com/spreadsheets/d/1yFMIq2VQi47tdId6r0uOrtXlkIGe8Z7ZiBpNU7OgZKI/edit#gid=0";

  const txOptions = {
    gasPrice: 618616602,
    gasLimit: 5000000,
  };

  try {
    const accounts = await ethers.getSigners();
    superadminAddress = accounts[0].address;
    institutionWallet = accounts[1];
    institutionAddress = accounts[1].address;
    instructor1Wallet = accounts[2];
    instructor1Address = accounts[2].address;
    learner1Wallet = accounts[3];
    learner1Address = accounts[3].address;
    learner2Wallet = accounts[4];
    learner2Address = accounts[4].address;
    randomUserWallet = accounts[5];
    randomUserAddress = accounts[5].address;
    instructor2Wallet = accounts[6];
    instructor2Address = accounts[6].address;
    instructor3Wallet = accounts[7];
    instructor3Address = accounts[7].address;
    learner3Wallet = accounts[4];
    learner3Address = accounts[4].address;
    learnerAddress = [learner1Address];

    const LearningToken = await ethers.getContractFactory("LearningToken");
    const learningToken = await LearningToken.deploy();
    await learningToken.deployed();

    console.log(`LearningToken Contract deployed to ${learningToken.address}`);
    console.log(`LearningToken Contract Owner address ${await learningToken.owner()}`);

    const InstructorWallet = learningToken.connect(instructor1Wallet);

    const registerInstructorResponse = await InstructorWallet.registerInstructor(
      instructorName,
      currentTimestamp
    );
    await logTransactionStatus(registerInstructorResponse, "Register instructor");

    const registerInstitutionResponse = await learningToken.registerInstitution(
      institutionName,
      institutionAddress,
      currentTimestamp,
      institutionLatitude,
      institutionLongitude
    );
    await logTransactionStatus(registerInstitutionResponse, "Register institution");

    const learnerWallet = learningToken.connect(learner1Wallet);

    const registerLearnerResponse = await learnerWallet.registerLearner(
      learner1Name,
      currentTimestamp,
      learnerLatitude,
      learnerLongitude
    );
    await logTransactionStatus(registerLearnerResponse, "Register learner");

    const InstitutionWallet = learningToken.connect(institutionWallet);

    const addInstructorResponse = await InstitutionWallet.addInstructorToInstitution(
      instructor1Address,
      currentTimestamp,
      txOptions
    );
    await logTransactionStatus(addInstructorResponse, "Add instructor to institution");

    const createCourseResponse = await InstructorWallet.createCourse(
      institutionAddress,
      courseName,
      currentTimestamp,
      learnerAddress,
      scoringGuideGradingPolicyBookURL,
      txOptions
    );
    await logTransactionStatus(createCourseResponse, "Create course");

    const mintAttendanceTokenResponse = await InstructorWallet.mintAttendanceToken(
      0, //learnerId
      1, //amount
      courseId,
      currentTimestamp,
      fieldOfKnowledge,
      skillName,
      txOptions
    );
    await logTransactionStatus(mintAttendanceTokenResponse, "Mint attendance token");

    const mintScoreTokenResponse = await InstructorWallet.mintScoreToken(
      0, //learnerId
      15, //amount
      courseId,
      currentTimestamp,
      fieldOfKnowledge,
      skillName,
      txOptions
    );
    await logTransactionStatus(mintScoreTokenResponse, "Mint score token");

    const mintHelpingTokenResponse = await InstructorWallet.mintHelpingToken(
      0, //learnerId
      5, //amount
      courseId,
      currentTimestamp,
      fieldOfKnowledge,
      skillName,
      txOptions
    );
    await logTransactionStatus(mintHelpingTokenResponse, "Mint helping token");

    const mintInstructorScoreTokenResponse = await InstructorWallet.mintInstructorScoreToken(
      0, //learnerId
      10, //amount
      courseId,
      currentTimestamp,
      fieldOfKnowledge,
      txOptions
    );
    await logTransactionStatus(mintInstructorScoreTokenResponse, "Mint instructor score token");

  } catch (error) {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exitCode = 1;
});