require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// OAuth2 Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes for Google Classroom API
const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/classroom.rosters',
  'https://www.googleapis.com/auth/classroom.profile.emails',
  'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
  'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly'
];

// Initialize Classroom API
let classroom = null;
let tokens = null;

// Authentication Routes
app.get('/api/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  
  console.log('\n=== AUTHENTICATION REQUIRED ===');
  console.log('Visit this URL to authenticate:');
  console.log(authUrl);
  console.log('================================\n');
  
  res.json({ 
    authUrl,
    message: 'Visit the authUrl to complete authentication'
  });
});

app.get('/api/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens: receivedTokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(receivedTokens);
    tokens = receivedTokens;
    classroom = google.classroom({ version: 'v1', auth: oauth2Client });

    console.log(' Authentication successful!');
    console.log('Access Token:', receivedTokens.access_token);
    console.log('Refresh Token:', receivedTokens.refresh_token);

    res.json({
      success: true,
      message: 'Authentication successful! You can now use the APIs.',
      tokens: receivedTokens   // 👈 add this line
    });
  } catch (error) {
    console.error(' Authentication failed:', error.message);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});


// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!tokens || !classroom) {
    return res.status(401).json({ 
      error: 'Not authenticated',
      message: 'Please visit /api/auth to get authentication URL'
    });
  }
  next();
};

// === COURSE APIs ===

