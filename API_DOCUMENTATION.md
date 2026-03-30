# 📡 API REST - Documentación de Endpoints

Base URL: `http://localhost:5000/api`

## 🔐 Autenticación

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔑 Autenticación

### Registro de Usuario (Candidato)

```http
POST /auth/user/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+54 9 11 1234-5678"
}
```

**Respuesta (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login de Usuario

```http
POST /auth/user/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Registro de Empresa

```http
POST /auth/company/register
Content-Type: application/json

{
  "email": "empresa@example.com",
  "password": "password123",
  "companyName": "TechCorp SA",
  "description": "Empresa de tecnología",
  "website": "https://techcorp.com",
  "location": "Buenos Aires, Argentina",
  "industry": "Tecnología",
  "size": "51-200"
}
```

### Login de Empresa

```http
POST /auth/company/login
Content-Type: application/json

{
  "email": "empresa@example.com",
  "password": "password123"
}
```

### Login de Admin

```http
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@professionalsathome.com",
  "password": "admin123"
}
```

### Obtener Perfil Autenticado

```http
GET /auth/profile
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "profile": {
    "id": "uuid",
    "email": "usuario@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    ...
  },
  "type": "user"
}
```

---

## 👤 Usuario (Candidato)

> Todas las rutas requieren autenticación como usuario

### Obtener Mi Perfil

```http
GET /users/profile
Authorization: Bearer <token>
```

### Actualizar Perfil

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+54 9 11 1234-5678",
  "title": "Desarrollador Full Stack",
  "bio": "Desarrollador con 5 años de experiencia...",
  "skills": ["JavaScript", "React", "Node.js"],
  "location": "Buenos Aires, Argentina",
  "linkedinUrl": "https://linkedin.com/in/juanperez",
  "portfolioUrl": "https://juanperez.dev",
  "experience": [
    {
      "company": "Tech Solutions",
      "position": "Full Stack Developer",
      "startDate": "2020-01",
      "endDate": "Presente",
      "description": "Desarrollo de aplicaciones web"
    }
  ],
  "education": [
    {
      "institution": "Universidad XYZ",
      "degree": "Ingeniería en Sistemas",
      "startDate": "2015-03",
      "endDate": "2019-12"
    }
  ]
}
```

### Subir CV

```http
POST /users/upload/cv
Authorization: Bearer <token>
Content-Type: multipart/form-data

cv: <archivo.pdf>
```

**Respuesta (200):**
```json
{
  "message": "CV subido exitosamente",
  "cvUrl": "/uploads/cvs/cv-1234567890.pdf"
}
```

### Subir Foto de Perfil

```http
POST /users/upload/profile-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

profileImage: <imagen.jpg>
```

### Obtener Mis Postulaciones

```http
GET /users/applications
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
[
  {
    "id": "uuid",
    "coverLetter": "Me interesa mucho esta posición...",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:00:00Z",
    "jobOffer": {
      "id": "uuid",
      "title": "Desarrollador Full Stack",
      "location": "Buenos Aires",
      "company": {
        "companyName": "TechCorp",
        "companyLogo": "/uploads/logos/logo.png"
      }
    }
  }
]
```

### Eliminar Cuenta

```http
DELETE /users/account
Authorization: Bearer <token>
```

---

## 🏢 Empresa

> Todas las rutas requieren autenticación como empresa

### Obtener Mi Perfil

```http
GET /companies/profile
Authorization: Bearer <token>
```

### Actualizar Perfil

```http
PUT /companies/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "TechCorp SA",
  "description": "Empresa líder en tecnología",
  "website": "https://techcorp.com",
  "location": "Buenos Aires",
  "industry": "Tecnología",
  "size": "51-200"
}
```

### Subir Logo

```http
POST /companies/upload/logo
Authorization: Bearer <token>
Content-Type: multipart/form-data

companyLogo: <logo.png>
```

### Verificar Estado de Suscripción

```http
GET /companies/subscription/status
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "hasActiveSubscription": true,
  "subscription": {
    "id": "uuid",
    "plan": "MONTHLY",
    "status": "ACTIVE",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-02-01T00:00:00Z",
    "amount": 9999
  },
  "isBlocked": false
}
```

