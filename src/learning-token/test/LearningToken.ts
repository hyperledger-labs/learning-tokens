import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
describe("LearningTokenContract", function () {
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
  const institutionName = "MIT";
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
  const fieldOfKnowledge = "Programming";
  const skillName = "Solidity";
  const amount = 1;
  const scoringGuideGradingPolicyBookURL =
    "https://docs.google.com/spreadsheets/d/1yFMIq2VQi47tdId6r0uOrtXlkIGe8Z7ZiBpNU7OgZKI/edit#gid=0";
  async function intToBytesData(value: any) {
    const encodedValue = ethers.utils.defaultAbiCoder.encode(
      ["uint256"],
      [value]
    );
    return encodedValue;
  }

  before(async () => {
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
    learnerAddress = [learner1Address, learner2Address, learner3Address];

    const LearningToken = await ethers.getContractFactory("LearningToken");
    learningTokenInstance = await LearningToken.deploy();
  });
  //checking the first address of the hardhat account is the superadmin of the contract
  it("Contract creator is superadmin", async function () {
    expect(await learningTokenInstance.owner()).to.be.equal(superadminAddress);
  });
  //creating institution from from super admin account function call
  it("Should create institution from superadmin account", async function () {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    await learningTokenInstance.registerInstitution(
      institutionName,
      institutionAddress,
      currentTimestamp,
      institutionLatitude,
      institutionLongitude
    );
    const event = await learningTokenInstance.queryFilter(
      "InstitutionRegistered"
    );
    expect(event[0].args.institutionId).to.be.equal(0);
    expect(event[0].args.institutionName).to.be.equal(institutionName);
    expect(event[0].args.registeredTime).to.be.equal(currentTimestamp);
  });
  it("Should not allow anyone to register an institution", async function () {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    try {
      const RandomUserWallet = await learningTokenInstance.connect(
        randomUserWallet
      );
      await expect(
        RandomUserWallet.registerInstitution(
          institutionName,
          institutionAddress,
          currentTimestamp,
          institutionLatitude,
          institutionLongitude
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    } catch (error: any) {}
  });
  it("Should register instructor as individual entity", async function () {
    const Instructor1Wallet = await learningTokenInstance.connect(
      instructor1Wallet
    );
    const currentTimestamp = Math.floor(Date.now() / 1000);
    await Instructor1Wallet.registerInstructor(
      instructorName,
      currentTimestamp
    );
    const event = await Instructor1Wallet.queryFilter("InstructorRegistered");
    expect(event[0].args.instructorId).to.be.equal(0);
    expect(event[0].args.instructorName).to.be.equal(instructorName);
    expect(event[0].args.registeredTime).to.be.equal(currentTimestamp);
  });
  //add instructor under a institution
  it("Should register registered instructor under registered institution", async function () {
    try {
      const InstructorWallet = await learningTokenInstance.connect(
        institutionWallet
      );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await InstructorWallet.addInstructorToInstitution(
        instructor1Address,
        currentTimestamp
      );
      const event = await InstructorWallet.queryFilter(
        "InstructorRegisteredUnderInstitution"
      );
      expect(event[0].args.instructorId).to.be.equal(0);
      expect(event[0].args.instructorName).to.be.equal(instructorName);
      expect(event[0].args.institutionId).to.be.equal(0);
      expect(event[0].args.institutionName).to.be.equal(institutionName);
      expect(event[0].args.registeredTime).to.be.equal(currentTimestamp);
    } catch (error: any) {
      // console.log("ERROR", error);
    }
  });

  it("Should not allow an unregister instructor under an institution", async function () {
    try {
      const InstructorWallet = await learningTokenInstance.connect(
        institutionWallet
      );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await expect(
        InstructorWallet.addInstructorToInstitution(
          randomUserAddress,
          currentTimestamp
        )
      ).to.be.revertedWith("Instructor is not registered");
    } catch (error: any) {
      console.log(error);
    }
  });

  it("Should not allow an unregister institution invoke add instructor to institution", async function () {
    try {
      const RandomUserWallet = await learningTokenInstance.connect(
        randomUserWallet
      );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await expect(
        RandomUserWallet.addInstructorToInstitution(
          randomUserAddress,
          currentTimestamp
        )
      ).to.be.revertedWith("Only institution admin has the permission");
    } catch (error: any) {
      console.log(error);
    }
  });

  it("Should register a learner one as individual entity", async function () {
    try {
      const Learner1Wallet = await learningTokenInstance.connect(
        learner1Wallet
      );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await Learner1Wallet.registerLearner(
        learner1Name,
        currentTimestamp,
        learnerLatitude,
        learnerLongitude
      );
      await Learner1Wallet.wait;
      const event = await Learner1Wallet.queryFilter("LearnerRegistered");
      expect(event[0].args.learnerId).to.be.equal(0);
      expect(event[0].args.learnerName).to.be.equal(learner1Name);
      expect(event[0].args.registeredTime).to.be.equal(currentTimestamp);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  it("Should register a learner two as individual entity", async function () {
    try {
      const Learner2Wallet = await learningTokenInstance.connect(
        learner2Wallet
      );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await Learner2Wallet.registerLearner(
        learner1Name,
        currentTimestamp,
        learner2Latitude,
        learner2Longitude
      );
      await Learner2Wallet.wait;
      const event = await Learner2Wallet.queryFilter("LearnerRegistered");
      expect(event[1].args.learnerId).to.be.equal(1);
      expect(event[1].args.learnerName).to.be.equal(learner1Name);
      expect(event[1].args.registeredTime).to.be.equal(currentTimestamp);
    } catch (error: any) {
      console.log("Learner2Wallet", error);
    }
  });

  it("Should register a learner three as individual entity", async function () {
    try {
      const Learner3Wallet = await learningTokenInstance.connect(
        learner3Wallet
      );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await Learner3Wallet.registerLearner(
        learner3Name,
        currentTimestamp,
        learnerLatitude,
        learnerLongitude
      );
      const event = await Learner3Wallet.queryFilter("LearnerRegistered");
      expect(event[2].args.learnerId).to.be.equal(2);
      expect(event[2].args.learnerName).to.be.equal(learner3Name);
      expect(event[2].args.registeredTime).to.be.equal(currentTimestamp);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  it("Should create a course by registered instructor under registered institution", async function () {
    try {
      const InstructorWallet = await learningTokenInstance.connect(
        instructor1Wallet
      );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await InstructorWallet.createCourse(
        institutionAddress,
        courseName,
        currentTimestamp,
        learnerAddress,
        scoringGuideGradingPolicyBookURL
      );

      const event = await InstructorWallet.queryFilter("CourseCreated");
      expect(event[0].args.courseId).to.be.equal(0);
      expect(event[0].args.instructorId).to.be.equal(0);
      expect(event[0].args.institutionId).to.be.equal(0);
      expect(event[0].args.courseName).to.be.equal(courseName);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });
  it("Should not add already registered learner to existing course by a valid instructor", async function () {
    try {
      const Learner2Wallet = await learningTokenInstance.connect(
        learner2Wallet
      );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await Learner2Wallet.registerLearner(
        learner2Name,
        currentTimestamp,
        learner2Latitude,
        learner2Longitude
      );
      const InstructorWallet = await learningTokenInstance.connect(
        instructor1Wallet
      );
      await InstructorWallet.addLearnerToCourse(
        courseId,
        learner2Address,
        institutionAddress
      );
      await expect(
        InstructorWallet.addLearnerToCourse(
          courseId,
          learner2Address,
          institutionAddress
        )
      ).to.be.revertedWith("learner already in the course");
    } catch (error: any) {
      // console.log("ERROR", error);
    }
  });

  //   define metadata
  //   transfer token to course learner
  //   transfer token to course learner
  // ---------------------------  Learning Token Mint TestCase --------------------------

  it("Should mint score token to course learner", async function () {
    try {
      //   const courseId = intToBytesData(course1Id);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const InstructorWallet = await learningTokenInstance.connect(
        instructor1Wallet
      );

      await InstructorWallet.mintScoreToken(
        0,
        amount,
        courseId,
        currentTimestamp,
        fieldOfKnowledge,
        skillName
      );
      const event = await InstructorWallet.queryFilter("ScoreTokenMinted");
      expect(event[0].args.holderAddress).to.be.equal(learner1Address);
      //its one because create course also incrment tokenId
      expect(event[0].args.tokenId).to.be.equal(1);
      expect(event[0].args.courseId).to.be.equal(0);
      expect(event[0].args.amount).to.be.equal(amount);
      //   expect(event[0].args.fieldOfKnowledge).to.equal(fieldOfKnowledge);
      //   expect(event[0].args.skillName).to.equal(skillName);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  //   //   //   //transfer token to course learner
  //   it("Learner should have token", async function () {
  //     try {
  //       const learnerBalance = await learningTokenInstance.balanceOf(
  //         learner1Address,
  //         tokenId
  //       );
  //       console.log("learnerBalance", learnerBalance);
  //       expect(learnerBalance).to.equal(1);
  //     } catch (error: any) {
  //      // console.log("ERROR", error);
  //     }
  //   });

  //   //transfer token to course learner
  it("Should not transfer score token to anyone", async function () {
    try {
      const sss = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        learner1Wallet
      );

      //   await expectRevert(
      //     InstructorWallet.safeTransferFrom(
      //       learner1Address,
      //       learner2Address,
      //       course1Id,
      //       amount,
      //       courseId
      //     ),
      //     "Instructor not found in the institution"
      //   );

      await expect(
        InstructorWallet.safeTransferFrom(
          learner1Address,
          learner2Address,
          course1Id,
          amount,
          courseId
        )
      ).to.be.revertedWith("safe transfers are disabled in this contract");
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  it("Should mint helping token to course learner", async function () {
    try {
      //   const courseId = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        instructor1Wallet
      );
      //   console.log(
      //     "HERE====",
      //     await studentAttendance.getProgramLearnerDetails(0, learner1Address)
      //   );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await InstructorWallet.mintHelpingToken(
        0,
        amount,
        courseId,
        currentTimestamp,
        fieldOfKnowledge,
        skillName
      );
      const event = await InstructorWallet.queryFilter("HelpingTokenMinted");
      expect(event[0].args.holderAddress).to.be.equal(learner1Address);
      expect(event[0].args.tokenId).to.be.equal(tokenId);
      expect(event[0].args.courseId).to.be.equal(courseId);
      expect(event[0].args.amount).to.be.equal(amount);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  //   //   //transfer token to course learner
  it("Should transfer helpint token to anyone", async function () {
    try {
      const courseId = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        learner1Wallet
      );
      await InstructorWallet.transferHelpingToken(
        learner1Address,
        learner2Address,
        tokenId,
        amount,
        courseId
      );
      //   await expectRevert(
      //     InstructorWallet.safeTransferFrom(
      //       learner1Address,
      //       learner2Address,
      //       tokenId,
      //       amount,
      //       courseId
      //     ),
      //     "Instructor not found in the institution"
      //   );

      const event = await InstructorWallet.queryFilter(
        "HelpingTokenTransfered"
      );
      expect(event[0].args.from).to.be.equal(learner1Address);
      expect(event[0].args.to).to.be.equal(learner2Address);
      expect(event[0].args.tokenId).to.be.equal(tokenId);
      expect(event[0].args.amount).to.be.equal(amount);
      //   expect(event[0].args.courseId).to.be.equal(courseId);
      // Event assertions can verify that the arguments are the expected ones
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  //   transfer token to course learner
  it("Should not transfer attendance token to anyone", async function () {
    try {
      //   const courseId = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        learner1Wallet
      );

      //   await expectRevert(
      //     InstructorWallet.safeTransferFrom(
      //       learner1Address,
      //       learner2Address,
      //       course1Id,
      //       amount,
      //       courseId
      //     ),
      //     "Instructor not found in the institution"
      //   );

      await expect(
        InstructorWallet.safeTransferFrom(
          learner1Address,
          learner2Address,
          course1Id,
          amount,
          courseId
        )
      ).to.be.revertedWith("safe transfers are disabled in this contract");
    } catch (error: any) {
      //  // console.log("ERROR", error);
    }
  });

  it("Should mint attendance token to course learner", async function () {
    try {
      //   const courseId = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        instructor1Wallet
      );
      //   console.log(
      //     "HERE====",
      //     await studentAttendance.getProgramLearnerDetails(0, learner1Address)
      //   );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await InstructorWallet.mintAttendanceToken(
        0, //learnerId
        amount,
        courseId,
        currentTimestamp,
        fieldOfKnowledge,
        skillName
      );
      const event = await InstructorWallet.queryFilter("AttendanceTokenMinted");
      expect(event[0].args.holderAddress).to.be.equal(learner1Address);
      expect(event[0].args.tokenId).to.be.equal(2);
      expect(event[0].args.courseId).to.be.equal(courseId);
      expect(event[0].args.amount).to.be.equal(amount);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  it("Should mint instructor scoring token to course learner", async function () {
    try {
      //   const courseId = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        instructor1Wallet
      );

      const currentTimestamp = Math.floor(Date.now() / 1000);
      await InstructorWallet.mintInstructorScoreToken(
        0,
        amount,
        courseId,
        currentTimestamp,
        fieldOfKnowledge
      );
      const event = await InstructorWallet.queryFilter("HelpingTokenMinted");
      expect(event[0].args.holderAddress).to.be.equal(learner1Address);
      expect(event[0].args.tokenId).to.be.equal(0);
      expect(event[0].args.courseId).to.be.equal(courseId);
      expect(event[0].args.amount).to.be.equal(amount);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  it("Should transfer scoring token to instructor", async function () {
    try {
      const courseId = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        learner1Wallet
      );
      await InstructorWallet.transferInstructorScoringToken(
        learner1Address,
        instructor1Address,
        3,
        amount,
        courseId
      );

      const event = await InstructorWallet.queryFilter(
        "InstructorScoringTokenTransfered"
      );
      expect(event[0].args.from).to.be.equal(learner1Address);
      expect(event[0].args.to).to.be.equal(instructor1Address);
      expect(event[0].args.tokenId).to.be.equal(3);
      expect(event[0].args.amount).to.be.equal(amount);
      //   expect(event[0].args.courseId).to.be.equal(courseId);
      // Event assertions can verify that the arguments are the expected ones
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  // ---------------------------  Learning Token Batch Mint TestCase --------------------------
  it("Should batch mint attendance token to course learners", async function () {
    try {
      //   const courseId = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        instructor1Wallet
      );
      //   console.log(
      //     "HERE====",
      //     await studentAttendance.getProgramLearnerDetails(0, learner1Address)
      //   );
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await InstructorWallet.batchMintAttendanceToken(
        [learner1Id, learner2Id],
        [1, 1],
        courseId,
        currentTimestamp,
        fieldOfKnowledge,
        courseName
      );
      const event = await InstructorWallet.queryFilter("AttendanceTokenMinted");
      expect(event[0].args.holderAddress).to.be.equal(learner1Address);
      expect(event[0].args.tokenId).to.be.equal(2);
      expect(event[0].args.courseId).to.be.equal(courseId);
      expect(event[0].args.amount).to.be.equal(amount);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  it("Should batch mint score token to course learners", async function () {
    try {
      //   const courseId = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        instructor1Wallet
      );

      const currentTimestamp = Math.floor(Date.now() / 1000);
      await InstructorWallet.batchMintScoreToken(
        [learner1Id, learner2Id],
        [1, 1],
        courseId,
        currentTimestamp,
        fieldOfKnowledge,
        skillName
      );
      const event = await InstructorWallet.queryFilter("ScoreTokenMinted");
      expect(event[0].args.holderAddress).to.be.equal(learner1Address);
      expect(event[0].args.tokenId).to.be.equal(1);
      expect(event[0].args.courseId).to.be.equal(courseId);
      expect(event[0].args.amount).to.be.equal(amount);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  it("Should batch mint helping token to course learners", async function () {
    try {
      //   const courseId = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        instructor1Wallet
      );

      const currentTimestamp = Math.floor(Date.now() / 1000);
      await InstructorWallet.batchMintHelpingToken(
        [learner1Id, learner2Id],
        [1, 1],
        courseId,
        currentTimestamp,
        fieldOfKnowledge,
        skillName
      );
      const event = await InstructorWallet.queryFilter("HelpingTokenMinted");
      expect(event[0].args.holderAddress).to.be.equal(learner1Address);
      expect(event[0].args.tokenId).to.be.equal(0);
      expect(event[0].args.courseId).to.be.equal(courseId);
      expect(event[0].args.amount).to.be.equal(amount);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });

  it("Should batch mint instructor score token to course learners", async function () {
    try {
      //   const courseId = intToBytesData(course1Id);
      const InstructorWallet = await learningTokenInstance.connect(
        instructor1Wallet
      );

      const currentTimestamp = Math.floor(Date.now() / 1000);
      await InstructorWallet.mintInstructorScoreToken(
        [learner1Id, learner2Id],
        [1, 1],
        courseId,
        currentTimestamp,
        fieldOfKnowledge
      );
      const event = await InstructorWallet.queryFilter("HelpingTokenMinted");
      expect(event[0].args.holderAddress).to.be.equal(learner1Address);
      expect(event[0].args.tokenId).to.be.equal(0);
      expect(event[0].args.courseId).to.be.equal(courseId);
      expect(event[0].args.amount).to.be.equal(amount);
    } catch (error: any) {
      console.log("ERROR", error);
    }
  });
});
