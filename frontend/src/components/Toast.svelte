<script>
  import { toastStore } from '../stores/toast.svelte.js';
</script>

<div class="toast-container">
  {#each toastStore.toasts as toast (toast.id)}
    <div class="toast toast--{toast.type}" role="alert">
      <span class="toast__icon">
        {#if toast.type === 'success'}✓{:else if toast.type === 'error'}✕{:else}ℹ{/if}
      </span>
      <span class="toast__message">{toast.message}</span>
      <button class="toast__close" onclick={() => toastStore.remove(toast.id)}>×</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.85rem 1.1rem;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    pointer-events: all;
    animation: slideIn 0.25s ease;
    min-width: 260px;
    max-width: 380px;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .toast--success { border-color: var(--green); }
  .toast--error { border-color: var(--red); }

  .toast__icon {
    font-size: 1rem;
    font-weight: 700;
  }
  .toast--success .toast__icon { color: var(--green); }
  .toast--error .toast__icon { color: var(--red); }
  .toast--info .toast__icon { color: var(--accent); }

  .toast__message {
    flex: 1;
    font-size: 0.88rem;
    color: var(--text);
  }

  .toast__close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0;
    line-height: 1;
  }
  .toast__close:hover { color: var(--text); }
</style>
