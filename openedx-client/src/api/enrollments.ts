import { api } from "./client.ts";

export async function getEnrollments(user: string) {
  try {
    const response = await api.get(`/api/enrollment/v1/enrollments/?user=${user}`);
    return response.data.results;
  } catch (error: any) {
    console.error("Error fetching enrollments:", error.response?.status, error.response?.data || error.message);
    return [];
  }
}
