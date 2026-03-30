# 🚀 Job Platform - Backend

Plataforma web de empleo construida con Node.js, Express, PostgreSQL y Prisma.

## 📋 Características

- **Autenticación JWT** con soporte para Google OAuth
- **Tres tipos de usuarios**: Usuarios (candidatos), Empresas y Administradores
- **Sistema de suscripciones** mensuales para empresas
- **CRUD completo** de ofertas laborales
- **Sistema de postulaciones** con estados
- **Panel administrativo** con métricas
- **Upload de archivos** (CV, logos, fotos de perfil)
- **Búsqueda y filtrado** avanzado de ofertas

## 🛠️ Stack Tecnológico

- **Node.js** + **Express** - Framework backend
- **PostgreSQL** - Base de datos
- **Prisma ORM** - ORM para PostgreSQL
- **JWT** - Autenticación
- **Passport.js** - OAuth (Google)
- **Bcrypt** - Hash de contraseñas
- **Multer** - Upload de archivos
- **Express Validator** - Validación de datos

## 📦 Instalación

### 1. Clonar el repositorio

```bash
cd backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/job_platform"
JWT_SECRET="tu_secreto_jwt_super_seguro"
RESET_PASSWORD_SECRET="tu_secreto_para_reset_password"
GOOGLE_CLIENT_ID="tu_google_client_id"
GOOGLE_CLIENT_SECRET="tu_google_client_secret"
MERCADO_PAGO_ACCESS_TOKEN="tu_access_token"
SMTP_HOST="smtp.tu-proveedor.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="tu_usuario_smtp"
SMTP_PASS="tu_password_smtp"
MAIL_FROM="professionals at home <no-reply@professionalsathome.com>"
```

Si no configurás SMTP en desarrollo, el backend usa una cuenta de prueba de **Ethereal** y muestra en consola un link para ver el correo enviado.

### 4. Configurar PostgreSQL

Crear la base de datos:

```bash
psql -U postgres
CREATE DATABASE job_platform;
\q
```

### 5. Ejecutar migraciones de Prisma

```bash
npm run prisma:migrate
```

### 6. Generar cliente de Prisma

```bash
npm run prisma:generate
```

### 7. Poblar base de datos con datos de ejemplo (opcional)

```bash
npm run prisma:seed
```

Esto creará:
- Admin: `admin@professionalsathome.com` / `admin123`
- Usuario: `juan.perez@example.com` / `user123`
- Empresa: `rrhh@techcorp.com` / `company123`
- 10 categorías predefinidas
- 1 oferta de trabajo de ejemplo

### 8. Iniciar servidor

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará corriendo en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
backend/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── seed.js            # Datos iniciales
├── src/
│   ├── config/            # Configuraciones
│   │   ├── database.js    # Conexión Prisma
│   │   ├── jwt.js         # Configuración JWT
│   │   ├── passport.js    # Estrategias OAuth
│   │   └── upload.js      # Configuración Multer
│   ├── controllers/       # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── company.controller.js
│   │   ├── jobOffer.controller.js
│   │   ├── application.controller.js
│   │   ├── admin.controller.js
│   │   ├── subscription.controller.js
│   │   └── category.controller.js
│   ├── middlewares/       # Middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validator.middleware.js
│   ├── routes/            # Rutas de la API
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── company.routes.js
│   │   ├── jobOffer.routes.js
│   │   ├── application.routes.js
│   │   ├── admin.routes.js
│   │   ├── subscription.routes.js
│   │   ├── category.routes.js
│   │   └── index.js
│   └── index.js           # Punto de entrada
├── uploads/               # Archivos subidos
├── .env                   # Variables de entorno
├── .env.example           # Ejemplo de variables
├── .gitignore
└── package.json
```

## 🔑 API Endpoints

### Autenticación

```
POST   /api/auth/user/register          - Registro de usuario
POST   /api/auth/user/login             - Login de usuario
GET    /api/auth/user/google            - OAuth Google (usuario)
POST   /api/auth/company/register       - Registro de empresa
POST   /api/auth/company/login          - Login de empresa
GET    /api/auth/company/google         - OAuth Google (empresa)
POST   /api/auth/admin/login            - Login de admin
POST   /api/auth/recover-password       - Solicitar recuperación de clave
POST   /api/auth/reset-password         - Restablecer clave con token
GET    /api/auth/profile                - Obtener perfil autenticado
```

### Usuarios (requiere auth como usuario)

```
GET    /api/users/profile               - Obtener perfil
PUT    /api/users/profile               - Actualizar perfil
DELETE /api/users/account               - Eliminar cuenta
POST   /api/users/upload/cv             - Subir CV
POST   /api/users/upload/profile-image  - Subir foto de perfil
GET    /api/users/applications          - Mis postulaciones
```

### Empresas (requiere auth como empresa)

```
GET    /api/companies/profile           - Obtener perfil
PUT    /api/companies/profile           - Actualizar perfil
DELETE /api/companies/account           - Eliminar cuenta
POST   /api/companies/upload/logo       - Subir logo
GET    /api/companies/subscription/status   - Estado de suscripción
GET    /api/companies/subscription/history  - Historial suscripciones
```

### Ofertas Laborales

```
# Públicas
GET    /api/job-offers/search           - Buscar ofertas (con filtros)
GET    /api/job-offers/:id              - Obtener oferta por ID

