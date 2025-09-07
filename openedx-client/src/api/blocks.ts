import { api } from "./client.ts";

/**
 * Fetch all course blocks for a specific course
 * @param courseId - course_id like "course-v1:universityX+CS101+2025"
 */
export async function getCourseBlocks(courseId: string) {
  try {
    const response = await api.get(`/api/courses/v2/blocks/`, {
      params: {
        course_id: courseId,
        all_blocks: true,
        depth: "all"
      }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching course blocks:", error.response?.status, error.response?.data || error.message);
    return null;
  }
}
