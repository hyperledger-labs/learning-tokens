/**
 * Simple Moodle Connection Test
 */

import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

console.log("🧪 Testing Moodle Connection...\n");

if (!MOODLE_URL || !MOODLE_TOKEN) {
  console.error("❌ Missing MOODLE_URL or MOODLE_TOKEN in .env file");
  process.exit(1);
}

console.log(`📍 URL: ${MOODLE_URL}`);
console.log(`🔑 Token: ${MOODLE_TOKEN.substring(0, 8)}...`);

async function testConnection() {
  try {
    const url = `${MOODLE_URL}/webservice/rest/server.php`;
    const formData = new URLSearchParams({
      wstoken: MOODLE_TOKEN,
      wsfunction: "core_webservice_get_site_info",
      moodlewsrestformat: "json",
    });

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.exception) {
      throw new Error(`Moodle Error: ${data.message}`);
    }

    console.log("\n✅ Connection Successful!");
    console.log(`🏫 Site: ${data.sitename}`);
    console.log(`📚 Version: ${data.release}`);
    console.log(
      `👤 User: ${data.firstname} ${data.lastname} (${data.username})`
    );
    console.log(`📧 Email: ${data.email}`);

    // Test getting courses
    console.log("\n📋 Testing course access...");
    const coursesUrl = `${MOODLE_URL}/webservice/rest/server.php`;
    const coursesData = new URLSearchParams({
      wstoken: MOODLE_TOKEN,
      wsfunction: "core_course_get_courses",
      moodlewsrestformat: "json",
    });

    const coursesResponse = await fetch(coursesUrl, {
      method: "POST",
      body: coursesData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const courses = await coursesResponse.json();
    const realCourses = courses.filter((course) => course.id !== 1);

    console.log(`📚 Found ${realCourses.length} courses accessible`);
    if (realCourses.length > 0) {
      console.log("   First few courses:");
      realCourses.slice(0, 3).forEach((course) => {
        console.log(`   - ${course.fullname} (ID: ${course.id})`);
      });
    }

    console.log(
      "\n🎉 All tests passed! You can now start the server with: npm start"
    );
  } catch (error) {
    console.error("\n❌ Connection Failed:");
    console.error(`   ${error.message}`);

    console.log("\n💡 Troubleshooting:");
    console.log("   1. Check your MOODLE_URL is correct");
    console.log("   2. Verify your MOODLE_TOKEN is valid");
    console.log("   3. Ensure Web Services are enabled in Moodle");
    console.log("   4. Check that your user has proper permissions");

    process.exit(1);
  }
}

testConnection();