# Empresa (requiere auth y suscripción activa)
POST   /api/job-offers                  - Crear oferta
GET    /api/job-offers/company/my-offers - Mis ofertas
PUT    /api/job-offers/:id              - Actualizar oferta
DELETE /api/job-offers/:id              - Eliminar oferta
GET    /api/job-offers/:id/applicants   - Ver postulantes
PUT    /api/job-offers/applications/:id/status - Cambiar estado postulación
```

### Postulaciones (requiere auth como usuario)

```
POST   /api/applications/:jobOfferId/apply  - Postular a oferta
GET    /api/applications/:id            - Obtener postulación
DELETE /api/applications/:id            - Cancelar postulación
PUT    /api/applications/:id/cover-letter   - Actualizar carta
```

### Suscripciones

```
# Públicas
GET    /api/subscriptions/plans         - Planes disponibles
POST   /api/subscriptions/webhook/mercadopago - Webhook MP

# Empresa (requiere auth)
POST   /api/subscriptions               - Crear suscripción
GET    /api/subscriptions/active        - Suscripción activa
GET    /api/subscriptions/history       - Historial
PUT    /api/subscriptions/:id/cancel    - Cancelar suscripción
```

### Categorías

```
GET    /api/categories                  - Listar categorías
GET    /api/categories/:id              - Obtener categoría
POST   /api/categories                  - Crear (admin)
PUT    /api/categories/:id              - Actualizar (admin)
DELETE /api/categories/:id              - Eliminar (admin)
```

### Admin (requiere auth como admin)

```
GET    /api/admin/dashboard/metrics     - Métricas del dashboard
GET    /api/admin/users                 - Listar usuarios
GET    /api/admin/users/:id             - Obtener usuario
DELETE /api/admin/users/:id             - Eliminar usuario
GET    /api/admin/companies             - Listar empresas
GET    /api/admin/companies/:id         - Obtener empresa
PUT    /api/admin/companies/:id/block   - Bloquear/desbloquear
DELETE /api/admin/companies/:id         - Eliminar empresa
GET    /api/admin/subscriptions         - Listar suscripciones
GET    /api/admin/job-offers            - Listar ofertas
DELETE /api/admin/job-offers/:id        - Eliminar oferta
POST   /api/admin/admins                - Crear admin
```

## 🗄️ Modelo de Base de Datos

### Entidades Principales

- **User** - Usuarios/candidatos
- **Company** - Empresas
- **Admin** - Administradores
- **JobOffer** - Ofertas laborales
- **Application** - Postulaciones
- **Subscription** - Suscripciones
- **Category** - Categorías de trabajos

### Relaciones

- Una **Company** tiene muchas **JobOffers**
- Una **JobOffer** tiene muchas **Applications**
- Un **User** tiene muchas **Applications**
- Una **Company** tiene muchas **Subscriptions**
- Una **JobOffer** pertenece a una **Category**

## 🔒 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación.

### Header de autorización:

```
Authorization: Bearer <token>
```

### Tipos de usuario en el token:

```javascript
{
  id: "uuid",
  type: "user" | "company" | "admin"
}
```

## 📝 Validaciones

Todas las rutas incluyen validación de datos con `express-validator`:

- Email válido
- Contraseñas de al menos 6 caracteres
- Campos requeridos no vacíos
- Tipos de datos correctos

## 🚨 Manejo de Errores

Respuestas de error estandarizadas:

```json
{
  "error": "Mensaje de error",
  "details": [] // Opcional, para errores de validación
}
```

Códigos de estado HTTP:
- `200` - OK
- `201` - Creado
- `400` - Bad Request (datos inválidos)
- `401` - No autorizado
- `403` - Prohibido (sin permisos)
- `404` - No encontrado
- `500` - Error del servidor

## 🧪 Testing

Para ejecutar Prisma Studio (interfaz gráfica de la BD):

```bash
npm run prisma:studio
```

## 📊 Sistema de Suscripciones

Las empresas necesitan una suscripción activa para:
- Crear ofertas laborales
- Actualizar ofertas existentes
- Ver postulantes

Si la suscripción vence:
- La empresa se bloquea automáticamente
- No puede crear/editar ofertas
- Las ofertas existentes siguen visibles

## 🔄 Próximas Mejoras

- [ ] Integración completa con Mercado Pago
- [ ] Sistema de notificaciones por email
- [ ] Chat en tiempo real entre empresas y candidatos
- [ ] Sistema de recomendaciones con IA
- [ ] Análisis de compatibilidad CV-Oferta
- [ ] Tests unitarios y de integración
- [ ] Documentación con Swagger/OpenAPI
- [ ] Rate limiting y seguridad adicional

## 📄 Licencia

MIT

## 👥 Autor

Job Platform Team
