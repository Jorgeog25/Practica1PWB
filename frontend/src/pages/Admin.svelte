<script>
  import { usersApi } from '../services/api.js';
  import { authStore } from '../stores/auth.svelte.js';
  import { toastStore } from '../stores/toast.svelte.js';
  import UserRow from '../components/UserRow.svelte';

  let users = $state([]);
  let loading = $state(true);
  let showCreateForm = $state(false);
  let newUsername = $state('');
  let newPassword = $state('');
  let newRole = $state('user');
  let creating = $state(false);
  let createErrors = $state({});

  // Derived: counts
  const adminCount = $derived(users.filter(u => u.role === 'admin').length);
  const userCount = $derived(users.filter(u => u.role === 'user').length);

  // $effect: redirect if not admin, load users
  $effect(() => {
    if (!authStore.isAdmin) return;
    loadUsers();
  });

  async function loadUsers() {
    loading = true;
    try {
      const data = await usersApi.getAll(authStore.token);
      users = Array.isArray(data) ? data : (data.users || []);
    } catch (err) {
      toastStore.error(err.status === 403 ? 'Acceso denegado' : 'Error al cargar usuarios');
    } finally {
      loading = false;
    }
  }

  async function handleChangeRole(id, newRoleVal) {
    try {
      await usersApi.update(id, { role: newRoleVal }, authStore.token);
      toastStore.success('Rol actualizado');
      await loadUsers();
    } catch (err) {
      toastStore.error(err.message || 'Error al cambiar el rol');
    }
  }

  async function handleDelete(id) {
    try {
      await usersApi.delete(id, authStore.token);
      toastStore.success('Usuario eliminado');
      await loadUsers();
    } catch (err) {
      toastStore.error(err.message || 'Error al eliminar el usuario');
    }
  }

  function validateCreate() {
    const e = {};
    if (!newUsername.trim()) e.username = 'Obligatorio';
    if (!newPassword || newPassword.length < 4) e.password = 'Mínimo 4 caracteres';
    return e;
  }

  async function handleCreate() {
    const e = validateCreate();
    if (Object.keys(e).length) { createErrors = e; return; }
    createErrors = {};
    creating = true;
    try {
      await usersApi.create({ username: newUsername.trim(), password: newPassword, role: newRole }, authStore.token);
      toastStore.success('Usuario creado');
      newUsername = ''; newPassword = ''; newRole = 'user';
      showCreateForm = false;
      await loadUsers();
    } catch (err) {
      toastStore.error(err.message || 'Error al crear el usuario');
    } finally {
      creating = false;
    }
  }
</script>

<div class="admin-page">
  <div class="page-header">
    <div>
      <h1 class="page-title">Administración</h1>
      <p class="page-sub">
        {#if !loading}
          {users.length} usuarios · {adminCount} admins · {userCount} usuarios
        {:else}
          Cargando…
        {/if}
      </p>
    </div>
    <button class="btn-primary" onclick={() => showCreateForm = !showCreateForm}>
      {showCreateForm ? '× Cancelar' : '+ Nuevo usuario'}
    </button>
  </div>

  {#if showCreateForm}
    <div class="create-form">
      <h3>Crear usuario</h3>
      <div class="form-row">
        <div class="field">
          <label>Nombre de usuario</label>
          <input
            type="text"
            bind:value={newUsername}
            placeholder="usuario"
            class={createErrors.username ? 'input--error' : ''}
            disabled={creating}
          />
          {#if createErrors.username}<span class="error">{createErrors.username}</span>{/if}
        </div>
        <div class="field">
          <label>Contraseña</label>
          <input
            type="password"
            bind:value={newPassword}
            placeholder="••••••••"
            class={createErrors.password ? 'input--error' : ''}
            disabled={creating}
          />
          {#if createErrors.password}<span class="error">{createErrors.password}</span>{/if}
        </div>
        <div class="field">
          <label>Rol</label>
          <select bind:value={newRole} disabled={creating}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button class="btn-create" onclick={handleCreate} disabled={creating}>
          {creating ? 'Creando…' : 'Crear'}
        </button>
      </div>
    </div>
  {/if}

  <div class="table-wrapper">
    {#if loading}
      <div class="loading-text">Cargando usuarios…</div>
    {:else if users.length === 0}
      <div class="empty-state">No hay usuarios.</div>
    {:else}
      <table class="users-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user (user._id)}
            <UserRow
              {user}
              onChangeRole={handleChangeRole}
              onDelete={handleDelete}
            />
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<style>
  .admin-page {
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.8rem;
    margin: 0 0 0.2rem;
    color: var(--text);
    letter-spacing: -0.03em;
  }

  .page-sub {
    margin: 0;
    font-size: 0.88rem;
    color: var(--text-muted);
  }

  .btn-primary {
    padding: 0.65rem 1.3rem;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.88rem;
    cursor: pointer;
    transition: opacity 0.15s;
    white-space: nowrap;
  }
  .btn-primary:hover { opacity: 0.88; }

  .create-form {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .create-form h3 {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    margin: 0 0 1rem;
    font-size: 1rem;
    color: var(--text);
  }

  .form-row {
    display: flex;
    gap: 0.85rem;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .field { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 140px; }
  .field label { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
  .field input, .field select {
    padding: 0.6rem 0.85rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 9px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.15s;
  }
  .field input:focus, .field select:focus { border-color: var(--accent); }
  .field input.input--error { border-color: var(--red); }
  .error { font-size: 0.75rem; color: var(--red); }

  .btn-create {
    padding: 0.6rem 1.2rem;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 0.88rem;
    cursor: pointer;
    transition: opacity 0.15s;
    white-space: nowrap;
    align-self: flex-end;
  }
  .btn-create:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-create:hover:not(:disabled) { opacity: 0.88; }

  .table-wrapper {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    overflow-x: auto;
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;
  }

  .users-table thead tr {
    background: var(--surface-2);
  }

  .users-table th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }

  .loading-text, .empty-state {
    padding: 2.5rem;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    .admin-page { padding: 1rem; }
    .form-row { flex-direction: column; }
  }
</style>
