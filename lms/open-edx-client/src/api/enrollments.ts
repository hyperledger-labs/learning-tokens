import axios from "axios";

export interface Enrollment {
  created: string;
  mode: string;
  is_active: boolean;
  user: string;
  course_id: string;
}

export async function getEnrollments(): Promise<Enrollment[]> {
  try {
    const response = await axios.get("http://local.overhang.io/api/enrollment/v1/enrollments", {
      headers: {
        Cookie: "sessionid=1|bwbejtyrl7mleskg931vyds3q8eqzjfd|iT3RAhcR1FFC|IjJlNzEyMjExMDZhNzE4MzkzMThkNzdiNzA4MzQ3ZDBhM2RmODU0MzMxMjc4NjBjNTJmZmEyZTlkNmFlNGViMzYi:1uiw0m:P2YeRFmfZLUPBs6FN3-VociS-eI", // Replace with your valid session ID
      },
    });

    return response.data.results as Enrollment[];
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    throw error;
  }
}
