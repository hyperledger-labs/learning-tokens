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

  console.log(`LearningToken Contract deployed to ${learningToken.address}`);
  console.log(
    `LearningToken Contract Owner address ${await learningToken.owner()}`
  );

  const InstructorWallet = learningToken.connect(instructor1Wallet);

  const registerInstructorResponse = await InstructorWallet.registerInstructor(
    instructorName,
    currentTimestamp
  );

  const registerInstructorRecipt = await registerInstructorResponse.wait();

  if (registerInstructorRecipt.status === 1) {
    console.log("Register instructor transaction was successful.");
  } else if (registerInstructorRecipt.status === 0) {
    console.error("Register instructor transaction reverted.");
  } else {
    console.error("Register instructor transaction status is unknown.");
  }

  const registerInstitutionResponse = await learningToken.registerInstitution(
    institutionName,
    institutionAddress,
    currentTimestamp,
    institutionLatitude,
    institutionLongitude
  );
  const registerInstitutionRecipt = await registerInstitutionResponse.wait();

  if (registerInstitutionRecipt.status === 1) {
    console.log("Register Insitution transaction was successful.");
  } else if (registerInstitutionRecipt.status === 0) {
    console.error("Register Insitution transaction reverted.");
  } else {
    console.error("Register Insitution transaction status is unknown.");
  }

  const learnerWallet = learningToken.connect(learner1Wallet);

  const registerLearnerResponse = await learnerWallet.registerLearner(
    learner1Name,
    currentTimestamp,
    learnerLatitude,
    learnerLongitude
  );
  const registerLearnerRecipt = await registerLearnerResponse.wait();

  if (registerLearnerRecipt.status === 1) {
    console.log("Register learner transaction was successful.");
  } else if (registerLearnerRecipt.status === 0) {
    console.error("Register learner transaction reverted.");
  } else {
    console.error("Register learner transaction status is unknown.");
  }

  //call from institution
  const InstitutionWallet = learningToken.connect(institutionWallet);

  const addInstructorResponse =
    await InstitutionWallet.addInstructorToInstitution(
      instructor1Address,
      currentTimestamp,
      {
        gasPrice: 618616602,
        gasLimit: 5000000, // Set an appropriate gas limit for your transaction
      }
    );
  const addInstructorReceipt = await addInstructorResponse.wait();
  if (addInstructorReceipt.status === 1) {
    console.log("Add instructor transaction was successful.");
  } else if (addInstructorReceipt.status === 0) {
    console.error("Add instructor transaction reverted.");
  } else {
    console.error("Add instructor transaction status is unknown.");
  }
  const createCourseResponse = await InstructorWallet.createCourse(
    institutionAddress,
    courseName,
    currentTimestamp,
    learnerAddress,
    scoringGuideGradingPolicyBookURL,
    {
      gasPrice: 618616602,
      gasLimit: 5000000, // Set an appropriate gas limit for your transaction
    }
  );

  // Wait for the transaction to be mined and get the transaction receipt
  const createCourseReceipt = await createCourseResponse.wait();

  if (createCourseReceipt.status === 1) {
    console.log("Create course transaction was successful.");
  } else if (createCourseReceipt.status === 0) {
    console.error("Create course transaction reverted.");
  } else {
    console.error("Create course transaction status is unknown.");
  }

  // --------------------------------   Mint Attendance Token  ---------------------------------------
  const mintAttendanceTokenResponse =
    await InstructorWallet.mintAttendanceToken(
      0, //learnerId
      1, //amount
      courseId,
      currentTimestamp,
      fieldOfKnowledge,
      skillName,
      {
        gasPrice: 618616602,
        gasLimit: 5000000, // Set an appropriate gas limit for your transaction
      }
    );
  const mintAttendanceTokenRecipt = await mintAttendanceTokenResponse.wait();

  if (mintAttendanceTokenRecipt.status === 1) {
    console.log(
      "Mint attendance token transaction was successful.",
      mintAttendanceTokenRecipt.transactionHash
    );
  } else if (mintAttendanceTokenRecipt.status === 0) {
    console.error("Mint attendance token reverted.");
  } else {
    console.error("Mint attendance token status is unknown.");
  }

  // --------------------------------   Mint Score Token  ---------------------------------------
  const mintScoreTokenResponse = await InstructorWallet.mintScoreToken(
    0, //learnerId
    15, //amount
    courseId,
    currentTimestamp,
    fieldOfKnowledge,
    skillName,
    {
      gasPrice: 618616602,
      gasLimit: 5000000, // Set an appropriate gas limit for your transaction
    }
  );
  const mintScoreTokenRecipt = await mintScoreTokenResponse.wait();

  if (mintScoreTokenRecipt.status === 1) {
    console.log(
      "Mint Score token transaction was successful.",
      mintScoreTokenRecipt.transactionHash
    );
  } else if (mintScoreTokenRecipt.status === 0) {
    console.error("Mint Score token reverted.");
  } else {
    console.error("Mint Score token status is unknown.");
  }

  // --------------------------------   Mint Helping Token  ---------------------------------------
  const mintHelpingTokenResponse = await InstructorWallet.mintHelpingToken(
    0, //learnerId
    5, //amount
    courseId,
    currentTimestamp,
    fieldOfKnowledge,
    skillName,
    {
      gasPrice: 618616602,
      gasLimit: 5000000, // Set an appropriate gas limit for your transaction
    }
  );
  const mintHelpingTokenRecipt = await mintHelpingTokenResponse.wait();

  if (mintHelpingTokenRecipt.status === 1) {
    console.log(
      "Mint Helping token transaction was successful.",
      mintHelpingTokenRecipt.transactionHash
    );
  } else if (mintHelpingTokenRecipt.status === 0) {
    console.error("Mint Helping token reverted.");
  } else {
    console.error("Mint Helping token status is unknown.");
  }
  // --------------------------------   Mint Instructor Score Token  ---------------------------------------
  //   const LeanrerWallet = learningToken.connect(learnerWallet);

  const mintInstructorScoreTokenResponse =
    await InstructorWallet.mintInstructorScoreToken(
      0, //learnerId
      10, //amount
      courseId,
      currentTimestamp,
      fieldOfKnowledge,
      {
        gasPrice: 618616602,
        gasLimit: 5000000, // Set an appropriate gas limit for your transaction
      }
    );
  const mintInstructorScoreTokenRecipt =
    await mintInstructorScoreTokenResponse.wait();

  if (mintInstructorScoreTokenRecipt.status === 1) {
    console.log(
      "Mint instructor score token transaction was successful.",
      mintInstructorScoreTokenRecipt.transactionHash
    );
  } else if (mintInstructorScoreTokenRecipt.status === 0) {
    console.error("Mint instructor score token reverted.");
  } else {
    console.error("Mint instructor score token status is unknown.");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
