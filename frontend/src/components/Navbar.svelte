<script>
  import { authStore } from '../stores/auth.svelte.js';

  let { currentPage, onNavigate } = $props();
</script>

<nav class="navbar">
  <div class="navbar__brand" onclick={() => onNavigate('products')}>
    <span class="navbar__logo">◈</span>
    <span class="navbar__title">TiendaApp</span>
  </div>

  <div class="navbar__links">
    {#if authStore.isAuthenticated}
      <button
        class="nav-btn {currentPage === 'products' ? 'nav-btn--active' : ''}"
        onclick={() => onNavigate('products')}
      >
        Productos
      </button>

      {#if authStore.isAdmin}
        <button
          class="nav-btn {currentPage === 'admin' ? 'nav-btn--active' : ''}"
          onclick={() => onNavigate('admin')}
        >
          Admin
        </button>
      {/if}

      <button
        class="nav-btn {currentPage === 'profile' ? 'nav-btn--active' : ''}"
        onclick={() => onNavigate('profile')}
      >
        {authStore.userName}
      </button>
    {/if}
  </div>
</nav>

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 60px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(12px);
  }

  .navbar__brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    text-decoration: none;
  }

  .navbar__logo {
    font-size: 1.4rem;
    color: var(--accent);
  }

  .navbar__title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .navbar__links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .nav-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0.45rem 0.9rem;
    border-radius: 8px;
    transition: all 0.15s;
  }

  .nav-btn:hover {
    color: var(--text);
    background: var(--surface);
  }

  .nav-btn--active {
    color: var(--accent);
    background: var(--accent-subtle);
    font-weight: 500;
  }

  @media (max-width: 600px) {
    .navbar { padding: 0 1rem; }
    .navbar__title { display: none; }
    .nav-btn { padding: 0.4rem 0.6rem; font-size: 0.82rem; }
  }
</style>