### Obtener Historial de Suscripciones

```http
GET /companies/subscription/history
Authorization: Bearer <token>
```

---

## 💼 Ofertas Laborales

### Buscar Ofertas (Público)

```http
GET /job-offers/search?location=Buenos Aires&categoryId=uuid&workMode=REMOTO&page=1&limit=20
```

**Parámetros de búsqueda:**
- `search` - Palabra clave
- `location` - Ubicación
- `categoryId` - ID de categoría
- `workType` - FULL_TIME, PART_TIME, CONTRACT, FREELANCE
- `workMode` - PRESENCIAL, REMOTO, HIBRIDO
- `experienceLevel` - ENTRY, JUNIOR, MID, SENIOR
- `languages` - Array de idiomas
- `page` - Número de página (default: 1)
- `limit` - Resultados por página (default: 20)

**Respuesta (200):**
```json
{
  "jobOffers": [
    {
      "id": "uuid",
      "title": "Desarrollador Full Stack",
      "description": "Buscamos desarrollador...",
      "location": "Buenos Aires",
      "workType": "FULL_TIME",
      "workMode": "HIBRIDO",
      "experienceLevel": "MID",
      "salaryMin": 100000,
      "salaryMax": 150000,
      "salaryPeriod": "monthly",
      "company": {
        "id": "uuid",
        "companyName": "TechCorp",
        "companyLogo": "/uploads/logos/logo.png",
        "location": "Buenos Aires"
      },
      "category": {
        "id": "uuid",
        "name": "Tecnología",
        "slug": "tecnologia"
      },
      "_count": {
        "applications": 15
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Obtener Oferta por ID (Público)

```http
GET /job-offers/:id
```

**Respuesta (200):**
```json
{
  "id": "uuid",
  "title": "Desarrollador Full Stack Senior",
  "description": "Descripción completa de la oferta...",
  "requirements": [
    "5+ años de experiencia",
    "React y Node.js",
    "PostgreSQL"
  ],
  "responsibilities": [
    "Desarrollar aplicaciones web",
    "Mentorear juniors"
  ],
  "location": "Buenos Aires, Argentina",
  "salaryMin": 150000,
  "salaryMax": 250000,
  "salaryPeriod": "monthly",
  "workType": "FULL_TIME",
  "workMode": "HIBRIDO",
  "experienceLevel": "SENIOR",
  "whatsappNumber": "+54 9 11 9876-5432",
  "contactEmail": "rrhh@techcorp.com",
  "languages": ["Español", "Inglés"],
  "isActive": true,
  "company": {
    "id": "uuid",
    "companyName": "TechCorp Argentina",
    "companyLogo": "/uploads/logos/logo.png",
    "description": "Empresa líder...",
    "website": "https://techcorp.com.ar",
    "industry": "Tecnología",
    "size": "51-200",
    "location": "Buenos Aires"
  },
  "category": {
    "id": "uuid",
    "name": "Tecnología",
    "slug": "tecnologia",
    "icon": "💻"
  },
  "_count": {
    "applications": 25
  },
  "createdAt": "2024-01-10T00:00:00Z"
}
```

### Crear Oferta (Empresa)

```http
POST /job-offers
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Desarrollador Full Stack",
  "description": "Buscamos un desarrollador con experiencia...",
  "requirements": [
    "3+ años de experiencia",
    "React y Node.js",
    "Base de datos"
  ],
  "responsibilities": [
    "Desarrollar features",
    "Code review",
    "Documentación"
  ],
  "location": "Buenos Aires",
  "salaryMin": 100000,
  "salaryMax": 150000,
  "salaryPeriod": "monthly",
  "workType": "FULL_TIME",
  "workMode": "HIBRIDO",
  "experienceLevel": "MID",
  "whatsappNumber": "+54 9 11 1234-5678",
  "contactEmail": "rrhh@empresa.com",
  "languages": ["Español", "Inglés"],
  "categoryId": "uuid",
  "expiresAt": "2024-03-01T00:00:00Z"
}
```

> ⚠️ Requiere suscripción activa

### Obtener Mis Ofertas (Empresa)

```http
GET /job-offers/company/my-offers
Authorization: Bearer <token>
```

### Actualizar Oferta (Empresa)

```http
PUT /job-offers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  // Mismos campos que crear
}
```

### Eliminar Oferta (Empresa)

```http
DELETE /job-offers/:id
Authorization: Bearer <token>
```

### Ver Postulantes de una Oferta (Empresa)

```http
GET /job-offers/:id/applicants
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "jobOffer": {
    "id": "uuid",
    "title": "Desarrollador Full Stack"
  },
  "applications": [
    {
      "id": "uuid",
      "coverLetter": "Me interesa mucho esta posición...",
      "status": "PENDING",
      "createdAt": "2024-01-15T10:00:00Z",
      "user": {
        "id": "uuid",
        "email": "usuario@example.com",
        "firstName": "Juan",
        "lastName": "Pérez",
        "phone": "+54 9 11 1234-5678",
        "profileImage": "/uploads/profiles/img.jpg",
        "title": "Desarrollador Full Stack",
        "bio": "Desarrollador con experiencia...",
        "skills": ["JavaScript", "React", "Node.js"],
        "cvUrl": "/uploads/cvs/cv.pdf",
        "location": "Buenos Aires",
        "linkedinUrl": "https://linkedin.com/in/juanperez",
        "experience": [...],
        "education": [...]
      }
    }
  ],
  "total": 25
}
```

### Actualizar Estado de Postulación (Empresa)

```http
PUT /job-offers/applications/:applicationId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "REVIEWING"
}
```

**Estados posibles:**
- `PENDING` - Pendiente
- `REVIEWING` - En revisión
- `SHORTLISTED` - Preseleccionado
- `INTERVIEWED` - Entrevistado
- `REJECTED` - Rechazado
- `ACCEPTED` - Aceptado

---

## 📝 Postulaciones

> Todas las rutas requieren autenticación como usuario

### Postularse a una Oferta

```http
POST /applications/:jobOfferId/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "Me interesa mucho esta posición porque..."
}
```

**Respuesta (201):**
```json
{
  "message": "Postulación enviada exitosamente",
  "application": {
    "id": "uuid",
    "coverLetter": "Me interesa mucho...",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:00:00Z",
    "jobOffer": {
      "id": "uuid",
      "title": "Desarrollador Full Stack",
      "company": {
        "companyName": "TechCorp"
      }
    }
  }
}
```

### Obtener Postulación por ID

```http
GET /applications/:id
Authorization: Bearer <token>
```

### Cancelar Postulación

```http
DELETE /applications/:id
Authorization: Bearer <token>
```

### Actualizar Carta de Presentación

```http
PUT /applications/:id/cover-letter
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "Nueva carta de presentación..."
}
```

---

## 💳 Suscripciones

### Obtener Planes Disponibles (Público)

```http
GET /subscriptions/plans
```

**Respuesta (200):**
```json
{
  "plans": [
    {
      "id": "MONTHLY",
      "name": "Plan Mensual",
      "price": 9999,
      "currency": "ARS",
      "duration": "1 mes",
      "features": [
        "Publicar ofertas ilimitadas",
        "Ver postulantes",
        "Contacto por WhatsApp",
        "Soporte por email"
      ]
    },
    {
      "id": "QUARTERLY",
      "name": "Plan Trimestral",
      "price": 24999,
      "currency": "ARS",
      "duration": "3 meses",
      "discount": "17% de descuento",
      "features": [...]
    },
    {
      "id": "ANNUAL",
      "name": "Plan Anual",
      "price": 89999,
      "currency": "ARS",
      "duration": "12 meses",
      "discount": "25% de descuento",
      "features": [...]
    }
  ]
}
```

### Crear Suscripción (Empresa)

```http
POST /subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "MONTHLY",
  "amount": 9999,
  "currency": "ARS",
  "paymentId": "mp-payment-id",
  "paymentStatus": "approved",
  "paymentMethod": "credit_card"
}
```

### Obtener Suscripción Activa (Empresa)

```http
GET /subscriptions/active
Authorization: Bearer <token>
```

### Obtener Historial de Suscripciones (Empresa)

```http
GET /subscriptions/history
Authorization: Bearer <token>
```

### Cancelar Suscripción (Empresa)

```http
PUT /subscriptions/:id/cancel
Authorization: Bearer <token>
```

### Webhook de Mercado Pago

```http
POST /subscriptions/webhook/mercadopago
Content-Type: application/json

