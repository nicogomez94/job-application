# 💼 Job Platform - Plataforma Web de Empleo

Plataforma completa de gestión de empleos construida con React, Node.js, Express, PostgreSQL y Prisma.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Modelo de Datos](#modelo-de-datos)
- [API Documentation](#api-documentation)
- [Seguridad](#seguridad)
- [Deploy](#deploy)

## 📖 Descripción

Job Platform es una plataforma web completa que conecta candidatos con empresas. Permite a los usuarios buscar y postularse a ofertas laborales, mientras que las empresas pueden publicar ofertas, gestionar postulantes y administrar su suscripción.

### Roles de Usuario

1. **Usuario/Candidato**
   - Crear perfil profesional
   - Subir CV y documentos
   - Buscar ofertas con filtros avanzados
   - Postularse a ofertas
   - Seguimiento de postulaciones

2. **Empresa**
   - Publicar ofertas laborales ilimitadas (con suscripción)
   - Gestionar postulantes
   - Ver perfiles de candidatos
   - Contacto directo por WhatsApp
   - Dashboard con métricas

3. **Administrador**
   - Panel de control completo
   - Gestión de usuarios y empresas
   - Supervisión de suscripciones
   - Métricas y estadísticas
   - Moderación de contenido

## ✨ Características

### Funcionalidades Principales

#### 🔐 Autenticación
- JWT (JSON Web Tokens)
- OAuth con Google (usuarios y empresas)
- Sesiones persistentes
- Recuperación de contraseña

#### 👤 Módulo Usuario
- Registro y login
- Perfil profesional completo
- CV en PDF
- Portfolio y links profesionales
- Experiencia laboral y educación
- Skills y competencias
- Búsqueda de ofertas con múltiples filtros
- Postulación con carta de presentación
- Seguimiento de estados de postulación

#### 🏢 Módulo Empresa
- Registro y login
- Perfil de empresa
- Logo y descripción
- CRUD de ofertas laborales
- Campo de WhatsApp en ofertas
- Visualización de postulantes
- Cambio de estado de postulaciones
- Sistema de suscripciones
- Bloqueo automático sin suscripción activa

#### 👨‍💼 Módulo Admin
- Dashboard con métricas
- CRUD de usuarios
- CRUD de empresas
- Bloqueo/desbloqueo de cuentas
- Gestión de suscripciones
- Moderación de ofertas
- Estadísticas del sistema

#### 💳 Sistema de Suscripciones
- Planes: Mensual, Trimestral, Anual
- Integración preparada para Mercado Pago
- Estados: Activa, Vencida, Cancelada
- Bloqueo automático al vencer
- Historial de pagos

## 🏗️ Arquitectura

```
┌─────────────────┐
│   React SPA     │  Frontend (Port 5173)
│   (Vite)        │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express API    │  Backend (Port 5000)
│  Node.js        │
└────────┬────────┘
         │
┌────────▼────────┐
│   Prisma ORM    │
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │  Database
└─────────────────┘
```

### Flujo de Autenticación

```
Usuario → Login → Backend → Valida → Genera JWT → Frontend
                                                      │
                                                      ▼
                                            Guarda en localStorage
                                                      │
                                                      ▼
                                            Zustand Store (estado)
                                                      │
                                                      ▼
                                        Axios Interceptor (header)
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Library para UI
- **Vite** - Build tool y dev server
- **React Router 6** - Navegación
- **Tailwind CSS** - Estilos
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Formularios
- **React Hot Toast** - Notificaciones
- **Lucide React** - Iconos

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Passport.js** - OAuth
- **Bcrypt** - Hash de contraseñas
- **Multer** - Upload de archivos
- **Express Validator** - Validación

### DevOps & Tools
- **Git** - Control de versiones
- **npm** - Package manager
- **Nodemon** - Hot reload
- **Prisma Studio** - Database GUI

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn
- Git

### 1. Clonar el Repositorio

```bash
git clone <url-del-repo>
cd ruben
```

### 2. Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### 3. Configurar Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Editar .env
npm run dev
```

### 4. Acceder a la Aplicación

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Prisma Studio: `npm run prisma:studio` (en backend/)

### Credenciales de Prueba (después del seed)

```
Admin:   admin@jobplatform.com / admin123
Usuario: juan.perez@example.com / user123
Empresa: rrhh@techcorp.com / company123
```

## 📂 Estructura del Proyecto

```
ruben/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── index.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env
│   ├── package.json
│   └── README.md
└── README.md (este archivo)
```

## 🗄️ Modelo de Datos

### Entidades Principales

#### User (Usuario/Candidato)
```prisma
- id: UUID
- email: String (unique)
- password: String (hash)
- firstName, lastName: String
- profileImage, cvUrl: String
- title, bio: Text
- experience, education: JSON
- skills: String[]
- applications: Application[]
```

#### Company (Empresa)
```prisma
- id: UUID
- email: String (unique)
- companyName: String
- companyLogo, description: String
- location, industry, size: String
- isActive, isBlocked: Boolean
- jobOffers: JobOffer[]
- subscriptions: Subscription[]
```

#### JobOffer (Oferta Laboral)
```prisma
- id: UUID
- title, description: String
- requirements, responsibilities: String[]
- location: String
- salaryMin, salaryMax: Decimal
- workType: FULL_TIME | PART_TIME | CONTRACT | FREELANCE
- workMode: PRESENCIAL | REMOTO | HIBRIDO
- experienceLevel: ENTRY | JUNIOR | MID | SENIOR
- whatsappNumber: String
- languages: String[]
- company: Company
- category: Category
- applications: Application[]
```

#### Application (Postulación)
```prisma
- id: UUID
- coverLetter: Text
- status: PENDING | REVIEWING | SHORTLISTED | INTERVIEWED | REJECTED | ACCEPTED
- user: User
- jobOffer: JobOffer
```

#### Subscription (Suscripción)
```prisma
- id: UUID
- plan: MONTHLY | QUARTERLY | ANNUAL
- status: ACTIVE | EXPIRED | CANCELLED
- startDate, endDate: DateTime
- amount: Decimal
- paymentId: String (Mercado Pago)
- company: Company
```

### Relaciones

```
User --< Application >-- JobOffer >-- Company
                             |
                          Category
                          
Company --< Subscription
Company --< JobOffer
```

## 📡 API Documentation

Ver documentación completa en [backend/README.md](backend/README.md)

### Endpoints Principales

#### Auth
```
POST /api/auth/user/register
POST /api/auth/user/login
POST /api/auth/company/register
POST /api/auth/company/login
POST /api/auth/admin/login
GET  /api/auth/profile
```

#### Job Offers (Públicas)
```
GET /api/job-offers/search?location=Buenos Aires&category=tech
GET /api/job-offers/:id
```

#### Applications (Usuario autenticado)
```
POST /api/applications/:jobOfferId/apply
GET  /api/users/applications
```

#### Company (Requiere suscripción)
```
POST /api/job-offers
GET  /api/job-offers/:id/applicants
PUT  /api/job-offers/:id
```

## 🔒 Seguridad

### Medidas Implementadas

1. **Autenticación JWT**
   - Tokens con expiración
   - Refresh token rotation
   - Logout en servidor

2. **Hash de Contraseñas**
   - Bcrypt con salt rounds

3. **Validación de Datos**
   - Express Validator en todas las rutas
   - Sanitización de inputs

4. **CORS**
   - Configurado para dominio específico
   - Credentials habilitados

5. **Protección de Rutas**
   - Middleware de autenticación
   - Verificación de roles
   - Verificación de suscripción activa

6. **Upload de Archivos**
   - Tamaño máximo limitado
   - Tipos de archivo restringidos
   - Nombres únicos generados

### Variables de Entorno Sensibles

```env
JWT_SECRET=
DATABASE_URL=
GOOGLE_CLIENT_SECRET=
MERCADO_PAGO_ACCESS_TOKEN=
```

⚠️ **Nunca** commitear archivos `.env` al repositorio.

## 🚀 Deploy

### Backend (Node.js)

Opciones recomendadas:
- **Railway**
- **Render**
- **Heroku**
- **DigitalOcean**
- **AWS EC2**

### Frontend (React SPA)

Opciones recomendadas:
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

### Base de Datos

Opciones recomendadas:
- **Railway PostgreSQL**
- **Supabase**
- **AWS RDS**
- **Heroku Postgres**

### Variables de Entorno en Producción

Configurar en el panel de control de cada plataforma:

**Backend:**
```
DATABASE_URL
JWT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
MERCADO_PAGO_ACCESS_TOKEN
FRONTEND_URL
NODE_ENV=production
```

**Frontend:**
```
VITE_API_URL=https://tu-backend.com/api
VITE_GOOGLE_CLIENT_ID
```

## 📊 Estado del Proyecto

### ✅ Completado

- ✅ Diseño de base de datos
- ✅ Esquema Prisma con todas las relaciones
- ✅ Backend completo con Express
- ✅ Autenticación JWT y OAuth
- ✅ CRUD completo de todas las entidades
- ✅ Sistema de roles y permisos
- ✅ Sistema de suscripciones
- ✅ Flujo obligatorio de selección de membresía al registrarse/loguear como empresa
- ✅ Estructura lista para integración con Mercado Pago (ver sección abajo)
- ✅ Middleware de verificación de suscripción
- ✅ Upload de archivos (CV, logos, fotos)
- ✅ Búsqueda y filtrado de ofertas
- ✅ Frontend base con React
- ✅ Routing y rutas protegidas
- ✅ Estado global con Zustand
- ✅ Servicios de API configurados
- ✅ Layout principal

### 🚧 En Progreso

- 🚧 Implementación completa de formularios
- 🚧 Dashboards con datos reales
- 🚧 Panel de administración completo
- 🚧 Integración completa Mercado Pago

### 💳 Estructura lista para Mercado Pago

El sistema de suscripciones está preparado para activar pagos reales con Mercado Pago con cambios mínimos:

#### Estado actual (modo gratuito / lanzamiento)
- Al registrarse o loguearse como empresa, se obliga a seleccionar un plan en `/register/company/plan`
- Al hacer login, si la empresa no tiene suscripción activa, se redirige automáticamente a esa pantalla
- El plan se activa con `amount: 0`, `paymentMethod: 'free'`, `paymentStatus: 'free'`
- No se requiere tarjeta de crédito

#### Para activar pagos con Mercado Pago
1. **Backend** — `subscription.controller.js`, función `getPlans`: cambiar `isFreeMode = true` → `isFreeMode = false`
2. **Frontend** — `SelectPlan.jsx`: descomentar el bloque marcado con `MERCADO PAGO INTEGRATION POINT` y reemplazar la llamada gratuita por un redirect al `init_point` de la preferencia de pago
3. **Backend** — agregar el servicio de Mercado Pago SDK y completar el webhook en `mercadoPagoWebhook()` (ya existe el endpoint `/api/subscriptions/webhook/mercadopago`)
4. **Variables de entorno** — activar `MERCADO_PAGO_ACCESS_TOKEN` en el backend

El modelo de base de datos (`Subscription`) ya tiene los campos `paymentId`, `paymentStatus` y `paymentMethod` listos para almacenar la información del pago.

### 📋 Por Hacer

- [ ] Tests unitarios (backend)
- [ ] Tests E2E (frontend)
- [ ] Notificaciones por email
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre empresas y candidatos
- [ ] Sistema de recomendaciones
- [ ] Análisis de compatibilidad CV-Oferta con IA
- [ ] Documentación con Swagger
- [ ] Internacionalización (i18n)
- [ ] PWA
- [ ] SEO optimization

## 🤝 Contribución

Este es un proyecto privado. Para contribuir:

1. Fork el repositorio
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Job Platform Team © 2026

---

**¿Necesitas ayuda?** Contacta a través de: contacto@jobplatform.com
