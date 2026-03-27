# TiendaApp — Frontend Svelte 5

Frontend SPA para la gestión de productos y usuarios, construido con **Svelte 5 + Vite**.

---

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar la URL del backend
cp .env.example .env
# Edita .env y ajusta VITE_API_URL si el backend no corre en localhost:3000

# 3. Arrancar en modo desarrollo
npm run dev

# 4. Build de producción
npm run build
npm run preview
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.svelte        — Barra de navegación con página activa
│   ├── Toast.svelte         — Notificaciones emergentes
│   ├── SkeletonCard.svelte  — Skeleton loader para productos
│   ├── ProductCard.svelte   — Tarjeta de producto (con acciones admin)
│   ├── ProductDetail.svelte — Modal de detalle de producto
│   ├── ProductForm.svelte   — Formulario de creación/edición
│   └── UserRow.svelte       — Fila de usuario en tabla admin
├── pages/
│   ├── Login.svelte         — Login + Registro
│   ├── Products.svelte      — Listado, búsqueda y CRUD de productos
│   ├── Profile.svelte       — Perfil del usuario + cerrar sesión
│   └── Admin.svelte         — Panel de administración de usuarios
├── services/
│   └── api.js               — Funciones de llamada a la API REST
├── stores/
│   ├── auth.svelte.js       — Estado global de autenticación
│   └── toast.svelte.js      — Estado global de notificaciones
├── App.svelte               — Componente raíz con routing y estilos globales
└── main.js                  — Punto de entrada
```

---

## Runas de Svelte 5 utilizadas

### `$state()`
- **`auth.svelte.js`**: `token`, `user`, `loading` — estado global de autenticación restaurado desde `localStorage`.
- **`toast.svelte.js`**: array `toasts` — lista reactiva de notificaciones.
- **`Products.svelte`**: `products`, `loading`, `search`, `showForm`, etc.
- **`Admin.svelte`**: `users`, `loading`, `showCreateForm`, etc.
- **`ProductForm.svelte`**: `nombre`, `precio`, `activo`, `errors`.
- **`Login.svelte`**: `username`, `password`, `loading`, `mode`.

### `$derived()`
- **`auth.svelte.js`**: `isAuthenticated`, `isAdmin`, `userName` — valores derivados del token/user.
- **`Products.svelte`**: `filteredProducts` (búsqueda local), `totalCount`, `activeCount`.
- **`Admin.svelte`**: `adminCount`, `userCount`.
- **`ProductCard.svelte`**: `imageUrl` — URL de imagen derivada del campo imagen.
- **`ProductDetail.svelte`**: `imageUrl`.

### `$effect()`
- **`App.svelte`**: redirige a login si no hay sesión; redirige desde admin si no es admin.
- **`Products.svelte`**: carga los productos al montar el componente.
- **`Admin.svelte`**: carga los usuarios al montar el componente si el usuario es admin.

### `$props()`
- **`Navbar.svelte`**: `currentPage`, `onNavigate`
- **`ProductCard.svelte`**: `product`, `isAdmin`, `onEdit`, `onDelete`, `onSelect`
- **`ProductForm.svelte`**: `product`, `onSave`, `onCancel`, `loading`
- **`ProductDetail.svelte`**: `product`, `onClose`
- **`UserRow.svelte`**: `user`, `onChangeRole`, `onDelete`
- **`Profile.svelte`**: `onNavigate`
- **`SkeletonCard.svelte`**: `count`

Los callbacks (`onSave`, `onDelete`, `onEdit`, etc.) reemplazan los eventos personalizados clásicos de Svelte 4.

---

## Endpoints del backend utilizados

| Método | Endpoint         | Rol requerido | Descripción                     |
|--------|------------------|---------------|---------------------------------|
| POST   | `/login`         | —             | Iniciar sesión (obtener JWT)    |
| POST   | `/register`      | —             | Registrar nuevo usuario         |
| GET    | `/productos`     | —             | Listar productos (con ?name=)   |
| POST   | `/productos`     | any auth      | Crear producto (multipart)      |
| PUT    | `/productos/:id` | any auth      | Actualizar producto             |
| DELETE | `/productos/:id` | any auth      | Eliminar producto               |
| GET    | `/users`         | admin         | Listar usuarios                 |
| POST   | `/users`         | admin         | Crear usuario                   |
| PUT    | `/users/:id`     | admin         | Cambiar rol / datos de usuario  |
| DELETE | `/users/:id`     | admin         | Eliminar usuario                |

---

## Funcionalidades implementadas

### Requisitos mínimos (5 pts)
- ✅ Proyecto Vite + Svelte 5
- ✅ Login con JWT, gestión de errores
- ✅ Listado, detalle, creación, edición y borrado de productos
- ✅ 3 pantallas: Login, Productos, Perfil (+ Admin para admins)
- ✅ Navbar con página activa resaltada
- ✅ Layout responsive

### Svelte 5 runes (hasta +3 pts)
- ✅ `$state()` y `$derived()` para estado global y datos derivados
- ✅ `$effect()` para side effects (carga de datos, redirecciones)
- ✅ `$props()` y callbacks para comunicación entre componentes

### Funcionalidades avanzadas (hasta +2 pts)
- ✅ Gestión de usuarios y roles (zona admin)
- ✅ Persistencia de sesión con `localStorage`
- ✅ Búsqueda de productos en tiempo real con `$derived()`
- ✅ Validaciones en formularios con mensajes de error
- ✅ Spinner y skeletons de carga
- ✅ Toast notifications para errores/éxito
- ✅ Confirmación antes de eliminar
