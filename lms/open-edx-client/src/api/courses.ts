import { client } from "./client";

export const getCourseDetails = async (courseId: string) => {
  const response = await client.get(`/api/courses/v1/courses/${courseId}`);
  return response.data;
};
