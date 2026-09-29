
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testCourse = {
  name: 'LFX API Test Course',
  section: 'API Demo Section',
  description: 'Test course created for LFX Mentorship Task demonstration',
  room: 'Virtual Room 101'
};

const testAssignment = {
  title: 'LFX Test Assignment',
  description: 'Sample assignment created via API for testing purposes',
  maxPoints: 100,
  workType: 'ASSIGNMENT'
};

class ClassroomAPITester {
  constructor() {
    this.courseId = null;
    this.assignmentId = null;
  }

  async checkStatus() {
    try {
      console.log('\n Checking authentication status...');
      const response = await axios.get(`${BASE_URL}/status`);
      console.log('Status:', response.data);
      return response.data.authenticated;
    } catch (error) {
      console.error(' Error checking status:', error.response?.data || error.message);
      return false;
    }
  }

  async getProfile() {
    try {
      console.log('\n Getting user profile...');
      const response = await axios.get(`${BASE_URL}/profile`);
      console.log(' Profile:', response.data.profile.name.fullName);
      console.log('Email:', response.data.profile.emailAddress);
      return response.data;
    } catch (error) {
      console.error(' Error getting profile:', error.response?.data || error.message);
      return null;
    }
  }

  async listCourses() {
    try {
      console.log('\n Listing all courses...');
      const response = await axios.get(`${BASE_URL}/courses`);
      console.log(` Found ${response.data.totalCount} courses`);
      
      if (response.data.courses.length > 0) {
        console.log('Courses:');
        response.data.courses.forEach((course, index) => {
          console.log(`  ${index + 1}. ${course.name} (ID: ${course.id})`);
        });
        
        // Store first course ID for later tests
        this.courseId = response.data.courses[0].id;
      }
      
      return response.data;
    } catch (error) {
      console.error(' Error listing courses:', error.response?.data || error.message);
      return null;
    }
  }

  async createCourse() {
    try {
      console.log('\n Creating test course...');
      const response = await axios.post(`${BASE_URL}/courses`, testCourse);
      console.log(' Course created successfully!');
      console.log('Course ID:', response.data.course.id);
      console.log('Course Name:', response.data.course.name);
      
      this.courseId = response.data.course.id;
      return response.data;
    } catch (error) {
      console.error(' Error creating course:', error.response?.data || error.message);
      return null;
    }
  }

  async getCourseDetails(courseId) {
    try {
      console.log(`\n Getting course details for: ${courseId}`);
      const response = await axios.get(`${BASE_URL}/courses/${courseId}`);
      console.log(' Course details retrieved');
      console.log('Name:', response.data.course.name);
      console.log('Section:', response.data.course.section);
      console.log('Description:', response.data.course.description);
      return response.data;
    } catch (error) {
      console.error(' Error getting course details:', error.response?.data || error.message);
      return null;
    }
  }

