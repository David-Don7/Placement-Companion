/* ============================================
   PLACEMENT COMPANION — API Utility Module
   ============================================ */

const API_BASE = '/api';

// ---- Token Management ----
function getToken() {
  return localStorage.getItem('pc_token');
}

function setToken(token) {
  localStorage.setItem('pc_token', token);
}

function removeToken() {
  localStorage.removeItem('pc_token');
  localStorage.removeItem('pc_user');
}

function getUser() {
  const u = localStorage.getItem('pc_user');
  return u ? JSON.parse(u) : null;
}

function setUser(user) {
  localStorage.setItem('pc_user', JSON.stringify(user));
}

function isLoggedIn() {
  return !!getToken();
}

// ---- Auth Guard — redirect to login if not authenticated ----
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// ---- Fetch wrapper with auth header ----
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();

    // If 401, token invalid — redirect to login
    if (res.status === 401) {
      removeToken();
      window.location.href = 'login.html';
      return null;
    }

    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

// ---- Auth API methods ----
async function apiLogin(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (data && data.success) {
    setToken(data.token);
    setUser(data.user);
  }
  return data;
}

async function apiRegister(name, email, password) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
  if (data && data.success) {
    setToken(data.token);
    setUser(data.user);
  }
  return data;
}

async function apiGetMe() {
  return apiFetch('/auth/me');
}

async function apiUpdateProfile(profileData) {
  return apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
}

