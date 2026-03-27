<script>
  let { count = 6 } = $props();
</script>

{#each Array(count) as _, i}
  <div class="skeleton-card">
    <div class="skeleton-img pulse"></div>
    <div class="skeleton-body">
      <div class="skeleton-line pulse" style="width: 70%"></div>
      <div class="skeleton-line skeleton-line--sm pulse" style="width: 40%"></div>
    </div>
  </div>
{/each}

<style>
  .skeleton-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }
  .skeleton-img {
    height: 180px;
    background: var(--surface-2);
  }
  .skeleton-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .skeleton-line {
    height: 14px;
    background: var(--surface-2);
    border-radius: 7px;
  }
  .skeleton-line--sm { height: 18px; }
  .pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
</style>
