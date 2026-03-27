<script>
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  let { product, onClose } = $props();

  const imageUrl = $derived(
    product.imagen
      ? (product.imagen.startsWith('http') ? product.imagen : `${BASE_URL}/uploads/${product.imagen}`)
      : null
  );
</script>

<div class="overlay" onclick={onClose}>
  <div class="detail" onclick={e => e.stopPropagation()}>
    <button class="close-btn" onclick={onClose}>×</button>
    <div class="detail__image">
      {#if imageUrl}
        <img src={imageUrl} alt={product.nombre} />
      {:else}
        <div class="detail__placeholder">◈</div>
      {/if}
    </div>
    <div class="detail__body">
      <span class="detail__status {product.activo === false ? 'status--off' : 'status--on'}">
        {product.activo === false ? 'Inactivo' : 'Activo'}
      </span>
      <h2 class="detail__name">{product.nombre}</h2>
      <p class="detail__price">{Number(product.precio).toFixed(2)} €</p>
      {#if product._id}
        <p class="detail__id">ID: <code>{product._id}</code></p>
      {/if}
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 1rem;
  }
  .detail {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    width: 100%;
    max-width: 420px;
    overflow: hidden;
    position: relative;
    animation: popIn 0.2s ease;
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .close-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: 1.2rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  .detail__image {
    height: 240px;
    background: var(--surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .detail__image img { width: 100%; height: 100%; object-fit: cover; }
  .detail__placeholder { font-size: 3rem; color: var(--border); }
  .detail__body { padding: 1.5rem; }
  .detail__status {
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: 20px;
    letter-spacing: 0.04em;
  }
  .status--on { background: var(--green-subtle); color: var(--green); }
  .status--off { background: var(--red-subtle); color: var(--red); }
  .detail__name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.4rem;
    margin: 0.5rem 0 0.3rem;
    color: var(--text);
  }
  .detail__price {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--accent);
    margin: 0 0 0.75rem;
  }
  .detail__id {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin: 0;
  }
  .detail__id code {
    background: var(--surface-2);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
  }
</style>
