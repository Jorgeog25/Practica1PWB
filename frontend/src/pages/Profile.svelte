<script>
  import { authStore } from '../stores/auth.svelte.js';
  import { toastStore } from '../stores/toast.svelte.js';

  let { onNavigate } = $props();

  function handleLogout() {
    authStore.clearAuth();
    toastStore.info('Sesión cerrada');
    onNavigate('login');
  }
</script>

<div class="profile-page">
  <div class="profile-card">
    <div class="profile-avatar">
      {authStore.userName.charAt(0).toUpperCase()}
    </div>
    <h1 class="profile-name">{authStore.userName}</h1>
    <span class="profile-badge profile-badge--{authStore.user?.role}">
      {authStore.user?.role}
    </span>

    <div class="profile-info">
      <div class="info-row">
        <span class="info-label">Usuario</span>
        <span class="info-value">{authStore.userName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Rol</span>
        <span class="info-value">{authStore.user?.role}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Sesión</span>
        <span class="info-value info-value--green">Activa</span>
      </div>
    </div>

    <button class="btn-logout" onclick={handleLogout}>
      Cerrar sesión
    </button>
  </div>
</div>

<style>
  .profile-page {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .profile-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 380px;
    text-align: center;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--accent-subtle);
    color: var(--accent);
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    border: 2px solid var(--accent);
  }

  .profile-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.5rem;
    margin: 0 0 0.5rem;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .profile-badge {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .profile-badge--admin { background: var(--accent-subtle); color: var(--accent); }
  .profile-badge--user { background: var(--surface-2); color: var(--text-muted); }

  .profile-info {
    margin: 1.75rem 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
  }
  .info-row:last-child { border-bottom: none; }
  .info-label { font-size: 0.84rem; color: var(--text-muted); }
  .info-value { font-size: 0.84rem; color: var(--text); font-weight: 500; }
  .info-value--green { color: var(--green); }

  .btn-logout {
    width: 100%;
    padding: 0.75rem;
    background: none;
    border: 1px solid var(--red);
    color: var(--red);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-logout:hover { background: var(--red); color: white; }
</style>
