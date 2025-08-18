# 🪙 Moodle Learning Tokens API

A simple Node.js application that connects to Moodle, analyzes quiz questions and answers, calculates student performance, and awards learning tokens.

## ✨ Features

- **Direct Moodle Integration**: Connects to your Moodle via Web Services API
- **Quiz Question Analysis**: Gets detailed quiz questions, answers, and student responses
- **Learning Token Calculation**: Awards tokens based on quiz performance
- **Student Performance Tracking**: Shows scores, attempts, and progress
- **Simple Web Dashboard**: Easy-to-use interface to view all data
- **Real-time Data**: Pulls live data directly from Moodle

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 16+ installed
- Moodle 3.9+ with Web Services enabled
- Moodle Web Services token

### 2. Setup Moodle Web Services

**Enable Web Services:**
1. Go to **Site Administration > Advanced Features**
2. Enable "Enable web services"

**Create Web Service:**
1. Go to **Site Administration > Server > Web Services > External Services**
2. Add a new service with these functions:
   - `core_webservice_get_site_info`
   - `core_course_get_courses`
   - `core_enrol_get_enrolled_users`
   - `mod_quiz_get_quizzes_by_courses`
   - `mod_quiz_get_user_attempts`
   - `mod_quiz_get_attempt_data`

**Create Token:**
1. Go to **Site Administration > Server > Web Services > Manage Tokens**
2. Create a token for your user
3. Copy the token (32-character string)

### 3. Install and Configure

```bash
# 1. Clone or download the project
git clone https://github.com/yourusername/moodle-learning-tokens.git
cd moodle-learning-tokens

# 2. Install dependencies
npm install

# 3. Configure your settings
cp .env.example .env
# Edit .env with your Moodle URL and token

# 4. Test connection
npm test

# 5. Start the server
npm start
```

### 4. Access the Dashboard
Open http://localhost:5000 in your browser

## ⚙️ Configuration

Edit the `.env` file:

```env
# Your Moodle site URL
MOODLE_URL=https://your-moodle-site.com

# Your 32-character Web Services token
MOODLE_TOKEN=55a93e43d39a7904cccfa39410825e62

# Server port (optional)
PORT=5000
```

## 📖 How It Works

### Token Calculation
- **Base Formula**: `tokens = Math.floor(score / 10)`
- **Minimum**: 1 token per activity
- **Example**: 85% score = 8 tokens

### Quiz Analysis
- Retrieves all quiz questions and answer options
- Shows correct/incorrect answers with feedback
- Tracks student attempts and performance
- Calculates scores based on best attempts

### Student Performance
- Averages scores across all quiz attempts
- Shows individual quiz performance
- Tracks number of quizzes taken
- Awards tokens based on performance

## 🔗 API Endpoints

- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details with students and tokens
- `GET /api/quizzes/:id/questions` - Get quiz questions and answers
- `GET /api/students/:userId/quiz/:quizId/attempts` - Get all attempts by a student for a quiz
- `GET /api/attempts/:id` - Get detailed attempt analysis with chosen answers
- `GET /api/students/:userId/course/:courseId` - Get specific student's performance in a course
- `GET /api/test` - Test Moodle connection

## 🛠️ Usage Examples

### View Student's Chosen Answers
1. Start the server: `npm start`
2. Open http://localhost:5000
3. Click on any course to see student performance
4. Click "📊 View Attempts" next to any student
5. Click "📝 View Detailed Answers" on any attempt
6. See exactly what the student chose vs correct answers (marked with 👆)

### Analyze Quiz Performance
1. Go to any course
2. Click "❓ View Questions" on any quiz to see all questions and correct answers
3. Click "📊 View Attempts" on students to see their specific responses
4. Compare student choices with correct answers in the detailed view

### Get Student Attempt Data via API
```bash
# Get all attempts by student ID 123 for quiz ID 15
curl "http://localhost:5000/api/students/123/quiz/15/attempts"

# Get detailed analysis of attempt ID 89 showing chosen answers
curl "http://localhost:5000/api/attempts/89"
```

## 🐛 Troubleshooting

### "Connection failed" Error
1. Check your `MOODLE_URL` is correct and accessible
2. Verify your `MOODLE_TOKEN` is valid and active
3. Ensure Web Services are enabled in Moodle
4. Check that required functions are added to your web service

### "No courses found"
1. Make sure your token user is enrolled in courses
2. Check user permissions in Moodle
3. Verify the `core_course_get_courses` function is enabled

### "No questions found"
1. Ensure students have attempted the quizzes
2. Check quiz-related functions are enabled in web service
3. Verify quiz permissions for the token user

## 📋 Required Moodle Functions

Your Moodle web service must include:

```
core_webservice_get_site_info
core_course_get_courses
core_enrol_get_enrolled_users
mod_quiz_get_quizzes_by_courses
mod_quiz_get_user_attempts
mod_quiz_get_attempt_data
```

## 🎯 What You Get

- **Student Dashboard**: See all students, their scores, and tokens earned
- **Quiz Analysis**: View every question, answer option, and correctness
- **Performance Tracking**: Monitor student progress and improvement
- **Learning Tokens**: Gamified rewards based on actual performance
- **Real-time Data**: Always up-to-date information from your Moodle
- **Simple Interface**: Easy to use web dashboard

## 🤝 Support

- Create an issue on GitHub for bugs
- Check the troubleshooting section above
- Run `npm test` to diagnose connection problems
- Ensure your Moodle configuration is correct

## 📄 License

MIT License - feel free to use and modify for your needs.

---

**Built for educators who want to gamify learning with real Moodle data! 🎓**