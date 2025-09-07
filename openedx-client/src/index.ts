import { getCourses, getCourseDetail } from "./api/courses.ts";
import { getEnrollments } from "./api/enrollments.ts";
import { getCourseGradebook } from "./api/grades.ts";
import { getCourseBlocks } from "./api/blocks.ts";

async function main() {
  console.log("Fetching courses...");
  const courses = await getCourses();
  console.log("Courses:", courses.map((c) => c.id));

  console.log("\nFetching enrollments for student2...");
  const enrollments = await getEnrollments("student2");
  console.log("Enrollments:", enrollments);

  if (courses.length > 0) {
    const courseId = courses[0].id; // e.g., "course-v1:universityX+CS101+2025"

    console.log(`\nFetching course details for ${courseId}...`);
    const courseDetail = await getCourseDetail(courseId);
    if (courseDetail) {
      console.log("Course Name:", courseDetail.name);
      console.log("👨‍🏫 Instructors:", courseDetail.instructors);
    }

    console.log(`\nFetching grades for course ${courseId}...`);
    const grades = await getCourseGradebook(courseId);
    console.log("Grades:", grades);

    console.log(`\nFetching all blocks for course ${courseId}...`);
    const blocks = await getCourseBlocks(courseId);
    console.log("Blocks:", blocks);
  }
}

main();
