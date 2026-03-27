<script>
  import { authStore } from './stores/auth.svelte.js';
  import Navbar from './components/Navbar.svelte';
  import Toast from './components/Toast.svelte';
  import Login from './pages/Login.svelte';
  import Products from './pages/Products.svelte';
  import Profile from './pages/Profile.svelte';
  import Admin from './pages/Admin.svelte';

  let currentPage = $state('products');

  // $effect: redirigir a login si no hay usuario autenticado
  $effect(() => {
    if (!authStore.isAuthenticated) {
      currentPage = 'login';
    } else if (currentPage === 'login') {
      currentPage = 'products';
    }
  });

  // $effect: si va a admin y no es admin, redirigir
  $effect(() => {
    if (currentPage === 'admin' && authStore.isAuthenticated && !authStore.isAdmin) {
      currentPage = 'products';
    }
  });

  function navigate(page) {
    currentPage = page;
  }
</script>

<div class="app">
  {#if authStore.isAuthenticated && currentPage !== 'login'}
    <Navbar {currentPage} onNavigate={navigate} />
  {/if}

  <main class="main">
    {#if currentPage === 'login'}
      <Login onLoginSuccess={() => navigate('products')} />
    {:else if currentPage === 'products'}
      <Products />
    {:else if currentPage === 'profile'}
      <Profile onNavigate={navigate} />
    {:else if currentPage === 'admin' && authStore.isAdmin}
      <Admin />
    {/if}
  </main>

  <Toast />
</div>

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }

  :global(:root) {
    /* Color palette — dark theme */
    --bg: #0f0f11;
    --surface: #17171a;
    --surface-2: #1f1f23;
    --border: #2a2a30;
    --text: #e8e8ee;
    --text-muted: #7a7a8a;

    --accent: #7c6af5;
    --accent-subtle: rgba(124, 106, 245, 0.12);

    --green: #3ecf8e;
    --green-subtle: rgba(62, 207, 142, 0.1);
    --red: #f06b6b;
    --red-subtle: rgba(240, 107, 107, 0.1);

    color-scheme: dark;
  }

  :global(body) {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  :global(input, select, button) {
    font-family: inherit;
  }

  :global(::-webkit-scrollbar) { width: 6px; height: 6px; }
  :global(::-webkit-scrollbar-track) { background: var(--bg); }
  :global(::-webkit-scrollbar-thumb) { background: var(--border); border-radius: 3px; }
  :global(::-webkit-scrollbar-thumb:hover) { background: var(--text-muted); }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main {
    flex: 1;
  }
</style>
