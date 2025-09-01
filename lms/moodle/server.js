/**
 * Simple Moodle Learning Tokens API
 * Gets quiz questions, answers, and calculates learning tokens
 */

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration
const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

if (!MOODLE_URL || !MOODLE_TOKEN) {
  console.error("Please set MOODLE_URL and MOODLE_TOKEN in .env file");
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Moodle API Helper with detailed logging
async function moodleRequest(wsfunction, params = {}) {
  const url = `${MOODLE_URL}/webservice/rest/server.php`;
  const formData = new URLSearchParams({
    wstoken: MOODLE_TOKEN,
    wsfunction: wsfunction,
    moodlewsrestformat: "json",
    ...params,
  });

  console.log(`\n=== MOODLE API CALL: ${wsfunction} ===`);
  console.log(`URL: ${url}`);
  console.log(`Parameters:`, JSON.stringify(Object.fromEntries(formData.entries()), null, 2));

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log(`RESPONSE DATA:`, JSON.stringify(data, null, 2));
    console.log(`=== END API CALL: ${wsfunction} ===\n`);

    if (data.exception) {
      throw new Error(`Moodle Error: ${data.message}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${wsfunction}):`, error.message);
    console.log(`=== END API CALL (ERROR): ${wsfunction} ===\n`);
    return { error: error.message };
  }
}

// ============================================================================
// API ROUTES
// ============================================================================

// Get all courses
app.get("/api/courses", async (req, res) => {
  try {
    console.log("\n>>> STARTING: Get all courses");
    const courses = await moodleRequest("core_course_get_courses");
    if (courses.error) return res.status(500).json(courses);

    // Filter out site course
    const filteredCourses = courses.filter((course) => course.id !== 1);
    
    console.log(`FILTERED COURSES (${filteredCourses.length} courses):`, JSON.stringify(filteredCourses, null, 2));
    console.log(">>> COMPLETED: Get all courses\n");
    
    res.json(filteredCourses);
  } catch (error) {
    console.error("ERROR in /api/courses:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get course details with students
app.get("/api/courses/:courseId", async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    console.log(`\n>>> STARTING: Get course details for course ID: ${courseId}`);

    // Get course info
    const courses = await moodleRequest("core_course_get_courses");
    const course = courses.find((c) => c.id === courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    console.log(`FOUND COURSE:`, JSON.stringify(course, null, 2));

    // Get enrolled users
    const users = await moodleRequest("core_enrol_get_enrolled_users", {
      courseid: courseId,
    });
    if (users.error) return res.status(500).json(users);

    console.log(`ENROLLED USERS (${users.length} users):`, JSON.stringify(users, null, 2));

    // Get quizzes
    const quizzesResponse = await moodleRequest(
      "mod_quiz_get_quizzes_by_courses",
      { "courseids[0]": courseId }
    );
    const quizzes = quizzesResponse.quizzes || [];

    console.log(`COURSE QUIZZES (${quizzes.length} quizzes):`, JSON.stringify(quizzes, null, 2));

    // Process each student
    const students = [];
    for (const user of users) {
      if (!user.email || user.username?.includes("admin")) continue;

      console.log(`\n--- Processing student: ${user.firstname} ${user.lastname} (ID: ${user.id}) ---`);

      let totalScore = 0;
      let quizCount = 0;

      // Calculate quiz performance
      for (const quiz of quizzes) {
        try {
          console.log(`Getting attempts for quiz: ${quiz.name} (ID: ${quiz.id})`);
          const attempts = await moodleRequest("mod_quiz_get_user_attempts", {
            quizid: quiz.id,
            userid: user.id,
          });

          if (attempts.attempts && attempts.attempts.length > 0) {
            console.log(`User ${user.id} attempts for quiz ${quiz.id}:`, JSON.stringify(attempts.attempts, null, 2));

            const bestAttempt = attempts.attempts.reduce((best, current) =>
              (parseFloat(current.sumgrades) || 0) >
              (parseFloat(best.sumgrades) || 0)
                ? current
                : best
            );

            console.log(`Best attempt for user ${user.id} in quiz ${quiz.id}:`, JSON.stringify(bestAttempt, null, 2));

            const maxGrade = parseFloat(quiz.grade) || 100;
            const achievedGrade = parseFloat(bestAttempt.sumgrades) || 0;
            const percentage =
              maxGrade > 0 ? (achievedGrade / maxGrade) * 100 : 0;

            console.log(`Score calculation - Max: ${maxGrade}, Achieved: ${achievedGrade}, Percentage: ${percentage}`);

            totalScore += Math.min(100, Math.max(0, percentage));
            quizCount++;
          } else {
            console.log(`No attempts found for user ${user.id} in quiz ${quiz.id}`);
          }
        } catch (error) {
          console.warn(`Could not get attempts for quiz ${quiz.id}:`, error.message);
        }
      }

      const averageScore = quizCount > 0 ? totalScore / quizCount : 0;

      console.log(`Final scores for ${user.firstname} ${user.lastname}: Average: ${averageScore}, Quizzes: ${quizCount}`);

      students.push({
        id: user.id,
        name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        email: user.email,
        score: Math.round(averageScore * 100) / 100,
        quizzesTaken: quizCount,
      });
    }

    // Sort by score
    students.sort((a, b) => b.score - a.score);

    console.log(`PROCESSED STUDENTS:`, JSON.stringify(students, null, 2));

    // Calculate summary
    const averageScore =
      students.length > 0
        ? students.reduce((sum, s) => sum + s.score, 0) / students.length
        : 0;

    const summary = {
      totalStudents: students.length,
      averageScore: Math.round(averageScore * 100) / 100,
      totalQuizzes: quizzes.length,
    };

    console.log(`SUMMARY:`, JSON.stringify(summary, null, 2));

    const responseData = {
      course: {
        id: course.id,
        name: course.fullname,
        shortName: course.shortname,
        studentCount: students.length,
      },
      students: students,
      summary: summary,
      quizzes: quizzes.map((q) => ({
        id: q.id,
        name: q.name,
        maxGrade: q.grade,
        timeLimit: q.timelimit,
      })),
    };

    console.log(`FINAL RESPONSE:`, JSON.stringify(responseData, null, 2));
    console.log(">>> COMPLETED: Get course details\n");

    res.json(responseData);
  } catch (error) {
    console.error("Error processing course:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get quiz questions and answers
app.get("/api/quizzes/:quizId/questions", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const includeAnswers = req.query.includeAnswers === "true";

    console.log(`\n>>> STARTING: Get quiz questions for quiz ID: ${quizId}, includeAnswers: ${includeAnswers}`);

    // Get quiz info
    const quizzesResponse = await moodleRequest(
      "mod_quiz_get_quizzes_by_courses",
      { "courseids[0]": 1 }
    );
    const allQuizzes = quizzesResponse.quizzes || [];

    // Find the specific quiz by checking all courses
    const courses = await moodleRequest("core_course_get_courses");
    let targetQuiz = null;

    console.log(`Searching for quiz ${quizId} across all courses...`);

    for (const course of courses) {
      console.log(`Checking course: ${course.fullname} (ID: ${course.id})`);
      const courseQuizzes = await moodleRequest(
        "mod_quiz_get_quizzes_by_courses",
        { "courseids[0]": course.id }
      );
      const quiz = courseQuizzes.quizzes?.find((q) => q.id === quizId);
      if (quiz) {
        targetQuiz = quiz;
        console.log(`Found target quiz in course ${course.id}:`, JSON.stringify(quiz, null, 2));
        break;
      }
    }

    if (!targetQuiz) {
      console.log(`Quiz ${quizId} not found in any course`);
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Get quiz attempts to analyze questions
    console.log(`Getting attempts for quiz ${quizId}...`);
    const attempts = await moodleRequest("mod_quiz_get_user_attempts", {
      quizid: quizId,
    });
    const questions = [];

    if (attempts.attempts && attempts.attempts.length > 0) {
      console.log(`Found ${attempts.attempts.length} attempts, analyzing first attempt...`);
      
      // Get attempt data for the first attempt to see questions
      const attemptId = attempts.attempts[0].id;
      console.log(`Getting attempt data for attempt ID: ${attemptId}`);
      
      const attemptData = await moodleRequest("mod_quiz_get_attempt_data", {
        attemptid: attemptId,
        page: -1,
      });

      if (attemptData.questions) {
        console.log(`Processing ${attemptData.questions.length} questions...`);
        
        for (const question of attemptData.questions) {
          console.log(`Processing question:`, JSON.stringify(question, null, 2));
          
          const processedQuestion = {
            id: question.id,
            name: question.name || `Question ${question.number}`,
            questionText: stripHtml(question.questiontext || ""),
            type: getQuestionType(question.qtype),
            maxMark: parseFloat(question.maxmark) || 1,
            number: question.number || 0,
          };

          // Add answers if requested
          if (includeAnswers && question.answers) {
            console.log(`Adding answers for question ${question.id}:`, JSON.stringify(question.answers, null, 2));
            processedQuestion.answers = question.answers.map((answer) => ({
              id: answer.id,
              text: stripHtml(answer.answer || ""),
              isCorrect: parseFloat(answer.fraction) > 0,
              feedback: stripHtml(answer.feedback || ""),
            }));
          }

          questions.push(processedQuestion);
        }
      }
    } else {
      console.log(`No attempts found for quiz ${quizId}`);
    }

    const responseData = {
      quiz: {
        id: targetQuiz.id,
        name: targetQuiz.name,
        intro: stripHtml(targetQuiz.intro || ""),
        maxGrade: targetQuiz.grade,
        timeLimit: targetQuiz.timelimit,
        totalQuestions: questions.length,
      },
      questions: questions,
      totalAttempts: attempts.attempts?.length || 0,
    };

    console.log(`FINAL QUIZ QUESTIONS RESPONSE:`, JSON.stringify(responseData, null, 2));
    console.log(">>> COMPLETED: Get quiz questions\n");

    res.json(responseData);
  } catch (error) {
    console.error("Error getting quiz questions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get detailed attempt data with student's chosen answers
app.get("/api/attempts/:attemptId", async (req, res) => {
  try {
    const attemptId = parseInt(req.params.attemptId);
    console.log(`\n>>> STARTING: Get attempt details for attempt ID: ${attemptId}`);

    // Get attempt data
    const attemptData = await moodleRequest("mod_quiz_get_attempt_data", {
      attemptid: attemptId,
      page: -1,
    });

    if (attemptData.error) {
      return res.status(500).json(attemptData);
    }

    // Get attempt review for more detailed answer information
    console.log(`Getting attempt review for attempt ${attemptId}...`);
    const attemptReview = await moodleRequest("mod_quiz_get_attempt_review", {
      attemptid: attemptId,
    });

    const questions = (attemptData.questions || []).map((question) => {
      console.log(`Processing question from attempt:`, JSON.stringify(question, null, 2));
      
      const reviewQuestion = attemptReview.questions?.find(
        (rq) => rq.id === question.id
      );

      // Parse student's response
      let studentAnswer = "No answer";
      let chosenOption = null;

      if (question.response) {
        console.log(`Student response for question ${question.id}:`, question.response);
        
        // For multiple choice, response might be answer ID
        if (question.qtype === "multichoice" && question.answers) {
          const chosenAnswerId = question.response;
          chosenOption = question.answers.find(
            (ans) => ans.id == chosenAnswerId
          );
          if (chosenOption) {
            studentAnswer = stripHtml(
              chosenOption.answer || chosenOption.text || ""
            );
          }
          console.log(`Chosen option:`, JSON.stringify(chosenOption, null, 2));
        } else {
          // For other question types, use response directly
          studentAnswer = stripHtml(question.response);
        }
      }

      // Get all answer options for reference
      const answerOptions = (question.answers || []).map((answer) => ({
        id: answer.id,
        text: stripHtml(answer.answer || answer.text || ""),
        isCorrect: parseFloat(answer.fraction || 0) > 0,
        feedback: stripHtml(answer.feedback || ""),
        chosen: chosenOption ? answer.id == chosenOption.id : false,
      }));

      console.log(`Answer options for question ${question.id}:`, JSON.stringify(answerOptions, null, 2));

      return {
        id: question.id,
        number: question.number || 0,
        name: question.name || `Question ${question.number}`,
        questionText: stripHtml(question.questiontext || ""),
        questionType: getQuestionType(question.qtype),

        // Student's response details
        studentAnswer: studentAnswer,
        studentResponse: question.response,

        // Scoring
        mark: parseFloat(question.mark) || 0,
        maxMark: parseFloat(question.maxmark) || 1,
        isCorrect: parseFloat(question.mark) === parseFloat(question.maxmark),

        // Feedback
        feedback: stripHtml(question.feedback || ""),
        generalFeedback: stripHtml(reviewQuestion?.generalfeedback || ""),

        // All answer options showing which one was chosen
        answerOptions: answerOptions,

        // Additional attempt info
        state: question.state || "unknown",
        flagged: question.flagged || false,
      };
    });

    const totalMarks = questions.reduce((sum, q) => sum + q.mark, 0);
    const maxMarks = questions.reduce((sum, q) => sum + q.maxMark, 0);
    const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;

    // Get attempt info
    const attemptInfo = {
      id: attemptId,
      userId: attemptData.attempt?.userid,
      quizId: attemptData.attempt?.quiz,
      state: attemptData.attempt?.state,
      timeStart: attemptData.attempt?.timestart,
      timeFinish: attemptData.attempt?.timefinish,
      timeTaken:
        attemptData.attempt?.timefinish && attemptData.attempt?.timestart
          ? attemptData.attempt.timefinish - attemptData.attempt.timestart
          : 0,
    };

    console.log(`ATTEMPT INFO:`, JSON.stringify(attemptInfo, null, 2));

    const responseData = {
      attempt: attemptInfo,
      questions: questions,
      summary: {
        totalQuestions: questions.length,
        correctAnswers: questions.filter((q) => q.isCorrect).length,
        incorrectAnswers: questions.filter(
          (q) => !q.isCorrect && q.studentAnswer !== "No answer"
        ).length,
        unanswered: questions.filter((q) => q.studentAnswer === "No answer")
          .length,
        totalMarks: Math.round(totalMarks * 100) / 100,
        maxMarks: Math.round(maxMarks * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        timeTaken: attemptInfo.timeTaken
          ? `${Math.floor(attemptInfo.timeTaken / 60)} minutes`
          : "Unknown",
      },
    };

    console.log(`FINAL ATTEMPT RESPONSE:`, JSON.stringify(responseData, null, 2));
    console.log(">>> COMPLETED: Get attempt details\n");

    res.json(responseData);
  } catch (error) {
    console.error("Error getting attempt data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all attempts for a specific student in a quiz
app.get("/api/students/:userId/quiz/:quizId/attempts", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const quizId = parseInt(req.params.quizId);

    console.log(`\n>>> STARTING: Get attempts for student ${userId} in quiz ${quizId}`);

    const attempts = await moodleRequest("mod_quiz_get_user_attempts", {
      quizid: quizId,
      userid: userId,
    });

    if (attempts.error) {
      return res.status(500).json(attempts);
    }

    const attemptsList = (attempts.attempts || []).map((attempt) => {
      console.log(`Processing attempt:`, JSON.stringify(attempt, null, 2));
      
      return {
        id: attempt.id,
        attempt: attempt.attempt,
        timeStart: attempt.timestart,
        timeFinish: attempt.timefinish,
        state: attempt.state,
        sumGrades: parseFloat(attempt.sumgrades) || 0,
        grade: parseFloat(attempt.grade) || 0,
        percentage: attempt.grade
          ? Math.round((parseFloat(attempt.grade) / 100) * 100)
          : 0,
      };
    });

    // Sort by attempt number
    attemptsList.sort((a, b) => a.attempt - b.attempt);

    const responseData = {
      userId: userId,
      quizId: quizId,
      totalAttempts: attemptsList.length,
      attempts: attemptsList,
      bestAttempt:
        attemptsList.length > 0
          ? attemptsList.reduce((best, current) =>
              current.sumGrades > best.sumGrades ? current : best
            )
          : null,
    };

    console.log(`FINAL STUDENT ATTEMPTS RESPONSE:`, JSON.stringify(responseData, null, 2));
    console.log(">>> COMPLETED: Get student attempts\n");

    res.json(responseData);
  } catch (error) {
    console.error("Error getting student attempts:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific student's performance in a course
app.get("/api/students/:userId/course/:courseId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const courseId = parseInt(req.params.courseId);

    console.log(`\n>>> STARTING: Get student ${userId} performance in course ${courseId}`);

    // Get user info
    const userResponse = await moodleRequest("core_user_get_users_by_field", {
      field: "id",
      "values[0]": userId,
    });

    const user = userResponse[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`FOUND USER:`, JSON.stringify(user, null, 2));

    // Get quizzes for this course
    const quizzesResponse = await moodleRequest(
      "mod_quiz_get_quizzes_by_courses",
      { "courseids[0]": courseId }
    );
    const quizzes = quizzesResponse.quizzes || [];

    // Get all attempts for this student in all quizzes
    const quizAttempts = [];
    let totalScore = 0;
    let quizCount = 0;

    for (const quiz of quizzes) {
      try {
        console.log(`Getting attempts for student ${userId} in quiz ${quiz.id}...`);
        const attempts = await moodleRequest("mod_quiz_get_user_attempts", {
          quizid: quiz.id,
          userid: userId,
        });

        if (attempts.attempts && attempts.attempts.length > 0) {
          const bestAttempt = attempts.attempts.reduce((best, current) =>
            (parseFloat(current.sumgrades) || 0) >
            (parseFloat(best.sumgrades) || 0)
              ? current
              : best
          );

          const maxGrade = parseFloat(quiz.grade) || 100;
          const achievedGrade = parseFloat(bestAttempt.sumgrades) || 0;
          const percentage =
            maxGrade > 0 ? (achievedGrade / maxGrade) * 100 : 0;

          console.log(`Quiz ${quiz.id} performance: ${percentage}% (${achievedGrade}/${maxGrade})`);

          quizAttempts.push({
            quiz: {
              id: quiz.id,
              name: quiz.name,
              maxGrade: maxGrade,
            },
            bestAttempt: bestAttempt,
            allAttempts: attempts.attempts,
            score: Math.round(percentage * 100) / 100,
          });

          totalScore += percentage;
          quizCount++;
        }
      } catch (error) {
        console.warn(
          `Could not get attempts for quiz ${quiz.id}:`,
          error.message
        );
      }
    }

    const averageScore = quizCount > 0 ? totalScore / quizCount : 0;

    const responseData = {
      student: {
        id: user.id,
        name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        email: user.email,
        username: user.username,
      },
      courseId: courseId,
      performance: {
        averageScore: Math.round(averageScore * 100) / 100,
        quizzesTaken: quizCount,
        totalQuizzes: quizzes.length,
      },
      quizAttempts: quizAttempts,
    };

    console.log(`FINAL STUDENT COURSE RESPONSE:`, JSON.stringify(responseData, null, 2));
    console.log(">>> COMPLETED: Get student course data\n");

    res.json(responseData);
  } catch (error) {
    console.error("Error getting student course data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Test connection
app.get("/api/test", async (req, res) => {
  try {
    console.log("\n>>> STARTING: Test connection");
    const siteInfo = await moodleRequest("core_webservice_get_site_info");
    if (siteInfo.error) return res.status(500).json(siteInfo);

    const responseData = {
      status: "success",
      siteName: siteInfo.sitename,
      moodleVersion: siteInfo.release,
      user: `${siteInfo.firstname} ${siteInfo.lastname}`,
      message: "Connection successful!",
    };

    console.log(`TEST CONNECTION RESPONSE:`, JSON.stringify(responseData, null, 2));
    console.log(">>> COMPLETED: Test connection\n");

    res.json(responseData);
  } catch (error) {
    console.error("Error in test connection:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, "").trim();
}

function getQuestionType(qtype) {
  const types = {
    multichoice: "Multiple Choice",
    truefalse: "True/False",
    shortanswer: "Short Answer",
    numerical: "Numerical",
    essay: "Essay",
    match: "Matching",
    cloze: "Cloze",
  };
  return types[qtype] || qtype || "Unknown";
}

// ============================================================================
// SERVE FRONTEND
// ============================================================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`
Server Started
Server: http://localhost:${PORT}
Moodle: ${MOODLE_URL}
Ready to process data with detailed console logging!

Commands:
  npm start     - Start server
  npm test      - Test Moodle connection
`);
});