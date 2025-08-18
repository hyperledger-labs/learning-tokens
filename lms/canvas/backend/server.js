const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const CANVAS_API_BASE = process.env.CANVAS_API_BASE;
const CANVAS_TOKEN = process.env.CANVAS_API_TOKEN;

const headers = {
  Authorization: `Bearer ${CANVAS_TOKEN}`
};

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/courses', async (req, res) => {
  try {
    const response = await axios.get(`${CANVAS_API_BASE}/courses`, { headers });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/courses/:courseId/assignments', async (req, res) => {
  try {
    const { courseId } = req.params;
    const response = await axios.get(`${CANVAS_API_BASE}/courses/${courseId}/assignments`, { headers });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get enrolled students
app.get('/courses/:courseId/students', async (req, res) => {
  try {
    const { courseId } = req.params;
    const response = await axios.get(`${CANVAS_API_BASE}/courses/${courseId}/enrollments?type[]=StudentEnrollment`, { headers });
    const students = response.data.map(e => ({
      id: e.user.id,
      name: e.user.name,
      login_id: e.user.login_id
    }));
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get quiz grades for all students
app.get('/courses/:courseId/quizzes/:quizId/grades', async (req, res) => {
  try {
    const { courseId, quizId } = req.params;

    // Get quiz submissions
    const submissionsRes = await axios.get(`${CANVAS_API_BASE}/courses/${courseId}/quizzes/${quizId}/submissions`, { headers });
    const submissions = submissionsRes.data.quiz_submissions;

    // Get enrolled students to map user_id → name/login_id
    const enrollmentsRes = await axios.get(`${CANVAS_API_BASE}/courses/${courseId}/enrollments?type[]=StudentEnrollment`, { headers });
    const userMap = {};
    enrollmentsRes.data.forEach(e => {
      userMap[e.user.id] = {
        name: e.user.name,
        login_id: e.user.login_id
      };
    });

    const grades = submissions.map(sub => ({
      user_id: sub.user_id,
      score: sub.score,
      name: userMap[sub.user_id]?.name || 'Unknown',
      login_id: userMap[sub.user_id]?.login_id || 'Unknown'
    }));

    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get files uploaded in a course
app.get('/courses/:courseId/files', async (req, res) => {
  try {
    const { courseId } = req.params;
    const response = await axios.get(`${CANVAS_API_BASE}/courses/${courseId}/files`, { headers });
    
    // Format the files data for better frontend display
    const files = response.data.map(file => ({
      id: file.id,
      display_name: file.display_name,
      filename: file.filename,
      content_type: file['content-type'],
      size: file.size,
      url: file.url,
      created_at: file.created_at,
      updated_at: file.updated_at,
      folder_id: file.folder_id,
      locked: file.locked,
      hidden: file.hidden,
      preview_url: file.preview_url
    }));
    
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get folders in a course (optional - to organize files better)
app.get('/courses/:courseId/folders', async (req, res) => {
  try {
    const { courseId } = req.params;
    const response = await axios.get(`${CANVAS_API_BASE}/courses/${courseId}/folders`, { headers });
    
    const folders = response.data.map(folder => ({
      id: folder.id,
      name: folder.name,
      full_name: folder.full_name,
      parent_folder_id: folder.parent_folder_id,
      files_count: folder.files_count,
      folders_count: folder.folders_count,
      created_at: folder.created_at
    }));
    
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));









// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// const CANVAS_API_BASE = process.env.CANVAS_API_BASE;
// const CANVAS_TOKEN = process.env.CANVAS_API_TOKEN;

// const headers = {
//   Authorization: `Bearer ${CANVAS_TOKEN}`
// };

// // List all courses

// app.get('/', (req, res) => {
//   res.send('Backend is running!');
// });


// app.get('/courses', async (req, res) => {
//   try {
//     const response = await axios.get(`${CANVAS_API_BASE}/courses`, { headers });
//     res.json(response.data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // List assignments in a course
// app.get('/courses/:courseId/assignments', async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const response = await axios.get(`${CANVAS_API_BASE}/courses/${courseId}/assignments`, { headers });
//     res.json(response.data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
