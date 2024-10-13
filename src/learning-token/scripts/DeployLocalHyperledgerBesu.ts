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
  type EnvVariables = {
    SUPER_ADMIN_PUB_KEY: string;
    SUPER_ADMIN_PRI_KEY: string;
    INSTITUTION_PUB_KEY: string;
    INSTITUTION_PRI_KEY: string;
    INSTRUCTOR_PUB_KEY: string;
    INSTRUCTOR_PRI_KEY: string;
    LEARNER1_PUB_KEY: string;
    LEARNER1_PRI_KEY: string;
  };
  const {
    SUPER_ADMIN_PUB_KEY,
    SUPER_ADMIN_PRI_KEY,
    INSTITUTION_PUB_KEY,
    INSTITUTION_PRI_KEY,
    INSTRUCTOR_PUB_KEY,
    INSTRUCTOR_PRI_KEY,
    LEARNER1_PUB_KEY,
    LEARNER1_PRI_KEY,
  } = process.env as EnvVariables; // Use "as" to cast process.env to the defined type

  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );
  const superAdminWallet = new ethers.Wallet(SUPER_ADMIN_PRI_KEY, provider);
  const institutionWallet = new ethers.Wallet(INSTITUTION_PRI_KEY, provider);
  const instructorWallet = new ethers.Wallet(INSTRUCTOR_PRI_KEY, provider);
  const learnerWallet = new ethers.Wallet(LEARNER1_PRI_KEY, provider);

  const institutionName = "MIT";
  const instructorName = "Alfonso";
  const learner1Name = "Piash";
  const learner2Name = "Tanjin";
  const courseName = "CS50";
  const totalSupply = 100;
  const courseId = 0;
  const inistitution1Id = 0;
  const instructor1Id = 0;
  const learner1Id = 0;
  const course1Id = 0;
  const tokenId = 0;
  const fieldOfKnowledge = "Programming";
  const skillName = "Solidity";
  const amount = 1;
  const institutionLatitude = "23.8882748";
  const institutionLongitude = "903880846";
  const learnerLatitude = "23.8669432";
  const learnerLongitude = "90.4070788";
  const learner2Latittude = "23.6345742";
  const learner2Longitude = "-102.5939836";
  const scoringGuideGradingPolicyBookURL =
    "https://docs.google.com/spreadsheets/d/1yFMIq2VQi47tdId6r0uOrtXlkIGe8Z7ZiBpNU7OgZKI/edit#gid=0";

  const currentTimestamp = Math.floor(Date.now() / 1000);

  //   transfer token to learner to make transaction
  const amountInWei = ethers.utils.parseEther("200");

  //   const tx = await superAdminWallet.sendTransaction({
  //     to: LEARNER1_PUB_KEY,
  //     value: amountInWei,
  //   });

  //   console.log(`Transaction hash: ${tx.hash}`);
  //   console.log(
  //     `Transfer of ${ethers.utils.formatEther(
  //       amountInWei
  //     )} ETH to ${LEARNER1_PUB_KEY} sent.`
  //   );

  const LearningToken = await ethers.getContractFactory("LearningToken");
  const learningToken = await LearningToken.connect(superAdminWallet).deploy();

  console.log(`LearningToken Contract deployed to ${learningToken.address}`);
  console.log(
    `LearningToken Contract Owner address ${await learningToken.owner()}`
  );

  const InstructorWallet = learningToken.connect(instructorWallet);

  await InstructorWallet.registerInstructor(instructorName, currentTimestamp);

  await learningToken.registerInstitution(
    institutionName,
    INSTITUTION_PUB_KEY,
    currentTimestamp,
    institutionLatitude,
    institutionLongitude
  );
  //call from institution
  const InstitutionWallet = learningToken.connect(institutionWallet);

  const addInstructorResponse =
    await InstitutionWallet.addInstructorToInstitution(
      INSTRUCTOR_PUB_KEY,
      currentTimestamp,
      {
        gasPrice: 2100,
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
    INSTITUTION_PUB_KEY,
    courseName,
    currentTimestamp,
    [LEARNER1_PUB_KEY],
    scoringGuideGradingPolicyBookURL,
    {
      gasPrice: 2100,
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
  const registerLearnerResponse = await learningToken.registerLearner(
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
        gasPrice: 2100,
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
      gasPrice: 2100,
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
      gasPrice: 2100,
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
        gasPrice: 1121211,
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