async function apiChangePassword(currentPassword, newPassword) {
  return apiFetch('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

async function apiDeleteAccount() {
  return apiFetch('/auth/account', { method: 'DELETE' });
}

// ---- Quiz API methods ----
async function apiGetQuizQuestions(topic, limit = 10) {
  return apiFetch(`/quiz/questions/${encodeURIComponent(topic)}?limit=${limit}`);
}

async function apiSubmitQuiz(topic, answers, timeTaken) {
  return apiFetch('/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ topic, answers, timeTaken })
  });
}

async function apiGetQuizHistory() {
  return apiFetch('/quiz/history');
}

async function apiGetQuizStats() {
  return apiFetch('/quiz/stats');
}

// ---- DSA API methods ----
async function apiGetDSAProblems(topic, difficulty) {
  let query = '/dsa/problems?';
  if (topic) query += `topic=${encodeURIComponent(topic)}&`;
  if (difficulty) query += `difficulty=${encodeURIComponent(difficulty)}`;
  return apiFetch(query);
}

async function apiGetDSAProblem(id) {
  return apiFetch(`/dsa/problems/${id}`);
}

async function apiToggleDSASolved(id) {
  return apiFetch(`/dsa/problems/${id}/toggle`, { method: 'POST' });
}

async function apiGetDSAStats() {
  return apiFetch('/dsa/stats');
}

// ---- HR API methods ----
async function apiGetRandomHR() {
  return apiFetch('/hr/random');
}

async function apiSubmitHR(questionId, userAnswer) {
  return apiFetch('/hr/submit', {
    method: 'POST',
    body: JSON.stringify({ questionId, userAnswer })
  });
}

async function apiGetHRHistory() {
  return apiFetch('/hr/history');
}

async function apiGetHRStats() {
  return apiFetch('/hr/stats');
}

// ---- Company API methods ----
async function apiGetCompanies() {
  return apiFetch('/company');
}

async function apiUpdateCompanyStatus(companyId, status) {
  return apiFetch(`/company/${companyId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}

// ---- Progress / Dashboard API methods ----
async function apiGetDashboardStats() {
  return apiFetch('/progress/dashboard');
}

async function apiGetActivity() {
  return apiFetch('/progress/activity');
}

async function apiGetChartData(period) {
  return apiFetch(`/progress/chart?period=${encodeURIComponent(period)}`);
}

// ---- Survey API methods ----
async function apiGetSurveyProfile() {
  return apiFetch('/survey/profile');
}

async function apiStartSurvey() {
  return apiFetch('/survey/start', { method: 'POST' });
}

async function apiSubmitSurveyTier(tier, answers, skippedManually = false) {
  return apiFetch('/survey/submit-tier', {
    method: 'POST',
    body: JSON.stringify({ tier, answers, skippedManually })
  });
}

async function apiResetSurvey() {
  return apiFetch('/survey/reset', { method: 'POST' });
}

async function apiGetSurveyTopics() {
  return apiFetch('/survey/topics');
}

// ---- Code Editor API methods ----
async function apiGetCodeProblem(questionId) {
  return apiFetch(`/code/problem/${questionId}`);
}

async function apiRunCode(questionId, language, code, customInput = null) {
  return apiFetch('/code/run', {
    method: 'POST',
    body: JSON.stringify({ questionId, language, code, customInput })
  });
}

async function apiSubmitCode(questionId, language, code) {
  return apiFetch('/code/submit', {
    method: 'POST',
    body: JSON.stringify({ questionId, language, code })
  });
}

async function apiGetCodeSubmissions(questionId, limit = 20, offset = 0) {
  return apiFetch(`/code/submissions/${questionId}?limit=${limit}&offset=${offset}`);
}

async function apiGetSubmissionDetail(submissionId) {
  return apiFetch(`/code/submission/${submissionId}`);
}

async function apiGetCodeLanguages() {
  return apiFetch('/code/languages');
}

async function apiGetCodeStats() {
  return apiFetch('/code/stats');
}

// ---- Solution API methods ----
async function apiGetSolution(questionId) {
  return apiFetch(`/solutions/${questionId}`);
}

async function apiGetCodeSolution(questionId, language) {
  return apiFetch(`/solutions/${questionId}/code/${language}`);
}

async function apiGetAllCodeSolutions(questionId) {
  return apiFetch(`/solutions/${questionId}/code`);
}

async function apiGetVideoSolution(questionId) {
  return apiFetch(`/solutions/${questionId}/video`);
}

async function apiGetRelatedProblems(questionId) {
  return apiFetch(`/solutions/${questionId}/related`);
}

// ---- Recommendation API methods ----
async function apiGetRecommendations(limit = 10, type = null) {
  let url = `/recommendations?limit=${limit}`;
  if (type) url += `&type=${type}`;
  return apiFetch(url);
}

async function apiGetDashboardRecommendations() {
  return apiFetch('/recommendations/dashboard');
}

async function apiGetProblemRecommendations(topic = null, limit = 5) {
  let url = `/recommendations/problems?limit=${limit}`;
  if (topic) url += `&topic=${encodeURIComponent(topic)}`;
  return apiFetch(url);
}

async function apiGetQuizRecommendations() {
  return apiFetch('/recommendations/quizzes');
}

async function apiGetLearningPath() {
  return apiFetch('/recommendations/learning-path');
}

async function apiRecordRecommendationInteraction(recommendationId, action) {
  return apiFetch(`/recommendations/${recommendationId}/interact`, {
    method: 'POST',
    body: JSON.stringify({ action })
  });
}

async function apiRefreshRecommendations() {
  return apiFetch('/recommendations/refresh', { method: 'POST' });
}

// ---- Update sidebar user info across pages ----
function updateSidebarUser() {
  const user = getUser();
  if (!user) return;
  
  const initials = user.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??';
  
  document.querySelectorAll('.user-avatar').forEach(el => { el.textContent = initials; });
  document.querySelectorAll('.user-name').forEach(el => { el.textContent = user.name || 'User'; });
  document.querySelectorAll('.user-email').forEach(el => { el.textContent = user.email || ''; });
}

// ---- Aptitude Assessment API methods ----
async function apiGetAptitudeQuestions() {
  return apiFetch('/aptitude/questions');
}

async function apiSubmitAptitude(answers) {
  return apiFetch('/aptitude/submit', {
    method: 'POST',
    body: JSON.stringify({ answers })
  });
}

// ---- Post-auth redirect (always go to dashboard) ----
function getPostAuthRedirect() {
  return 'dashboard.html';
}

// ---- Check if user has completed initial assessment (optional check) ----
function hasCompletedAssessment() {
  const user = getUser();
  return user && (user.assessment_completed || user.aptitude_test_completed);
}

// ---- Logout helper ----
function logout() {
  removeToken();
  window.location.href = 'login.html';
}
