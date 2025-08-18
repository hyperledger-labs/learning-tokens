import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

function App() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseData, setSelectedCourseData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [quizGrades, setQuizGrades] = useState([]);
  const [courseFiles, setCourseFiles] = useState([]);
  const [courseFolders, setCourseFolders] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/courses`).then(res => setCourses(res.data));
  }, []);

  const fetchAssignments = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    setSelectedCourseId(courseId);
    setSelectedCourseData(course);

    // Fetch assignments and students
    axios.get(`${API_BASE}/courses/${courseId}/assignments`).then(res => setAssignments(res.data));
    axios.get(`${API_BASE}/courses/${courseId}/students`).then(res => setEnrolledStudents(res.data));
    
    // Fetch files and folders
    axios.get(`${API_BASE}/courses/${courseId}/files`).then(res => setCourseFiles(res.data));
    axios.get(`${API_BASE}/courses/${courseId}/folders`).then(res => setCourseFolders(res.data));
  };

  const fetchQuizGrades = (quizId) => {
    axios.get(`${API_BASE}/courses/${selectedCourseId}/quizzes/${quizId}/grades`)
      .then(res => setQuizGrades(res.data));
  };

  const extractCourseMetadata = (course) => {
    const instructorEnrollment = course.enrollments?.find(e => e.type === 'teacher');
    const instructorName = instructorEnrollment
      ? `Instructor (user_id: ${instructorEnrollment.user_id})`
      : 'Unknown Instructor';

    return {
      course_name: course.name || 'Untitled Course',
      instructor_name: instructorName,
      institution: 'Canvas LMS',
      enrolled_students: enrolledStudents,
      primary_identifier: null,
      assessment_qna: [],
      includes_quizzes_homework: false,
      chat_data: null,
      course_transcript: null
    };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFolderName = (folderId) => {
    const folder = courseFolders.find(f => f.id === folderId);
    return folder ? folder.name : 'Root';
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Canvas LMS Dashboard</h1>

      <h3>All Courses</h3>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            {course.name || course.id} -
            <button onClick={() => fetchAssignments(course.id)}>View details</button>
          </li>
        ))}
      </ul>

      {selectedCourseId && selectedCourseData && (
        <>
          <h3>📘 Course Metadata</h3>
          {(() => {
            const metadata = extractCourseMetadata(selectedCourseData);
            return (
              <ul>
                <li><strong>Course Name:</strong> {metadata.course_name}</li>
                <li><strong>Instructor:</strong> {metadata.instructor_name}</li>
                <li><strong>Institution:</strong> {metadata.institution}</li>
                <li><strong>Enrolled Students:</strong> {metadata.enrolled_students.length}</li>
                <li><strong>Course Files:</strong> {courseFiles.length}</li>
                {/* <li><strong>Transcript:</strong> {metadata.course_transcript || 'Not Available'}</li> */}
              </ul>
            );
          })()}

          <h4>👩‍🎓 Enrolled Students</h4>
          <ul>
            {enrolledStudents.map(student => (
              <li key={student.id}>{student.name} (user_id: {student.id}, login_id: {student.login_id})</li>
            ))}
          </ul>

          <h3>📚 Assignments</h3>
          <ul>
            {assignments.map(a => (
              <li key={a.id}>
                {a.name} - <button onClick={() => fetchQuizGrades(a.quiz_id || a.id)}>View Grades</button>
              </li>
            ))}
          </ul>

          {quizGrades.length > 0 && (
            <>
              <h3>📊 Quiz Grades</h3>
              <ul>
                {quizGrades.map(g => (
                  <li key={g.user_id}>{g.name} ({g.login_id}) - Score: {g.score}</li>
                ))}
              </ul>
            </>
          )}

          <h3>📁 Course Files ({courseFiles.length})</h3>
          {courseFiles.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>File Name</th>
                    <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Type</th>
                    <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Size</th>
                    <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Folder</th>
                    <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Uploaded</th>
                    <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courseFiles.map(file => (
                    <tr key={file.id}>
                      <td style={{ border: '1px solid #ddd', padding: 8 }}>
                        {file.display_name}
                        {file.locked && <span style={{ color: 'red', marginLeft: 5 }}>🔒</span>}
                        {file.hidden && <span style={{ color: 'orange', marginLeft: 5 }}>👁️‍🗨️</span>}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: 8 }}>{file.content_type}</td>
                      <td style={{ border: '1px solid #ddd', padding: 8 }}>{formatFileSize(file.size)}</td>
                      <td style={{ border: '1px solid #ddd', padding: 8 }}>{getFolderName(file.folder_id)}</td>
                      <td style={{ border: '1px solid #ddd', padding: 8 }}>{formatDate(file.created_at)}</td>
                      <td style={{ border: '1px solid #ddd', padding: 8 }}>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ marginRight: 10, color: '#0066cc', textDecoration: 'none' }}
                        >
                          Download
                        </a>
                        {file.preview_url && (
                          <a 
                            href={file.preview_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#0066cc', textDecoration: 'none' }}
                          >
                            Preview
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No files found in this course.</p>
          )}

          {/* {courseFolders.length > 0 && (
            <>
              <h4>📂 Folders Structure</h4>
              <ul>
                {courseFolders.map(folder => (
                  <li key={folder.id}>
                    <strong>{folder.name}</strong> ({folder.files_count} files, {folder.folders_count} subfolders)
                    <br />
                    <small style={{ color: '#666' }}>Path: {folder.full_name}</small>
                  </li>
                ))}
              </ul>
            </>
          )} */}
        </>
      )}
    </div>
  );
}

export default App;









// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE = 'http://localhost:5000';

// function App() {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [selectedCourseData, setSelectedCourseData] = useState(null);
//   const [assignments, setAssignments] = useState([]);
//   const [newAssignment, setNewAssignment] = useState({
//     name: '', description: '', due_at: '', points_possible: 10
//   });
//   const [announcement, setAnnouncement] = useState({ title: '', message: '' });

//   useEffect(() => {
//     axios.get(`${API_BASE}/courses`)
//       .then(res => setCourses(res.data));
//   }, []);

//   const fetchAssignments = (courseId) => {
//     const course = courses.find(c => c.id === courseId);
//     setSelectedCourseId(courseId);
//     setSelectedCourseData(course);

//     axios.get(`${API_BASE}/courses/${courseId}/assignments`)
//       .then(res => setAssignments(res.data));
//   };

//   const extractCourseMetadata = (course) => {
//     const instructorEnrollment = course.enrollments?.find(e => e.type === 'teacher');
//     const instructorName = instructorEnrollment
//       ? `Instructor (user_id: ${instructorEnrollment.user_id})`
//       : 'Unknown Instructor';

//     return {
//       course_name: course.name || 'Untitled Course',
//       instructor_name: instructorName,
//       institution: 'Canvas LMS',
//       enrolled_students: [], // Not available in course object
//       primary_identifier: null, // Email not provided
//       assessment_qna: [], // Not present
//       includes_quizzes_homework: false, // No indicator in this object
//       chat_data: null,
//       course_transcript: null
//     };
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Canvas LMS Dashboard</h1>

//       <h3>All Courses</h3>
//       <ul>
//         {courses.map(course => (
//           <li key={course.id}>
//             {course.name || course.id} -
//             <button onClick={() => fetchAssignments(course.id)}>View details</button>
//           </li>
//         ))}
//       </ul>

//       {selectedCourseId && selectedCourseData && (
//         <>
//           <h3>📘 Course Metadata</h3>
//           {(() => {
//             const metadata = extractCourseMetadata(selectedCourseData);
//             return (
//               <ul>
//                 <li><strong>Course Name:</strong> {metadata.course_name}</li>
//                 <li><strong>Instructor:</strong> {metadata.instructor_name}</li>
//                 <li><strong>Institution:</strong> {metadata.institution}</li>
//                 <li><strong>Enrolled Students:</strong> {metadata.enrolled_students.length}</li>
//                 <li><strong>Primary Identifier (Email):</strong> {metadata.primary_identifier || 'Not Available'}</li>
//                 <li><strong>Assessment Q&A:</strong> {metadata.assessment_qna.length ? 'Available' : 'Not Available'}</li>
//                 <li><strong>Includes quizzes/homework:</strong> {metadata.includes_quizzes_homework ? 'Yes' : 'No'}</li>
//                 <li><strong>Chat Data:</strong> {metadata.chat_data || 'Not Available'}</li>
//                 <li><strong>Transcript:</strong> {metadata.course_transcript || 'Not Available'}</li>
//               </ul>
//             );
//           })()}

//           <h3>📚 Assignments</h3>
//           <ul>
//             {assignments.map(a => <li key={a.id}>{a.name}</li>)}
//           </ul>

//         </>
//       )}
//     </div>
//   );
// }

// export default App;



