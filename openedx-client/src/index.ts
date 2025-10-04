import {
  getCourses,
  getCourseDetail,
  getCourseInstructors,
  getEnrollments,
  getCourseGradebook,
  getCourseBlocks,
} from "./api/edx.ts";

async function main() {
  // Fetch courses
  console.log("Fetching courses...");
  const courses = await getCourses();
  console.log("Courses:", courses.map((c) => c.id));

  // Fetch enrollments for a specific student
  console.log("\nFetching enrollments for student2...");
  const enrollments = await getEnrollments("student2");
  console.log("Enrollments:", enrollments);

  if (courses.length > 0) {
    const courseId = courses[0].id; // e.g., "course-v1:universityX+CS101+2025"

    // Fetch course details
    console.log(`\nFetching course details for ${courseId}...`);
    const courseDetail = await getCourseDetail(courseId);
    if (courseDetail) {
      console.log("Course Name:", courseDetail.name || courseDetail.id);
    }

    // Fetch instructors
    console.log("\nFetching instructors...");
    const instructors = await getCourseInstructors(courseId);
    if (instructors && instructors.length > 0) {
      console.log(
        "Instructors:",
        instructors.map((i) => i.username || i.name || i.id)
      );
    } else {
      console.log("No instructors found for this course.");
    }

    // Fetch grades with full section breakdown
    console.log(`\nFetching grades for course ${courseId}...`);
    const grades = await getCourseGradebook(courseId);

    if (grades && grades.results) {
      grades.results.forEach((user) => {
        console.log(`\nUser: ${user.username} (ID: ${user.user_id})`);
        console.log(`Overall Percent: ${user.percent}`);

        if (user.section_breakdown && user.section_breakdown.length > 0) {
          console.log("Section Breakdown:");
          user.section_breakdown.forEach((section) => {
            console.log(`  - Subsection: ${section.subsection_name}`);
            console.log(`    Category: ${section.category}`);
            console.log(`    Label: ${section.label}`);
            console.log(`    Module ID: ${section.module_id}`);
            console.log(`    Attempted: ${section.attempted}`);
            console.log(`    Score Earned: ${section.score_earned}`);
            console.log(`    Score Possible: ${section.score_possible}`);
            console.log(`    Percent: ${section.percent}`);
          });
        } else {
          console.log("  No section breakdown available.");
        }
      });
    }

    // Fetch all blocks
    console.log(`\nFetching all blocks for course ${courseId}...`);
    const blocks = await getCourseBlocks(courseId);
    console.log("Blocks:", blocks);
  }
}

main().catch((err) => {
  console.error("Error:", err);
});
