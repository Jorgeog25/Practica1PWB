// stores/toast.svelte.js
function createToastStore() {
  let toasts = $state([]);

  function add(message, type = 'info') {
    const id = Date.now();
    toasts = [...toasts, { id, message, type }];
    setTimeout(() => remove(id), 3500);
  }

  function remove(id) {
    toasts = toasts.filter(t => t.id !== id);
  }

  function success(msg) { add(msg, 'success'); }
  function error(msg) { add(msg, 'error'); }
  function info(msg) { add(msg, 'info'); }

  return {
    get toasts() { return toasts; },
    success, error, info, remove
  };
}

export const toastStore = createToastStore();
