<script>
  import { productsApi } from '../services/api.js';
  import { authStore } from '../stores/auth.svelte.js';
  import { toastStore } from '../stores/toast.svelte.js';
  import ProductCard from '../components/ProductCard.svelte';
  import ProductForm from '../components/ProductForm.svelte';
  import ProductDetail from '../components/ProductDetail.svelte';
  import SkeletonCard from '../components/SkeletonCard.svelte';

  let products = $state([]);
  let loading = $state(true);
  let saving = $state(false);
  let search = $state('');
  let showForm = $state(false);
  let editingProduct = $state(null);
  let selectedProduct = $state(null);
  let confirmDeleteId = $state(null);

  // Derived: filtered products by search
  const filteredProducts = $derived(
    search.trim()
      ? products.filter(p =>
          p.nombre?.toLowerCase().includes(search.toLowerCase())
        )
      : products
  );

  const totalCount = $derived(filteredProducts.length);
  const activeCount = $derived(filteredProducts.filter(p => p.activo !== false).length);

  async function loadProducts() {
    loading = true;
    try {
      const data = await productsApi.getAll();
      products = Array.isArray(data) ? data : (data.productos || data.products || []);
    } catch (err) {
      toastStore.error('Error al cargar productos');
    } finally {
      loading = false;
    }
  }

  // $effect: cargar productos al montar
  $effect(() => {
    loadProducts();
  });

  async function handleSave(formData, id) {
    saving = true;
    try {
      if (id) {
        await productsApi.update(id, formData, authStore.token);
        toastStore.success('Producto actualizado');
      } else {
        await productsApi.create(formData, authStore.token);
        toastStore.success('Producto creado');
      }
      showForm = false;
      editingProduct = null;
      await loadProducts();
    } catch (err) {
      toastStore.error(err.message || 'Error al guardar el producto');
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id) {
    confirmDeleteId = null;
    try {
      await productsApi.delete(id, authStore.token);
      toastStore.success('Producto eliminado');
      await loadProducts();
    } catch (err) {
      toastStore.error(err.message || 'Error al eliminar el producto');
    }
  }

  function openEdit(product) {
    editingProduct = product;
    showForm = true;
  }

  function openNew() {
    editingProduct = null;
    showForm = true;
  }
</script>

<div class="products-page">
  <div class="page-header">
    <div>
      <h1 class="page-title">Productos</h1>
      <p class="page-sub">
        {#if !loading}
          {totalCount} productos · {activeCount} activos
        {:else}
          Cargando…
        {/if}
      </p>
    </div>

    {#if authStore.isAdmin}
      <button class="btn-primary" onclick={openNew}>
        + Nuevo producto
      </button>
    {/if}
  </div>

  <div class="search-bar">
    <span class="search-icon">⌕</span>
    <input
      type="text"
      bind:value={search}
      placeholder="Buscar por nombre…"
      class="search-input"
    />
    {#if search}
      <button class="search-clear" onclick={() => search = ''}>×</button>
    {/if}
  </div>

  <div class="products-grid">
    {#if loading}
      <SkeletonCard count={6} />
    {:else if filteredProducts.length === 0}
      <div class="empty-state">
        <span class="empty-icon">◈</span>
        <p>{search ? 'No hay productos que coincidan con la búsqueda.' : 'No hay productos todavía.'}</p>
      </div>
    {:else}
      {#each filteredProducts as product (product._id)}
        <ProductCard
          {product}
          isAdmin={authStore.isAdmin}
          onEdit={openEdit}
          onDelete={id => confirmDeleteId = id}
          onSelect={p => selectedProduct = p}
        />
      {/each}
    {/if}
  </div>
</div>

<!-- Confirm delete -->
{#if confirmDeleteId}
  <div class="overlay" onclick={() => confirmDeleteId = null}>
    <div class="confirm-dialog" onclick={e => e.stopPropagation()}>
      <h3>¿Eliminar producto?</h3>
      <p>Esta acción no se puede deshacer.</p>
      <div class="confirm-actions">
        <button class="btn btn--ghost" onclick={() => confirmDeleteId = null}>Cancelar</button>
        <button class="btn btn--danger" onclick={() => handleDelete(confirmDeleteId)}>Eliminar</button>
      </div>
    </div>
  </div>
{/if}

<!-- Product form modal -->
{#if showForm}
  <ProductForm
    product={editingProduct}
    loading={saving}
    onSave={handleSave}
    onCancel={() => { showForm = false; editingProduct = null; }}
  />
{/if}

<!-- Product detail modal -->
{#if selectedProduct}
  <ProductDetail
    product={selectedProduct}
    onClose={() => selectedProduct = null}
  />
{/if}

<style>
  .products-page {
    padding: 2rem;
    max-width: 1200px;
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
    transition: opacity 0.15s, transform 0.1s;
    white-space: nowrap;
  }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0 0.9rem;
    margin-bottom: 1.75rem;
    transition: border-color 0.15s;
  }
  .search-bar:focus-within { border-color: var(--accent); }

  .search-icon { font-size: 1.1rem; color: var(--text-muted); }

  .search-input {
    flex: 1;
    background: none;
    border: none;
    padding: 0.75rem 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--text);
    outline: none;
  }
  .search-input::placeholder { color: var(--text-muted); opacity: 0.5; }

  .search-clear {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.2rem;
    line-height: 1;
  }
  .search-clear:hover { color: var(--text); }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.25rem;
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 0;
    color: var(--text-muted);
  }
  .empty-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; opacity: 0.3; }

  /* Confirm dialog */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 1rem;
  }
  .confirm-dialog {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.75rem;
    max-width: 360px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    animation: popIn 0.2s ease;
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .confirm-dialog h3 {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    margin: 0 0 0.4rem;
    color: var(--text);
  }
  .confirm-dialog p {
    font-size: 0.88rem;
    color: var(--text-muted);
    margin: 0 0 1.25rem;
  }
  .confirm-actions { display: flex; gap: 0.6rem; justify-content: flex-end; }

  .btn {
    padding: 0.55rem 1.1rem;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s;
    font-weight: 500;
  }
  .btn--ghost { background: none; border-color: var(--border); color: var(--text-muted); }
  .btn--ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn--danger { background: var(--red); color: white; border-color: var(--red); }
  .btn--danger:hover { opacity: 0.85; }

  @media (max-width: 600px) {
    .products-page { padding: 1rem; }
    .products-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.85rem; }
  }
</style>