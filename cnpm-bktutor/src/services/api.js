const API_BASE_URL = 'http://localhost:5173/api';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const fetchCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/courses`);
  return response.json();
};

export const fetchCourseDetails = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
  return response.json();
};

export const submitAssignment = async (courseId, assignmentData) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignmentData)
  });
  return response.json();
};

export const API_URL = "http://localhost:7999";
