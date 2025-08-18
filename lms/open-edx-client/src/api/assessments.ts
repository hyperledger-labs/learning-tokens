import axios from 'axios';

export async function fetchAssessments(sessionId: string, courseId: string): Promise<void> {
  const url = `http://local.overhang.io/api/courses/v2/blocks/`;
  const params = {
    course_id: courseId,
    depth: 10,
    block_types_filter: 'problem',
    requested_fields: 'display_name,graded,due',
    all_blocks: true,
  };

  try {
    const response = await axios.get(url, {
      headers: {
        Cookie: `sessionid=${sessionId}`,
      },
      params,
    });

    const blocks = response.data.blocks;
    console.log('Assessments found:\n');

    for (const blockId in blocks) {
      const block = blocks[blockId];
      console.log(`- ${block.display_name}`);
      console.log(`  Graded: ${block.graded}`);
      console.log(`  URL: ${block.lms_web_url}`);
      console.log('');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching assessments:', error.message);
    } else {
      console.error('Unknown error occurred:', error);
    }
  }
}
