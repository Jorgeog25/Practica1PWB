<script>
  let { product = null, onSave, onCancel, loading = false } = $props();

  let nombre = $state(product?.nombre || '');
  let precio = $state(product?.precio ?? '');
  let activo = $state(product?.activo !== false);
  let imageFile = $state(null);
  let errors = $state({});

  function validate() {
    const e = {};
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (precio === '' || isNaN(Number(precio)) || Number(precio) < 0)
      e.precio = 'Introduce un precio válido';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { errors = e; return; }
    errors = {};

    const formData = new FormData();
    formData.append('nombre', nombre.trim());
    formData.append('precio', Number(precio));
    formData.append('activo', activo);
    if (imageFile) formData.append('imagen', imageFile);

    onSave(formData, product?._id);
  }

  function handleFileChange(e) {
    imageFile = e.target.files[0] || null;
  }
</script>

<div class="form-overlay" onclick={onCancel}>
  <div class="form-modal" onclick={e => e.stopPropagation()}>
    <div class="form-header">
      <h2>{product ? 'Editar producto' : 'Nuevo producto'}</h2>
      <button class="close-btn" onclick={onCancel}>×</button>
    </div>

    <div class="form-body">
      <div class="field">
        <label for="nombre">Nombre *</label>
        <input
          id="nombre"
          type="text"
          bind:value={nombre}
          placeholder="Nombre del producto"
          class={errors.nombre ? 'input--error' : ''}
          disabled={loading}
        />
        {#if errors.nombre}<span class="error">{errors.nombre}</span>{/if}
      </div>

      <div class="field">
        <label for="precio">Precio (€) *</label>
        <input
          id="precio"
          type="number"
          bind:value={precio}
          placeholder="0.00"
          min="0"
          step="0.01"
          class={errors.precio ? 'input--error' : ''}
          disabled={loading}
        />
        {#if errors.precio}<span class="error">{errors.precio}</span>{/if}
      </div>

      <div class="field">
        <label for="imagen">Imagen</label>
        <input
          id="imagen"
          type="file"
          accept="image/*"
          onchange={handleFileChange}
          disabled={loading}
          class="file-input"
        />
      </div>

      <div class="field field--check">
        <label class="check-label">
          <input type="checkbox" bind:checked={activo} disabled={loading} />
          <span>Producto activo</span>
        </label>
      </div>
    </div>

    <div class="form-footer">
      <button class="btn btn--ghost" onclick={onCancel} disabled={loading}>Cancelar</button>
      <button class="btn btn--primary" onclick={handleSubmit} disabled={loading}>
        {loading ? 'Guardando…' : (product ? 'Guardar cambios' : 'Crear producto')}
      </button>
    </div>
  </div>
</div>

<style>
  .form-overlay {
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

  .form-modal {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: popIn 0.2s ease;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  .form-header h2 {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.15rem;
    margin: 0;
    color: var(--text);
  }
  .close-btn {
    background: none;
    border: none;
    font-size: 1.4rem;
    color: var(--text-muted);
    cursor: pointer;
    line-height: 1;
    padding: 0.2rem;
  }
  .close-btn:hover { color: var(--text); }

  .form-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .field { display: flex; flex-direction: column; gap: 0.35rem; }
  .field label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-muted);
  }
  .field input[type="text"],
  .field input[type="number"] {
    padding: 0.65rem 0.9rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 9px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    transition: border-color 0.15s;
  }
  .field input:focus {
    outline: none;
    border-color: var(--accent);
  }
  .field input.input--error { border-color: var(--red); }
  .file-input {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .field--check .check-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--text);
  }
  .field--check input[type="checkbox"] {
    accent-color: var(--accent);
    width: 16px;
    height: 16px;
  }

  .error { font-size: 0.78rem; color: var(--red); }

  .form-footer {
    display: flex;
    gap: 0.6rem;
    justify-content: flex-end;
    padding: 1.25rem 1.5rem;
    border-top: 1px solid var(--border);
  }

  .btn {
    padding: 0.6rem 1.2rem;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s;
    font-weight: 500;
  }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn--ghost {
    background: none;
    border-color: var(--border);
    color: var(--text-muted);
  }
  .btn--ghost:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .btn--primary {
    background: var(--accent);
    color: #fff;
  }
  .btn--primary:hover:not(:disabled) { opacity: 0.88; }
</style>
