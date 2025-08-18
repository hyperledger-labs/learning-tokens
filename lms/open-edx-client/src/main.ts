import { fetchAssessments } from './api/assessments';
import { getCourseDetails } from './api/courses';
import { getEnrollments, Enrollment } from './api/enrollments';
import { CourseDetails } from './interfaces/types';

// Hardcoded — Replace or load from .env later
const sessionId = '1|bwbejtyrl7mleskg931vyds3q8eqzjfd|iT3RAhcR1FFC|IjJlNzEyMjExMDZhNzE4MzkzMThkNzdiNzA4MzQ3ZDBhM2RmODU0MzMxMjc4NjBjNTJmZmEyZTlkNmFlNGViMzYi:1uiw0m:P2YeRFmfZLUPBs6FN3-VociS-eI';
const courseId = 'course-v1:TREUniversity+CS102+2025';

async function main() {
  try {
    // 1. Course Info
    const course: CourseDetails = await getCourseDetails(courseId);
    console.log('--- 📘 Course Info ---');
    console.log('📚 Course Name:', course.name);
    console.log('🏫 Institution:', course.org);

    // 2. Instructor Parsing
    const instructorMatch = course.overview?.match(/<h3.*?>(.*?)<\/h3>/g);
    if (instructorMatch) {
      const instructors = instructorMatch
        .map(tag => tag.replace(/<\/?h3.*?>/g, '').trim())
        .filter(name => name.startsWith('Staff Member'));

      console.log('👨‍🏫 Instructors:', instructors.length > 0 ? instructors.join(', ') : 'No instructor info found');
    } else {
      console.log('👨‍🏫 No instructor info found in overview.');
    }

    // 3. Assessments
    console.log('\n--- 📝 Assessments ---');
    await fetchAssessments(sessionId, courseId);

    // 4. Enrollments
    const enrollments: Enrollment[] = await getEnrollments();
    console.log('\n--- 👥 All Enrollments ---');
    enrollments.forEach((e, idx) => {
      console.log(`\n#${idx + 1}`);
      console.log(`👤 User: ${e.user}`);
      console.log(`📚 Course ID: ${e.course_id}`);
      console.log(`🕒 Created: ${e.created}`);
      console.log(`🎓 Mode: ${e.mode}`);
      console.log(`✅ Active: ${e.is_active}`);
    });

    // 5. Filtered Active Enrollments for current course
    const active = enrollments.filter(e => e.is_active && e.course_id === courseId);
    console.log('\n✅ Active Enrollments for', courseId);
    active.forEach(e => console.log(`- ${e.user}`));

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error in main():', error.message);
    } else {
      console.error('❌ Unknown error in main():', error);
    }
  }
}

main();
