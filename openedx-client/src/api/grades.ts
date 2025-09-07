import { api } from "./client.ts";

/**
 * Fetch gradebook (all learners' grades) for a specific course
 * @param courseId - course_id like "course-v1:universityX+CS101+2025"
 */
export async function getCourseGradebook(courseId: string) {
  try {
    const response = await api.get(
      `/api/grades/v1/gradebook/${encodeURIComponent(courseId)}/`
    );
    return response.data; // contains all learners’ grades
  } catch (error: any) {
    console.error(
      "Error fetching gradebook:",
      error.response?.status,
      error.response?.data || error.message
    );
    return null;
  }
}