// GET /api/courses - List all courses
app.get('/api/courses', requireAuth, async (req, res) => {
  try {
    console.log(' Fetching courses...');
    
    const response = await classroom.courses.list({
      pageSize: 100,
    });
    
    const courses = response.data.courses || [];
    
    console.log(` Found ${courses.length} courses`);
    courses.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.name} (ID: ${course.id})`);
    });
    
    res.json({
      success: true,
      totalCount: courses.length,
      courses: courses
    });
  } catch (error) {
    console.error(' Error fetching courses:', error.message);
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
  }
});

// GET /api/courses/:courseId - Get specific course details
app.get('/api/courses/:courseId', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(` Fetching course details for: ${courseId}`);
    
    const response = await classroom.courses.get({
      id: courseId,
    });
    
    console.log(` Course details retrieved: ${response.data.name}`);
    
    res.json({
      success: true,
      course: response.data
    });
  } catch (error) {
    console.error(' Error fetching course details:', error.message);
    res.status(500).json({ error: 'Failed to fetch course details', details: error.message });
  }
});

// POST /api/courses - Create a new course
app.post('/api/courses', requireAuth, async (req, res) => {
  try {
    const { name, section, description, room } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Course name is required' });
    }
    
    console.log(` Creating new course: ${name}`);
    
    const courseData = {
      name,
      section: section || 'Default Section',
      description: description || '',
      room: room || '',
      ownerId: 'me',
      courseState: 'ACTIVE'
    };
    
    const response = await classroom.courses.create({
      requestBody: courseData,
    });
    
    console.log(` Course created successfully: ${response.data.name} (ID: ${response.data.id})`);
    
    res.json({
      success: true,
      message: 'Course created successfully',
      course: response.data
    });
  } catch (error) {
    console.error(' Error creating course:', error.message);
    res.status(500).json({ error: 'Failed to create course', details: error.message });
  }
});

// === USER APIs ===

// GET /api/courses/:courseId/teachers - List teachers in a course
app.get('/api/courses/:courseId/teachers', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(` Fetching teachers for course: ${courseId}`);
    
    const response = await classroom.courses.teachers.list({
      courseId,
    });
    
    const teachers = response.data.teachers || [];
    console.log(` Found ${teachers.length} teachers`);
    
    res.json({
      success: true,
      count: teachers.length,
      teachers: teachers
    });
  } catch (error) {
    console.error(' Error fetching teachers:', error.message);
    res.status(500).json({ error: 'Failed to fetch teachers', details: error.message });
  }
});

// GET /api/courses/:courseId/students - List students in a course
app.get('/api/courses/:courseId/students', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(`👨‍🎓 Fetching students for course: ${courseId}`);
    
    const response = await classroom.courses.students.list({
      courseId,
    });
    
    const students = response.data.students || [];
    console.log(` Found ${students.length} students`);
    
    res.json({
      success: true,
      count: students.length,
      students: students
    });
  } catch (error) {
    console.error(' Error fetching students:', error.message);
    res.status(500).json({ error: 'Failed to fetch students', details: error.message });
  }
});

// === COURSEWORK APIs ===

// GET /api/courses/:courseId/courseWork - List all coursework in a course
app.get('/api/courses/:courseId/courseWork', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(` Fetching coursework for course: ${courseId}`);
    
    const response = await classroom.courses.courseWork.list({
      courseId,
    });
    
    const courseWork = response.data.courseWork || [];
    console.log(` Found ${courseWork.length} coursework items`);
    courseWork.forEach((work, index) => {
      console.log(`  ${index + 1}. ${work.title} (ID: ${work.id})`);
    });
    
    res.json({
      success: true,
      count: courseWork.length,
      courseWork: courseWork
    });
  } catch (error) {
    console.error(' Error fetching coursework:', error.message);
    res.status(500).json({ error: 'Failed to fetch coursework', details: error.message });
  }
});

// POST /api/courses/:courseId/courseWork - Create new coursework/assignment
app.post('/api/courses/:courseId/courseWork', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, workType, maxPoints, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Assignment title is required' });
    }
    
    console.log(` Creating new assignment: ${title} in course ${courseId}`);
    
    const courseWorkData = {
      title,
      description: description || '',
      workType: workType || 'ASSIGNMENT',
      state: 'PUBLISHED',
      maxPoints: maxPoints || 100
    };
    
    // Add due date if provided
    if (dueDate) {
      const date = new Date(dueDate);
      courseWorkData.dueDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
      courseWorkData.dueTime = {
        hours: 23,
        minutes: 59
      };
    }
    
    const response = await classroom.courses.courseWork.create({
      courseId,
      requestBody: courseWorkData,
    });
    
    console.log(` Assignment created: ${response.data.title} (ID: ${response.data.id})`);
    
    res.json({
      success: true,
      message: 'Assignment created successfully',
      courseWork: response.data
    });
  } catch (error) {
    console.error(' Error creating assignment:', error.message);
    res.status(500).json({ error: 'Failed to create assignment', details: error.message });
  }
});

// === SUBMISSION APIs ===

// GET /api/courses/:courseId/courseWork/:courseWorkId/studentSubmissions - Get student submissions
app.get('/api/courses/:courseId/courseWork/:courseWorkId/studentSubmissions', requireAuth, async (req, res) => {
  try {
    const { courseId, courseWorkId } = req.params;
    console.log(` Fetching submissions for coursework: ${courseWorkId}`);
    
    const response = await classroom.courses.courseWork.studentSubmissions.list({
      courseId,
      courseWorkId,
    });
    
    const submissions = response.data.studentSubmissions || [];
    console.log(` Found ${submissions.length} submissions`);
    
    res.json({
      success: true,
      count: submissions.length,
      submissions: submissions
    });
  } catch (error) {
    console.error(' Error fetching submissions:', error.message);
    res.status(500).json({ error: 'Failed to fetch submissions', details: error.message });
  }
});

// PATCH /api/courses/:courseId/courseWork/:courseWorkId/studentSubmissions/:id - Update/grade submission
app.patch('/api/courses/:courseId/courseWork/:courseWorkId/studentSubmissions/:id', requireAuth, async (req, res) => {
  try {
    const { courseId, courseWorkId, id } = req.params;
    const { assignedGrade, draftGrade } = req.body;
    
    console.log(` Updating submission: ${id}`);
    
    const updateData = {};
    if (assignedGrade !== undefined) updateData.assignedGrade = assignedGrade;
    if (draftGrade !== undefined) updateData.draftGrade = draftGrade;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No grade data provided' });
    }
    
    const response = await classroom.courses.courseWork.studentSubmissions.patch({
      courseId,
      courseWorkId,
      id,
      updateMask: Object.keys(updateData).join(','),
      requestBody: updateData,
    });
    
    console.log(' Submission updated successfully');
    
    res.json({
      success: true,
      message: 'Submission updated successfully',
      submission: response.data
    });
  } catch (error) {
    console.error(' Error updating submission:', error.message);
    res.status(500).json({ error: 'Failed to update submission', details: error.message });
  }
});

// === UTILITY APIs ===

// GET /api/profile - Get current user profile
app.get('/api/profile', requireAuth, async (req, res) => {
  try {
    console.log(' Fetching user profile...');
    
    const response = await classroom.userProfiles.get({
      userId: 'me',
    });
    
    console.log(` Profile retrieved: ${response.data.name.fullName}`);
    
    res.json({
      success: true,
      profile: response.data
    });
  } catch (error) {
    console.error(' Error fetching profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

// GET /api/status - Check authentication status
app.get('/api/status', (req, res) => {
  const isAuthenticated = !!tokens && !!classroom;
  
  res.json({
    authenticated: isAuthenticated,
    hasClassroomAccess: isAuthenticated,
    message: isAuthenticated ? 'Ready to use APIs' : 'Authentication required'
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Google Classroom API Server - LFX Mentorship Task',
    version: '1.0.0',
    authentication: {
      status: !!tokens ? 'Authenticated' : 'Not Authenticated',
      authUrl: '/api/auth'
    },
    endpoints: {
      authentication: {
        'GET /api/auth': 'Get authentication URL',
        'GET /api/google/callback': 'OAuth callback (used by Google)',
        'GET /api/status': 'Check authentication status',
        'GET /api/profile': 'Get current user profile'
      },
      courses: {
        'GET /api/courses': 'List all courses',
        'GET /api/courses/:courseId': 'Get course details',
        'POST /api/courses': 'Create new course (requires: name, optional: section, description, room)'
      },
      users: {
        'GET /api/courses/:courseId/teachers': 'List teachers in course',
        'GET /api/courses/:courseId/students': 'List students in course'
      },
      coursework: {
        'GET /api/courses/:courseId/courseWork': 'List coursework in course',
        'POST /api/courses/:courseId/courseWork': 'Create assignment (requires: title, optional: description, maxPoints, dueDate)'
      },
      submissions: {
        'GET /api/courses/:courseId/courseWork/:courseWorkId/studentSubmissions': 'Get student submissions',
        'PATCH /api/courses/:courseId/courseWork/:courseWorkId/studentSubmissions/:id': 'Grade submission (requires: assignedGrade or draftGrade)'
      }
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(' Global error:', error);
  res.status(500).json({ error: 'Internal server error', details: error.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', availableEndpoints: 'Visit GET / for API documentation' });
});

app.listen(PORT, () => {
  console.log('\n Google Classroom API Server Started');
  console.log(` Server running on: http://localhost:${PORT}`);
  console.log(' API Documentation: GET /');
  console.log(' Authentication: GET /api/auth');
  console.log('\n=== Quick Start ===');
  console.log('1. Visit http://localhost:3000/api/auth to get authentication URL');
  console.log('2. Complete Google OAuth flow');
  console.log('3. Start using the APIs');
  console.log('==================\n');
});

module.exports = app;