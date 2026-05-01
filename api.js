const API_TOKEN_KEY = "authToken";
const API_USER_KEY = "authUser";

function getAuthToken() {
  return localStorage.getItem(API_TOKEN_KEY);
}

function getAuthUser() {
  try {
    return JSON.parse(localStorage.getItem(API_USER_KEY));
  } catch {
    return null;
  }
}

async function apiRequest(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

function saveAuthSession({ token, user }) {
  localStorage.setItem(API_TOKEN_KEY, token);
  localStorage.setItem(API_USER_KEY, JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");
}

async function logout() {
  try {
    if (getAuthToken()) {
      await apiRequest("/api/logout", { method: "POST" });
    }
  } finally {
    localStorage.removeItem(API_TOKEN_KEY);
    localStorage.removeItem(API_USER_KEY);
    localStorage.removeItem("isLoggedIn");
    window.location.href = "form.html";
  }
}

function updateAuthUI() {
  const authContainer = document.getElementById("auth-container");
  if (!authContainer) return;

  if (getAuthToken()) {
    authContainer.innerHTML = `
      <a href="#" class="logout-style" onclick="logout(); return false;" title="Log out">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </a>`;
  } else {
    authContainer.innerHTML = `<a href="form.html" class="login-style">Log in</a>`;
  }
}

document.addEventListener("DOMContentLoaded", updateAuthUI);
