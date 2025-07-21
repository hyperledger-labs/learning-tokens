import {
  EdxAssessmentParticipant,
  EdxEnrollment,
  EdxAssessment,
  EdxAssessmentQuestion,
  EdxAssessmentResponse,
  EdxCourseGrade,
  EdxAssessmentAttendance,
  EdxAssessmentAnalytics,
  EdxInstructor,
  EdxCertificate,
  ApiResponse
} from '../types/edx.d';
import axios from 'axios';

// Open edX API base URL - update this to your actual Open edX instance
const baseUrl = 'http://local.openedx.io/api';

// Helper function to get auth headers
function getAuthHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

export async function getEdxUserProfile(
  userId: number,
  accessToken: string
): Promise<ApiResponse<EdxAssessmentParticipant>> {
  try {
    // Using Open edX user API endpoint
    const response = await axios.get(`${baseUrl}/user/v1/accounts/${userId}`, {
      headers: getAuthHeaders(accessToken),
    });
    return {
      data: response.data as EdxAssessmentParticipant,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: {} as EdxAssessmentParticipant,
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxUserEnrollments(
  userId: number,
  accessToken: string
): Promise<ApiResponse<EdxEnrollment[]>> {
  try {
    // Using Open edX enrollment API endpoint
    const response = await axios.get(`${baseUrl}/enrollment/v1/enrollment`, {
      headers: getAuthHeaders(accessToken),
      params: { user: userId }
    });
    return {
      data: response.data as EdxEnrollment[],
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: [],
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxCourseAssessments(
  courseId: string,
  accessToken: string
): Promise<ApiResponse<EdxAssessment[]>> {
  try {
    // Using Open edX course API endpoint for assessments
    const response = await axios.get(`${baseUrl}/course_structure/v0/courses/${courseId}`, {
      headers: getAuthHeaders(accessToken),
    });
    return {
      data: response.data as EdxAssessment[],
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: [],
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxAssessmentQuestions(
  assessmentId: string,
  accessToken: string
): Promise<ApiResponse<EdxAssessmentQuestion[]>> {
  try {
    // Using Open edX XBlock API for assessment questions
    const response = await axios.get(`${baseUrl}/xblock/v2/xblocks/${assessmentId}`, {
      headers: getAuthHeaders(accessToken),
    });
    return {
      data: response.data as EdxAssessmentQuestion[],
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: [],
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxAssessmentResponses(
  assessmentId: string,
  accessToken: string,
  userId?: number
): Promise<ApiResponse<EdxAssessmentResponse[]>> {
  try {
    let url = `${baseUrl}/xblock/v2/xblocks/${assessmentId}`;
    if (userId) {
      url += `?user_id=${userId}`;
    }
    const response = await axios.get(url, {
      headers: getAuthHeaders(accessToken),
    });
    return {
      data: response.data as EdxAssessmentResponse[],
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: [],
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxCourseGrade(
  courseId: string,
  userId: number,
  accessToken: string
): Promise<ApiResponse<EdxCourseGrade>> {
  try {
    // Using Open edX grades API endpoint
    const response = await axios.get(`${baseUrl}/grades/v1/courses/${courseId}/graded_subsections/`, {
      headers: getAuthHeaders(accessToken),
      params: { username: userId }
    });
    return {
      data: response.data as EdxCourseGrade,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: {} as EdxCourseGrade,
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxCourseParticipants(
  courseId: string,
  accessToken: string
): Promise<ApiResponse<EdxAssessmentParticipant[]>> {
  try {
    // Using Open edX enrollment API to get course participants
    const response = await axios.get(`${baseUrl}/enrollment/v1/enrollment`, {
      headers: getAuthHeaders(accessToken),
      params: { course_id: courseId }
    });
    return {
      data: response.data as EdxAssessmentParticipant[],
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: [],
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxCourseInstructors(
  courseId: string,
  accessToken: string
): Promise<ApiResponse<EdxInstructor[]>> {
  try {
    // Using Open edX course API for instructors
    const response = await axios.get(`${baseUrl}/course_structure/v0/courses/${courseId}`, {
      headers: getAuthHeaders(accessToken),
    });
    return {
      data: response.data as EdxInstructor[],
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: [],
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxAssessmentAttendance(
  assessmentId: string,
  accessToken: string
): Promise<ApiResponse<EdxAssessmentAttendance[]>> {
  try {
    // Using Open edX XBlock API for attendance tracking
    const response = await axios.get(`${baseUrl}/xblock/v2/xblocks/${assessmentId}`, {
      headers: getAuthHeaders(accessToken),
    });
    return {
      data: response.data as EdxAssessmentAttendance[],
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: [],
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxAssessmentAnalytics(
  courseId: string,
  assessmentId: string,
  accessToken: string
): Promise<ApiResponse<EdxAssessmentAnalytics>> {
  try {
    // Using Open edX analytics API
    const response = await axios.get(`${baseUrl}/analytics/v0/courses/${courseId}/`, {
      headers: getAuthHeaders(accessToken),
    });
    return {
      data: response.data as EdxAssessmentAnalytics,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: {} as EdxAssessmentAnalytics,
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxUserCertificate(
  courseId: string,
  userId: number,
  accessToken: string
): Promise<ApiResponse<EdxCertificate>> {
  try {
    // Using Open edX certificates API
    const response = await axios.get(`${baseUrl}/certificates/v0/certificates/${courseId}`, {
      headers: getAuthHeaders(accessToken),
      params: { username: userId }
    });
    return {
      data: response.data as EdxCertificate,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    return {
      data: {} as EdxCertificate,
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      message: error.message,
    };
  }
}

export async function getEdxCourses(accessToken: string): Promise<ApiResponse<any>> {
  const response = await axios.get(`${baseUrl}/courses/v1/courses/`, {
    headers: getAuthHeaders(accessToken),
  });
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  };
}

// ==================== DATA PROCESSING FUNCTIONS ====================

// Process course participants and their assessment data
export function processEdxCourseData(
  participants: EdxAssessmentParticipant[],
  assessments: EdxAssessment[],
  grades: EdxCourseGrade[]
): Map<string, any> {
  const participantMap = new Map<string, any>();
  
  participants.forEach(participant => {
    const userData = {
      userId: participant.user_id,
      username: participant.username,
      email: participant.email,
      fullName: participant.full_name,
      LTId: participant.LTId,
      enrollments: participant.enrollments,
      assessmentsTaken: participant.assessments_taken,
      certificate: participant.certificate,
      totalScore: 0,
      attemptedAssessments: 0,
      totalAssessments: assessments.length,
      courseGrade: null as EdxCourseGrade | null
    };
    
    // Find matching grade
    const grade = grades.find(g => g.user_id === participant.user_id);
    if (grade) {
      userData.courseGrade = grade;
      userData.totalScore = grade.percent_grade * 100; // Convert to percentage
    }
    
    participantMap.set(participant.username, userData);
  });
  
  return participantMap;
}

// Calculate assessment scores for participants
export function calculateEdxAssessmentScores(
  assessmentQuestions: EdxAssessmentQuestion[],
  assessmentResponses: EdxAssessmentResponse[]
): Map<string, any> {
  const scoreMap = new Map<string, any>();
  
  assessmentResponses.forEach(response => {
    const question = assessmentQuestions.find(q => q.id === response.question_id);
    if (question) {
      const score = {
        questionId: response.question_id,
        assessmentId: response.assessment_id,
        userId: response.user_id,
        answer: response.answer,
        score: response.score,
        maxScore: question.max_score,
        submittedAt: response.submitted_at,
        gradedBy: response.graded_by,
        gradedAt: response.graded_at
      };
      
      const key = `${response.user_id}_${response.assessment_id}`;
      if (!scoreMap.has(key)) {
        scoreMap.set(key, []);
      }
      scoreMap.get(key).push(score);
    }
  });
  
  return scoreMap;
}

// Aggregate participant data for Learning Token generation
export function aggregateEdxParticipantData(
  participantMap: Map<string, any>,
  assessmentScores: Map<string, any>
): any {
  const aggregatedData = {
    participants: [] as any[],
    totalParticipants: participantMap.size,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 100,
    completionRate: 0
  };
  
  let totalScore = 0;
  let completedParticipants = 0;
  
  participantMap.forEach((participant, username) => {
    const assessmentKey = `${participant.userId}_${participant.assessmentsTaken[0]?.assessment_id || 'unknown'}`;
    const scores = assessmentScores.get(assessmentKey) || [];
    
    const participantData = {
      ...participant,
      assessmentScores: scores,
      totalAssessmentScore: scores.reduce((sum: number, score: any) => sum + score.score, 0),
      maxAssessmentScore: scores.reduce((sum: number, score: any) => sum + score.maxScore, 0),
      completionPercentage: participant.courseGrade ? participant.courseGrade.percent_grade * 100 : 0
    };
    
    aggregatedData.participants.push(participantData);
    
    if (participantData.completionPercentage > 0) {
      completedParticipants++;
      totalScore += participantData.completionPercentage;
      
      if (participantData.completionPercentage > aggregatedData.highestScore) {
        aggregatedData.highestScore = participantData.completionPercentage;
      }
      if (participantData.completionPercentage < aggregatedData.lowestScore) {
        aggregatedData.lowestScore = participantData.completionPercentage;
      }
    }
  });
  
  aggregatedData.averageScore = completedParticipants > 0 ? totalScore / completedParticipants : 0;
  aggregatedData.completionRate = (completedParticipants / aggregatedData.totalParticipants) * 100;
  
  return aggregatedData;
}

// Main function to process all edX data (similar to zoomprocessor's run function)
export async function processEdxData(
  courseId: string,
  accessToken: string
): Promise<any> {
  try {
    // Fetch all required data
    const participantsResponse = await getEdxCourseParticipants(courseId, accessToken);
    const assessmentsResponse = await getEdxCourseAssessments(courseId, accessToken);
    const gradesResponse = await getEdxCourseGrade(courseId, 0, accessToken); // Will need to iterate through users
    
    if (participantsResponse.status !== 200 || assessmentsResponse.status !== 200) {
      throw new Error('Failed to fetch course data');
    }
    
    // Process the data
    const participantMap = processEdxCourseData(
      participantsResponse.data,
      assessmentsResponse.data,
      [gradesResponse.data] // This should be an array of grades for all participants
    );
    
    // For now, create empty assessment scores (you'll need to implement this based on your specific needs)
    const assessmentScores = new Map<string, any>();
    
    // Aggregate the data
    const aggregatedData = aggregateEdxParticipantData(participantMap, assessmentScores);
    
    return {
      courseId,
      processedAt: new Date().toISOString(),
      ...aggregatedData
    };
    
  } catch (error) {
    console.error('Error processing edX data:', error);
    throw error;
  }
}

export async function getEdxAccessToken(
  username: string,
  password: string,
  clientId: string,
  clientSecret: string,
  baseUrl: string = process.env.EDX_BASE_URL || 'http://local.openedx.io/api'
): Promise<string> {
  const url = `${baseUrl.replace(/\/api$/, '')}/oauth2/access_token/`;
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  const response = await axios.post(url, params);
  return response.data.access_token;
}

