<script>
  let { user, onChangeRole, onDelete } = $props();
  let confirmDelete = $state(false);
</script>

<tr class="user-row">
  <td class="user-row__name">{user.username}</td>
  <td>
    <span class="badge badge--{user.role}">
      {user.role}
    </span>
  </td>
  <td class="user-row__actions">
    <button
      class="btn btn--ghost btn--xs"
      onclick={() => onChangeRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
    >
      {user.role === 'admin' ? '→ usuario' : '→ admin'}
    </button>
    {#if !confirmDelete}
      <button class="btn btn--danger btn--xs" onclick={() => confirmDelete = true}>
        Eliminar
      </button>
    {:else}
      <span class="confirm-text">¿Seguro?</span>
      <button class="btn btn--danger btn--xs" onclick={() => onDelete(user._id)}>Sí</button>
      <button class="btn btn--ghost btn--xs" onclick={() => confirmDelete = false}>No</button>
    {/if}
  </td>
</tr>

<style>
  .user-row td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
    font-size: 0.9rem;
    color: var(--text);
    vertical-align: middle;
  }
  .user-row__name { font-weight: 500; }
  .user-row__actions { display: flex; gap: 0.4rem; align-items: center; }

  .badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.18rem 0.5rem;
    border-radius: 20px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .badge--admin { background: var(--accent-subtle); color: var(--accent); }
  .badge--user { background: var(--surface-2); color: var(--text-muted); }

  .confirm-text { font-size: 0.8rem; color: var(--red); font-weight: 500; }

  .btn {
    padding: 0.3rem 0.65rem;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .btn--ghost { background: none; border-color: var(--border); color: var(--text-muted); }
  .btn--ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn--danger { background: none; border-color: var(--red); color: var(--red); }
  .btn--danger:hover { background: var(--red); color: white; }
  .btn--xs { padding: 0.25rem 0.55rem; font-size: 0.75rem; }
</style>
