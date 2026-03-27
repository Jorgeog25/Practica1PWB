// stores/auth.svelte.js
// Estado global de autenticación usando $state de Svelte 5

function createAuthStore() {
  // Intentar restaurar sesión desde localStorage (persistencia)
  const savedToken = localStorage.getItem('jwt_token');
  const savedUser = localStorage.getItem('user_data');

  let token = $state(savedToken || null);
  let user = $state(savedUser ? JSON.parse(savedUser) : null);
  let loading = $state(false);

  // Derivados
  const isAuthenticated = $derived(!!token);
  const isAdmin = $derived(user?.role === 'admin');
  const userName = $derived(user?.username || '');

  function setAuth(newToken, newUser) {
    token = newToken;
    user = newUser;
    // Persistir en localStorage
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('user_data', JSON.stringify(newUser));
  }

  function clearAuth() {
    token = null;
    user = null;
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  }

  function setLoading(val) {
    loading = val;
  }

  return {
    get token() { return token; },
    get user() { return user; },
    get loading() { return loading; },
    get isAuthenticated() { return isAuthenticated; },
    get isAdmin() { return isAdmin; },
    get userName() { return userName; },
    setAuth,
    clearAuth,
    setLoading,
  };
}

export const authStore = createAuthStore();
