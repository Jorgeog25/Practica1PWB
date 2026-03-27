<script>
  import { authApi } from '../services/api.js';
  import { authStore } from '../stores/auth.svelte.js';
  import { toastStore } from '../stores/toast.svelte.js';

  let { onLoginSuccess } = $props();

  let username = $state('');
  let password = $state('');
  let loading = $state(false);
  let errors = $state({});
  let mode = $state('login'); // 'login' | 'register'

  function validate() {
    const e = {};
    if (!username.trim()) e.username = 'Campo obligatorio';
    if (!password) e.password = 'Campo obligatorio';
    else if (password.length < 4) e.password = 'Mínimo 4 caracteres';
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { errors = e; return; }
    errors = {};
    loading = true;

    try {
      if (mode === 'login') {
        const data = await authApi.login(username.trim(), password);
        // Decode JWT payload to get user info
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        authStore.setAuth(data.token, { username: payload.username || username, role: payload.role || 'user', id: payload.id || payload._id });
        toastStore.success(`¡Bienvenido, ${payload.username || username}!`);
        onLoginSuccess();
      } else {
        await authApi.register(username.trim(), password);
        toastStore.success('Cuenta creada. Ahora puedes iniciar sesión.');
        mode = 'login';
        password = '';
      }
    } catch (err) {
      if (err.status === 401 || err.status === 400) {
        toastStore.error(err.message || 'Credenciales incorrectas');
      } else {
        toastStore.error('Error al conectar con el servidor');
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="login-page">
  <div class="login-card">
    <div class="login-logo">◈</div>
    <h1 class="login-title">TiendaApp</h1>
    <p class="login-sub">{mode === 'login' ? 'Inicia sesión para continuar' : 'Crea una cuenta nueva'}</p>

    <div class="login-form">
      <div class="field">
        <label for="user">Usuario</label>
        <input
          id="user"
          type="text"
          bind:value={username}
          placeholder="tu_usuario"
          class={errors.username ? 'input--error' : ''}
          disabled={loading}
          autocomplete="username"
        />
        {#if errors.username}<span class="error">{errors.username}</span>{/if}
      </div>

      <div class="field">
        <label for="pass">Contraseña</label>
        <input
          id="pass"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          class={errors.password ? 'input--error' : ''}
          disabled={loading}
          autocomplete="current-password"
          onkeydown={e => e.key === 'Enter' && handleSubmit()}
        />
        {#if errors.password}<span class="error">{errors.password}</span>{/if}
      </div>

      <button class="btn-submit" onclick={handleSubmit} disabled={loading}>
        {#if loading}
          <span class="spinner"></span> Cargando…
        {:else}
          {mode === 'login' ? 'Entrar' : 'Registrarse'}
        {/if}
      </button>
    </div>

    <p class="login-toggle">
      {mode === 'login' ? '¿Sin cuenta?' : '¿Ya tienes cuenta?'}
      <button class="toggle-btn" onclick={() => { mode = mode === 'login' ? 'register' : 'login'; errors = {}; }}>
        {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
      </button>
    </p>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: var(--bg);
  }

  .login-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 380px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .login-logo {
    font-size: 2.5rem;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }

  .login-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.7rem;
    margin: 0 0 0.3rem;
    color: var(--text);
    letter-spacing: -0.03em;
  }

  .login-sub {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0 0 2rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
  }

  .field { display: flex; flex-direction: column; gap: 0.35rem; }
  .field label {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }
  .field input {
    padding: 0.7rem 0.95rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
  }
  .field input:focus { outline: none; border-color: var(--accent); }
  .field input.input--error { border-color: var(--red); }
  .field input::placeholder { color: var(--text-muted); opacity: 0.5; }

  .error { font-size: 0.76rem; color: var(--red); }

  .btn-submit {
    margin-top: 0.5rem;
    padding: 0.8rem;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .btn-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .login-toggle {
    margin-top: 1.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  .toggle-btn {
    background: none;
    border: none;
    color: var(--accent);
    font-size: 0.85rem;
    cursor: pointer;
    font-weight: 600;
    padding: 0;
    margin-left: 0.3rem;
  }
  .toggle-btn:hover { text-decoration: underline; }
</style>