{
  "type": "payment",
  "data": {
    "id": "payment-id"
  }
}
```

---

## 📂 Categorías

### Listar Todas las Categorías (Público)

```http
GET /categories
```

**Respuesta (200):**
```json
[
  {
    "id": "uuid",
    "name": "Tecnología",
    "slug": "tecnologia",
    "description": "Empleos en tecnología y desarrollo",
    "icon": "💻",
    "_count": {
      "jobOffers": 150
    }
  },
  ...
]
```

### Obtener Categoría por ID (Público)

```http
GET /categories/:id
```

### Crear Categoría (Admin)

```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Marketing Digital",
  "slug": "marketing-digital",
  "description": "Empleos en marketing digital",
  "icon": "📢"
}
```

### Actualizar Categoría (Admin)

```http
PUT /categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Marketing Digital",
  "description": "Nueva descripción"
}
```

### Eliminar Categoría (Admin)

```http
DELETE /categories/:id
Authorization: Bearer <token>
```

---

## 👨‍💼 Admin

> Todas las rutas requieren autenticación como admin

### Obtener Métricas del Dashboard

```http
GET /admin/dashboard/metrics
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "metrics": {
    "totalUsers": 5000,
    "totalCompanies": 500,
    "totalJobOffers": 1500,
    "totalApplications": 15000,
    "activeSubscriptions": 300
  },
  "recent": {
    "users": [...],
    "companies": [...],
    "jobOffers": [...]
  }
}
```

### Listar Usuarios

```http
GET /admin/users?page=1&limit=20&search=juan
Authorization: Bearer <token>
```

### Obtener Usuario por ID

```http
GET /admin/users/:id
Authorization: Bearer <token>
```

### Eliminar Usuario

```http
DELETE /admin/users/:id
Authorization: Bearer <token>
```

### Listar Empresas

```http
GET /admin/companies?page=1&limit=20&search=tech
Authorization: Bearer <token>
```

### Obtener Empresa por ID

```http
GET /admin/companies/:id
Authorization: Bearer <token>
```

### Bloquear/Desbloquear Empresa

```http
PUT /admin/companies/:id/block
Authorization: Bearer <token>
Content-Type: application/json

