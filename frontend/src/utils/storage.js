const AUTH_KEY = "support_auth";

export const loadAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_e) {
    return null;
  }
};

export const saveAuth = (auth) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};