  async getTeachers(courseId) {
    try {
      console.log(`\n Getting teachers for course: ${courseId}`);
      const response = await axios.get(`${BASE_URL}/courses/${courseId}/teachers`);
      console.log(` Found ${response.data.count} teachers`);
      
      if (response.data.teachers.length > 0) {
        response.data.teachers.forEach((teacher, index) => {
          console.log(`  ${index + 1}. ${teacher.profile.name.fullName} (${teacher.profile.emailAddress})`);
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(' Error getting teachers:', error.response?.data || error.message);
      return null;
    }
  }

  async getStudents(courseId) {
    try {
      console.log(`\n Getting students for course: ${courseId}`);
      const response = await axios.get(`${BASE_URL}/courses/${courseId}/students`);
      console.log(` Found ${response.data.count} students`);
      
      if (response.data.students.length > 0) {
        response.data.students.forEach((student, index) => {
          console.log(`  ${index + 1}. ${student.profile.name.fullName} (${student.profile.emailAddress})`);
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(' Error getting students:', error.response?.data || error.message);
      return null;
    }
  }

  async listCoursework(courseId) {
    try {
      console.log(`\n Listing coursework for course: ${courseId}`);
      const response = await axios.get(`${BASE_URL}/courses/${courseId}/courseWork`);
      console.log(` Found ${response.data.count} coursework items`);
      
      if (response.data.courseWork.length > 0) {
        console.log('Coursework:');
        response.data.courseWork.forEach((work, index) => {
          console.log(`  ${index + 1}. ${work.title} (ID: ${work.id}) - ${work.maxPoints} points`);
        });
        
        // Store first assignment ID for later tests
        this.assignmentId = response.data.courseWork[0].id;
      }
      
      return response.data;
    } catch (error) {
      console.error(' Error listing coursework:', error.response?.data || error.message);
      return null;
    }
  }

  async createAssignment(courseId) {
    try {
      console.log(`\n➕ Creating test assignment in course: ${courseId}`);
      const response = await axios.post(`${BASE_URL}/courses/${courseId}/courseWork`, testAssignment);
      console.log(' Assignment created successfully!');
      console.log('Assignment ID:', response.data.courseWork.id);
      console.log('Assignment Title:', response.data.courseWork.title);
      console.log('Max Points:', response.data.courseWork.maxPoints);
      
      this.assignmentId = response.data.courseWork.id;
      return response.data;
    } catch (error) {
      console.error(' Error creating assignment:', error.response?.data || error.message);
      return null;
    }
  }

  async getSubmissions(courseId, assignmentId) {
    try {
      console.log(`\n Getting submissions for assignment: ${assignmentId}`);
      const response = await axios.get(`${BASE_URL}/courses/${courseId}/courseWork/${assignmentId}/studentSubmissions`);
      console.log(` Found ${response.data.count} submissions`);
      
      if (response.data.submissions.length > 0) {
        response.data.submissions.forEach((submission, index) => {
          const studentId = submission.userId || 'Unknown';
          const state = submission.state || 'Unknown';
          const grade = submission.assignedGrade !== undefined ? submission.assignedGrade : 'Not graded';
          console.log(`  ${index + 1}. Student: ${studentId}, State: ${state}, Grade: ${grade}`);
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(' Error getting submissions:', error.response?.data || error.message);
      return null;
    }
  }

  async runFullTest() {
    console.log(' Starting Google Classroom API Test Suite');
    console.log('=' .repeat(50));

    // Check authentication
    const isAuthenticated = await this.checkStatus();
    if (!isAuthenticated) {
      console.log('\n Not authenticated. Please run:');
      console.log('1. Start the server: npm start');
      console.log('2. Visit: http://localhost:3000/api/auth');
      console.log('3. Complete Google OAuth flow');
      console.log('4. Run this test again');
      return;
    }

    console.log(' Authenticated successfully!');

    // Test sequence
    await this.getProfile();
    await this.listCourses();

    // If no courses exist, create one
    if (!this.courseId) {
      await this.createCourse();
    }

    if (this.courseId) {
      await this.getCourseDetails(this.courseId);
      await this.getTeachers(this.courseId);
      await this.getStudents(this.courseId);
      await this.listCoursework(this.courseId);

      // Create assignment if none exist
      if (!this.assignmentId) {
        await this.createAssignment(this.courseId);
      }

      if (this.assignmentId) {
        await this.getSubmissions(this.courseId, this.assignmentId);
      }
    }

    console.log('\n API Test Suite Completed!');
    console.log('=' .repeat(50));
  }

  async runQuickTest() {
    console.log(' Quick API Test');
    console.log('=' .repeat(30));

    const isAuthenticated = await this.checkStatus();
    if (!isAuthenticated) {
      console.log('\n Authentication required. Visit: http://localhost:3000/api/auth');
      return;
    }

    await this.getProfile();
    await this.listCourses();

    console.log('\n Quick test completed!');
  }
}

// Command line usage
const args = process.argv.slice(2);
const tester = new ClassroomAPITester();

if (args.includes('--quick')) {
  tester.runQuickTest();
} else if (args.includes('--help')) {
  console.log('Google Classroom API Tester');
  console.log('Usage:');
  console.log('  node test.js          - Run full test suite');
  console.log('  node test.js --quick  - Run quick test');
  console.log('  node test.js --help   - Show this help');
} else {
  tester.runFullTest();
}

module.exports = ClassroomAPITester;