import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Axios client
export const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

/**
 * Fetch all courses
 */
export async function getCourses() {
  try {
    const response = await api.get("/api/courses/v1/courses/");
    return response.data.results;
  } catch (error: any) {
    console.error(
      "Error fetching courses:",
      error.response?.status,
      error.response?.data || error.message
    );
    return [];
  }
}

/**
 * Fetch details of a specific course
 * @param courseId - course_id like "course-v1:universityX+CS101+2025"
 */
export async function getCourseDetail(courseId: string) {
  try {
    const response = await api.get(
      `/api/courses/v1/courses/${encodeURIComponent(courseId)}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching course ${courseId}:`,
      error.response?.status,
      error.response?.data || error.message
    );
    return null;
  }
}

/**
 * Fetch all blocks for a specific course
 */
export async function getCourseBlocks(courseId: string) {
  try {
    const response = await api.get(`/api/courses/v2/blocks/`, {
      params: {
        course_id: courseId,
        all_blocks: true,
        depth: "all",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching course blocks:",
      error.response?.status,
      error.response?.data || error.message
    );
    return null;
  }
}

/**
 * Fetch instructors for a specific course
 */
export async function getCourseInstructors(courseId: string) {
  try {
    const response = await api.get(
      `/api/course_home/v1/course_metadata/${encodeURIComponent(courseId)}/`
    );
    return response.data.instructors; // usually an array of objects
  } catch (error: any) {
    console.error(
      `Error fetching instructors for ${courseId}:`,
      error.response?.status,
      error.response?.data || error.message
    );
    return [];
  }
}

/**
 * Fetch enrollments of a user
 */
export async function getEnrollments(user: string) {
  try {
    const response = await api.get(`/api/enrollment/v1/enrollments/?user=${user}`);
    return response.data.results;
  } catch (error: any) {
    console.error(
      "Error fetching enrollments:",
      error.response?.status,
      error.response?.data || error.message
    );
    return [];
  }
}

/**
 * Fetch gradebook (all learners' grades) for a specific course
 */
export async function getCourseGradebook(courseId: string) {
  try {
    const response = await api.get(
      `/api/grades/v1/gradebook/${encodeURIComponent(courseId)}/`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching gradebook:",
      error.response?.status,
      error.response?.data || error.message
    );
    return null;
  }
}
