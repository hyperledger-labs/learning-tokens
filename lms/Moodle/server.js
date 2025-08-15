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
  console.error("❌ Please set MOODLE_URL and MOODLE_TOKEN in .env file");
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Moodle API Helper
async function moodleRequest(wsfunction, params = {}) {
  const url = `${MOODLE_URL}/webservice/rest/server.php`;
  const formData = new URLSearchParams({
    wstoken: MOODLE_TOKEN,
    wsfunction: wsfunction,
    moodlewsrestformat: "json",
    ...params,
  });

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

    if (data.exception) {
      throw new Error(`Moodle Error: ${data.message}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${wsfunction}):`, error.message);
    return { error: error.message };
  }
}

// Calculate learning tokens from score
function calculateTokens(score) {
  return Math.max(1, Math.floor(score / 10));
}

// ============================================================================
// API ROUTES
// ============================================================================

// Get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await moodleRequest("core_course_get_courses");
    if (courses.error) return res.status(500).json(courses);

    // Filter out site course
    const filteredCourses = courses.filter((course) => course.id !== 1);
    res.json(filteredCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course details with students and tokens
app.get("/api/courses/:courseId", async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);

    // Get course info
    const courses = await moodleRequest("core_course_get_courses");
    const course = courses.find((c) => c.id === courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Get enrolled users
    const users = await moodleRequest("core_enrol_get_enrolled_users", {
      courseid: courseId,
    });
    if (users.error) return res.status(500).json(users);

    // Get quizzes
    const quizzesResponse = await moodleRequest(
      "mod_quiz_get_quizzes_by_courses",
      { "courseids[0]": courseId }
    );
    const quizzes = quizzesResponse.quizzes || [];

    // Process each student
    const students = [];
    for (const user of users) {
      if (!user.email || user.username?.includes("admin")) continue;

      let totalScore = 0;
      let quizCount = 0;

      // Calculate quiz performance
      for (const quiz of quizzes) {
        try {
          const attempts = await moodleRequest("mod_quiz_get_user_attempts", {
            quizid: quiz.id,
            userid: user.id,
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

            totalScore += Math.min(100, Math.max(0, percentage));
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
      const tokens = calculateTokens(averageScore);

      students.push({
        id: user.id,
        name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        email: user.email,
        score: Math.round(averageScore * 100) / 100,
        tokens: tokens,
        quizzesTaken: quizCount,
      });
    }

    // Sort by score
    students.sort((a, b) => b.score - a.score);

    // Calculate summary
    const totalTokens = students.reduce((sum, s) => sum + s.tokens, 0);
    const averageScore =
      students.length > 0
        ? students.reduce((sum, s) => sum + s.score, 0) / students.length
        : 0;

    res.json({
      course: {
        id: course.id,
        name: course.fullname,
        shortName: course.shortname,
        studentCount: students.length,
      },
      students: students,
      summary: {
        totalStudents: students.length,
        totalTokens: totalTokens,
        averageScore: Math.round(averageScore * 100) / 100,
        totalQuizzes: quizzes.length,
      },
      quizzes: quizzes.map((q) => ({
        id: q.id,
        name: q.name,
        maxGrade: q.grade,
        timeLimit: q.timelimit,
      })),
    });
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

    // Get quiz info
    const quizzesResponse = await moodleRequest(
      "mod_quiz_get_quizzes_by_courses",
      { "courseids[0]": 1 }
    );
    const allQuizzes = quizzesResponse.quizzes || [];

    // Find the specific quiz by checking all courses
    const courses = await moodleRequest("core_course_get_courses");
    let targetQuiz = null;

    for (const course of courses) {
      const courseQuizzes = await moodleRequest(
        "mod_quiz_get_quizzes_by_courses",
        { "courseids[0]": course.id }
      );
      const quiz = courseQuizzes.quizzes?.find((q) => q.id === quizId);
      if (quiz) {
        targetQuiz = quiz;
        break;
      }
    }

    if (!targetQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Get quiz attempts to analyze questions
    const attempts = await moodleRequest("mod_quiz_get_user_attempts", {
      quizid: quizId,
    });
    const questions = [];

    if (attempts.attempts && attempts.attempts.length > 0) {
      // Get attempt data for the first attempt to see questions
      const attemptId = attempts.attempts[0].id;
      const attemptData = await moodleRequest("mod_quiz_get_attempt_data", {
        attemptid: attemptId,
        page: -1,
      });

      if (attemptData.questions) {
        for (const question of attemptData.questions) {
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
    }

    res.json({
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
    });
  } catch (error) {
    console.error("Error getting quiz questions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get detailed attempt data with student's chosen answers
app.get("/api/attempts/:attemptId", async (req, res) => {
  try {
    const attemptId = parseInt(req.params.attemptId);

    // Get attempt data
    const attemptData = await moodleRequest("mod_quiz_get_attempt_data", {
      attemptid: attemptId,
      page: -1,
    });

    if (attemptData.error) {
      return res.status(500).json(attemptData);
    }

    // Get attempt review for more detailed answer information
    const attemptReview = await moodleRequest("mod_quiz_get_attempt_review", {
      attemptid: attemptId,
    });

    const questions = (attemptData.questions || []).map((question) => {
      const reviewQuestion = attemptReview.questions?.find(
        (rq) => rq.id === question.id
      );

      // Parse student's response
      let studentAnswer = "No answer";
      let chosenOption = null;

      if (question.response) {
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

    res.json({
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
        tokens: calculateTokens(percentage),
        timeTaken: attemptInfo.timeTaken
          ? `${Math.floor(attemptInfo.timeTaken / 60)} minutes`
          : "Unknown",
      },
    });
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

    const attempts = await moodleRequest("mod_quiz_get_user_attempts", {
      quizid: quizId,
      userid: userId,
    });

    if (attempts.error) {
      return res.status(500).json(attempts);
    }

    const attemptsList = (attempts.attempts || []).map((attempt) => ({
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
      tokens: calculateTokens(parseFloat(attempt.grade) || 0),
    }));

    // Sort by attempt number
    attemptsList.sort((a, b) => a.attempt - b.attempt);

    res.json({
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
    });
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

    // Get user info
    const userResponse = await moodleRequest("core_user_get_users_by_field", {
      field: "id",
      "values[0]": userId,
    });

    const user = userResponse[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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

          quizAttempts.push({
            quiz: {
              id: quiz.id,
              name: quiz.name,
              maxGrade: maxGrade,
            },
            bestAttempt: bestAttempt,
            allAttempts: attempts.attempts,
            score: Math.round(percentage * 100) / 100,
            tokens: calculateTokens(percentage),
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
    const totalTokens = quizAttempts.reduce((sum, qa) => sum + qa.tokens, 0);

    res.json({
      student: {
        id: user.id,
        name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        email: user.email,
        username: user.username,
      },
      courseId: courseId,
      performance: {
        averageScore: Math.round(averageScore * 100) / 100,
        totalTokens: totalTokens,
        quizzesTaken: quizCount,
        totalQuizzes: quizzes.length,
      },
      quizAttempts: quizAttempts,
    });
  } catch (error) {
    console.error("Error getting student course data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Test connection
app.get("/api/test", async (req, res) => {
  try {
    const siteInfo = await moodleRequest("core_webservice_get_site_info");
    if (siteInfo.error) return res.status(500).json(siteInfo);

    res.json({
      status: "success",
      siteName: siteInfo.sitename,
      moodleVersion: siteInfo.release,
      user: `${siteInfo.firstname} ${siteInfo.lastname}`,
      message: "Connection successful!",
    });
  } catch (error) {
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
🚀 Moodle Learning Tokens API Server Started
📍 Server: http://localhost:${PORT}
🔗 Moodle: ${MOODLE_URL}
✅ Ready to process learning tokens!

Commands:
  npm start     - Start server
  npm test      - Test Moodle connection
`);
});
