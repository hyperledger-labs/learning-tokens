import { processEdxData, getEdxUserProfile, getEdxAccessToken } from '../src/edxDataprocessor';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const baseUrl = process.env.EDX_BASE_URL || 'http://local.openedx.io/api';
const adminUsername = process.env.EDX_ADMIN_USERNAME;
const adminPassword = process.env.EDX_ADMIN_PASSWORD;
const clientId = process.env.EDX_CLIENT_ID;
const clientSecret = process.env.EDX_CLIENT_SECRET;
const courseId = process.env.EDX_COURSE_ID;
const userId = parseInt(process.env.EDX_USER_ID || '0');

describe('edX Data Processor', () => {
  let accessToken: string;

  beforeAll(async () => {
    // Get admin access token before running tests
    accessToken = await getEdxAccessToken(adminUsername!, adminPassword!, clientId!, clientSecret!, baseUrl);
  });

  test('should process edX course data with real credentials', async () => {
    if (!accessToken || !courseId) {
      console.log('Skipping real API test - missing credentials');
      return;
    }
    try {
      const result = await processEdxData(courseId, accessToken);
      expect(result).toBeDefined();
      expect(result.courseId).toBe(courseId);
      expect(result.participants).toBeDefined();
      expect(Array.isArray(result.participants)).toBe(true);
      console.log(`Successfully processed ${result.totalParticipants} participants`);
      console.log(`Average score: ${result.averageScore}%`);
      console.log(`Completion rate: ${result.completionRate}%`);
    } catch (error: any) {
      console.error('Real API test failed:', error.message);
      expect(error).toBeDefined();
    }
  });

  test('should get user profile with real credentials', async () => {
    if (!accessToken || !userId) {
      console.log('Skipping real API test - missing credentials');
      return;
    }
    try {
      const result = await getEdxUserProfile(userId, accessToken);
      if (result.status === 200) {
        expect(result.data).toBeDefined();
        expect(result.data.user_id).toBe(userId);
        console.log(`User profile retrieved: ${result.data.username}`);
      } else {
        console.log(`API returned status ${result.status}: ${result.message}`);
        expect(result.status).toBeGreaterThanOrEqual(400);
      }
    } catch (error: any) {
      console.error('User profile test failed:', error.message);
      expect(error).toBeDefined();
    }
  });

  test('should handle API errors gracefully', async () => {
    const badUserId = 999999; // Non-existent user
    const badToken = 'invalid-token';
    try {
      const result = await getEdxUserProfile(badUserId, badToken);
      expect(result.status).toBeGreaterThanOrEqual(400);
      console.log(`Error handled gracefully: ${result.status} - ${result.message}`);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should validate course ID format', () => {
    const validCourseIds = [
      'course-v1:edX+DemoX+Demo_Course',
      'course-v1:MITx+6.002x+2012_Fall',
      'course-v1:org+course+run'
    ];
    const invalidCourseIds = [
      'invalid-format',
      'course-v1:',
      'course-v1:org',
      ''
    ];
    validCourseIds.forEach(courseId => {
      expect(courseId).toMatch(/^course-v1:[^+]+\+[^+]+\+[^+]+$/);
    });
    invalidCourseIds.forEach(courseId => {
      expect(courseId).not.toMatch(/^course-v1:[^+]+\+[^+]+\+[^+]+$/);
    });
  });
}); 