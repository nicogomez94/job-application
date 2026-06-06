# 🎨 Job Platform - Frontend

Frontend de la plataforma web de empleo construido con React, Vite y Tailwind CSS.

## 📋 Características

- **React 18** con React Router para navegación
- **Vite** como build tool (desarrollo ultra-rápido)
- **Tailwind CSS** para estilos
- **Zustand** para gestión de estado
- **React Hook Form** para formularios
- **Axios** para peticiones HTTP
- **React Hot Toast** para notificaciones
- **Lucide React** para iconos

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env.local` basado en `.env.example`:

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
VITE_DEBUG_MODE=true
```

`VITE_DEBUG_MODE` solo precarga formularios de prueba. Todas las operaciones siguen usando la API real configurada en `VITE_API_URL`.

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
frontend/
├── public/               # Archivos estáticos
├── src/
│   ├── assets/          # Imágenes, fuentes, etc.
│   ├── components/      # Componentes reutilizables
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── context/         # Stores de Zustand
│   │   └── authStore.js
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Páginas/Vistas
│   │   ├── Home.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── RegisterUser.jsx
│   │   │   └── RegisterCompany.jsx
│   │   ├── user/        # Páginas de usuario
│   │   ├── company/     # Páginas de empresa
│   │   └── admin/       # Páginas de admin
│   ├── services/        # Servicios de API
│   │   ├── api.js
│   │   └── index.js
│   ├── utils/           # Utilidades
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── .env                 # Variables de entorno
├── index.html           # HTML base
├── package.json
├── tailwind.config.js   # Configuración de Tailwind
├── vite.config.js       # Configuración de Vite
└── README.md
```

## 🎨 Componentes Principales

### Layout Components

- **Layout.jsx** - Contenedor principal con Navbar y Footer
- **Navbar.jsx** - Barra de navegación con autenticación
- **Footer.jsx** - Pie de página

### Pages

#### Públicas
- **Home** - Página de inicio
- **JobSearch** - Búsqueda de empleos
- **JobDetail** - Detalle de oferta laboral
- **Login** - Inicio de sesión (usuario/empresa/admin)
- **RegisterUser** - Registro de candidatos
- **RegisterCompany** - Registro de empresas

#### Usuario (Candidato)
- **UserDashboard** - Panel principal del usuario
- **UserProfile** - Perfil profesional
- **UserApplications** - Mis postulaciones

#### Empresa
- **CompanyDashboard** - Panel principal de la empresa
- **CompanyProfile** - Perfil de empresa
- **CompanyJobs** - Lista de ofertas publicadas
- **CreateJob** - Crear oferta laboral
- **EditJob** - Editar oferta laboral
- **JobApplicants** - Ver postulantes
- **CompanySubscription** - Gestión de suscripción

#### Admin
- **AdminDashboard** - Panel de administración
- **AdminUsers** - Gestión de usuarios
- **AdminCompanies** - Gestión de empresas
- **AdminJobOffers** - Gestión de ofertas
- **AdminSubscriptions** - Gestión de suscripciones

## 🔐 Autenticación

La autenticación se maneja con:

1. **JWT Token** guardado en localStorage
2. **Zustand Store** para estado global de autenticación
3. **Axios Interceptors** para incluir token en peticiones
4. **Protected Routes** para rutas privadas

### Ejemplo de uso:

```javascript
import { useAuthStore } from './context/authStore';

function MyComponent() {
  const { user, userType, isAuthenticated, logout } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <div>Hola {user.firstName}</div>;
}
```

## 🎨 Estilos con Tailwind

El proyecto usa Tailwind CSS con clases personalizadas:

```jsx
// Botones
<button className="btn btn-primary">Primario</button>
<button className="btn btn-secondary">Secundario</button>
<button className="btn btn-outline">Outline</button>

// Inputs
<input className="input" />

// Cards
<div className="card">Contenido</div>

// Badges
<span className="badge badge-success">Activo</span>
<span className="badge badge-warning">Pendiente</span>
<span className="badge badge-error">Error</span>
```

## 📡 Servicios de API

Todos los servicios están centralizados en `src/services/`:

```javascript
import { authService, userService, jobOfferService } from './services';

// Autenticación
await authService.loginUser({ email, password });

// Usuarios
await userService.getProfile();
await userService.uploadCV(file);

// Ofertas
await jobOfferService.search({ location: 'Buenos Aires' });
await applicationService.apply(jobOfferId, coverLetter);
```

## 🚦 Rutas

### Rutas Públicas
- `/` - Home
- `/jobs` - Búsqueda de empleos
- `/jobs/:id` - Detalle de oferta
- `/login` - Login
- `/register/user` - Registro usuario
- `/register/company` - Registro empresa

### Rutas Privadas - Usuario
- `/user/dashboard` - Dashboard
- `/user/profile` - Perfil
- `/user/applications` - Postulaciones

### Rutas Privadas - Empresa
- `/company/dashboard` - Dashboard
- `/company/profile` - Perfil
- `/company/jobs` - Mis ofertas
- `/company/jobs/create` - Crear oferta
- `/company/jobs/edit/:id` - Editar oferta
- `/company/jobs/:id/applicants` - Ver postulantes
- `/company/subscription` - Suscripción

### Rutas Privadas - Admin
- `/admin/dashboard` - Dashboard
- `/admin/users` - Gestión usuarios
- `/admin/companies` - Gestión empresas
- `/admin/job-offers` - Gestión ofertas
- `/admin/subscriptions` - Gestión suscripciones

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## 🎯 Estado del Proyecto

### ✅ Completado
- Estructura base de carpetas
- Configuración de Vite, Tailwind, React Router
- Sistema de autenticación
- Layout principal (Navbar, Footer)
- Página de inicio
- Sistema de rutas protegidas
- Servicios de API configurados

### 🚧 En Construcción
- Formularios de registro completos
- Páginas de dashboard con datos reales
- Componentes de búsqueda y filtros
- Sistema de postulaciones
- Gestión de perfil con subida de archivos
- Panel de administración completo
- Integración completa con backend

## 🚀 Próximas Mejoras

- [ ] Componentes de formulario reutilizables
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre empresas y candidatos
- [ ] Dashboard con gráficos y estadísticas
- [ ] Modo oscuro
- [ ] Responsive design mejorado
- [ ] Pruebas unitarias con Vitest
- [ ] PWA (Progressive Web App)
- [ ] i18n (internacionalización)

## 📄 Licencia

MIT
