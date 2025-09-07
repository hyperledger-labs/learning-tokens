import { api } from "./client.ts";

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

export async function getCourseDetail(courseId: string) {
  try {
    const response = await api.get(`/api/courses/v1/courses/${encodeURIComponent(courseId)}`);
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