{
  "isBlocked": true
}
```

### Eliminar Empresa

```http
DELETE /admin/companies/:id
Authorization: Bearer <token>
```

### Listar Suscripciones

```http
GET /admin/subscriptions?status=ACTIVE&page=1&limit=20
Authorization: Bearer <token>
```

### Listar Ofertas Laborales

```http
GET /admin/job-offers?isActive=true&page=1&limit=20
Authorization: Bearer <token>
```

### Eliminar Oferta Laboral

```http
DELETE /admin/job-offers/:id
Authorization: Bearer <token>
```

### Crear Administrador

```http
POST /admin/admins
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "nuevo-admin@professionalsathome.com",
  "password": "password123",
  "firstName": "Admin",
  "lastName": "Nuevo",
  "role": "ADMIN"
}
```

**Roles disponibles:**
- `ADMIN` - Administrador estándar
- `SUPER_ADMIN` - Super administrador

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

**Formato de error:**
```json
{
  "error": "Mensaje de error descriptivo",
  "details": [
    {
      "field": "email",
      "message": "Email debe ser válido"
    }
  ]
}
```

---

## 📝 Notas

- Todos los timestamps están en formato ISO 8601
- Los IDs son UUIDs v4
- Las fechas se envían en formato ISO string
- Los archivos se envían con `multipart/form-data`
- Los tokens JWT expiran en 7 días (configurable)
- La paginación usa índice base 1

---

**Documentación generada: Marzo 2026**
