<script>
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  let { product, isAdmin, onEdit, onDelete, onSelect } = $props();

  const imageUrl = $derived(
    product.imagen
      ? (product.imagen.startsWith('http') ? product.imagen : `${BASE_URL}/uploads/${product.imagen}`)
      : null
  );
</script>

<article class="card" onclick={() => onSelect(product)}>
  <div class="card__image">
    {#if imageUrl}
      <img src={imageUrl} alt={product.nombre} />
    {:else}
      <div class="card__placeholder">◈</div>
    {/if}
    <span class="card__status {product.activo === false ? 'card__status--off' : 'card__status--on'}">
      {product.activo === false ? 'Inactivo' : 'Activo'}
    </span>
  </div>

  <div class="card__body">
    <h3 class="card__name">{product.nombre}</h3>
    <p class="card__price">{Number(product.precio).toFixed(2)} €</p>

    {#if isAdmin}
      <div class="card__actions" onclick={e => e.stopPropagation()}>
        <button class="btn btn--ghost btn--sm" onclick={() => onEdit(product)}>Editar</button>
        <button class="btn btn--danger btn--sm" onclick={() => onDelete(product._id)}>Borrar</button>
      </div>
    {/if}
  </div>
</article>

<style>
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  }
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    border-color: var(--accent);
  }

  .card__image {
    position: relative;
    height: 180px;
    background: var(--surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .card__placeholder {
    font-size: 2.5rem;
    color: var(--border);
  }

  .card__status {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
    letter-spacing: 0.04em;
  }
  .card__status--on { background: var(--green-subtle); color: var(--green); }
  .card__status--off { background: var(--red-subtle); color: var(--red); }

  .card__body { padding: 1rem; }
  .card__name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    margin: 0 0 0.35rem;
    color: var(--text);
  }
  .card__price {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent);
    margin: 0;
  }
  .card__actions {
    display: flex;
    gap: 0.4rem;
    margin-top: 0.85rem;
  }

  .btn {
    padding: 0.4rem 0.85rem;
    border-radius: 7px;
    font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s;
  }
  .btn--ghost {
    background: none;
    border-color: var(--border);
    color: var(--text-muted);
  }
  .btn--ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn--danger {
    background: none;
    border-color: var(--red);
    color: var(--red);
  }
  .btn--danger:hover { background: var(--red); color: white; }
  .btn--sm { padding: 0.3rem 0.65rem; }
</style>
