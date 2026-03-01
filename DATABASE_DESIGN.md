# 🗄️ Diseño de Base de Datos - Job Platform

## Diagrama Entidad-Relación (ERD)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          JOB PLATFORM DATABASE                          │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐            ┌──────────────────┐
│      User        │            │     Company      │
├──────────────────┤            ├──────────────────┤
│ id (PK)          │            │ id (PK)          │
│ email (UNIQUE)   │            │ email (UNIQUE)   │
│ password         │            │ password         │
│ firstName        │            │ companyName      │
│ lastName         │            │ companyLogo      │
│ phone            │            │ description      │
│ profileImage     │            │ website          │
│ googleId (UNIQUE)│            │ googleId (UNIQUE)│
│ title            │            │ location         │
│ bio              │            │ industry         │
│ experience (JSON)│            │ size             │
│ education (JSON) │            │ isActive         │
│ skills []        │            │ isBlocked        │
│ cvUrl            │            │ createdAt        │
│ location         │            │ updatedAt        │
│ linkedinUrl      │            └──────────────────┘
│ portfolioUrl     │                     │
│ createdAt        │                     │ 1
│ updatedAt        │                     │
└──────────────────┘                     │
         │                               │
         │ 1                             │
         │                               │
         │                               │ *
         │                         ┌──────────────────┐
         │                         │   Subscription   │
         │                         ├──────────────────┤
         │                         │ id (PK)          │
         │                         │ companyId (FK)   │
         │                         │ plan             │
         │                         │ status           │
         │                         │ startDate        │
         │                         │ endDate          │
         │                         │ amount           │
         │                         │ currency         │
         │                         │ paymentId (UNIQUE)│
         │                         │ paymentStatus    │
         │                         │ paymentMethod    │
         │                         │ createdAt        │
         │                         │ updatedAt        │
         │                         └──────────────────┘
         │
         │ *
         │
    ┌──────────────────┐
    │   Application    │
    ├──────────────────┤
    │ id (PK)          │
    │ userId (FK)      │◄────────────┐
    │ jobOfferId (FK)  │◄──────┐     │
    │ coverLetter      │       │     │
    │ status           │       │     │
    │ createdAt        │       │     │
    │ updatedAt        │       │     │
    └──────────────────┘       │     │
         │                     │     │
         │                     │     │
         └─────────────────────┘     │
                 UNIQUE               │
                                      │
                                      │ *
                                      │
                               ┌──────────────────┐
                               │    JobOffer      │
                               ├──────────────────┤
                               │ id (PK)          │
                               │ companyId (FK)   │─────────┐
                               │ categoryId (FK)  │         │
                               │ title            │         │
                               │ description      │         │
                               │ requirements []  │         │
                               │ responsibilities[]│        │
                               │ location         │         │
                               │ salaryMin        │         │
                               │ salaryMax        │         │
                               │ salaryPeriod     │         │
                               │ workType         │         │
                               │ workMode         │         │
                               │ experienceLevel  │         │
                               │ whatsappNumber   │         │
                               │ contactEmail     │         │
                               │ languages []     │         │
                               │ isActive         │         │
                               │ expiresAt        │         │
                               │ createdAt        │         │
                               │ updatedAt        │         │
                               └──────────────────┘         │
                                        │                   │
                                        │ *                 │
                                        │                   │
                                        │                   │ 1
                                        │              ┌────┘
                                        │              │
                                    ┌──────────────────┐
                                    │    Category      │
                                    ├──────────────────┤
                                    │ id (PK)          │
                                    │ name (UNIQUE)    │
                                    │ slug (UNIQUE)    │
                                    │ description      │
                                    │ icon             │
                                    │ createdAt        │
                                    │ updatedAt        │
                                    └──────────────────┘

┌──────────────────┐
│      Admin       │
├──────────────────┤
│ id (PK)          │
│ email (UNIQUE)   │
│ password         │
│ firstName        │
│ lastName         │
│ role             │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
```

---

## 📋 Tablas Detalladas

### **users** - Usuarios/Candidatos

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| email | String | UNIQUE, NOT NULL | Email del usuario |
| password | String | NULLABLE | Password hasheado (null si OAuth) |
| googleId | String | UNIQUE, NULLABLE | ID de Google OAuth |
| firstName | String | NOT NULL | Nombre |
| lastName | String | NOT NULL | Apellido |
| phone | String | NULLABLE | Teléfono |
| profileImage | String | NULLABLE | URL de foto de perfil |
| title | String | NULLABLE | Título profesional |
| bio | Text | NULLABLE | Biografía |
| experience | JSON | NULLABLE | Array de experiencias |
| education | JSON | NULLABLE | Array de formaciones |
| skills | String[] | DEFAULT [] | Array de habilidades |
| cvUrl | String | NULLABLE | URL del CV |
| location | String | NULLABLE | Ubicación |
| linkedinUrl | String | NULLABLE | LinkedIn |
| portfolioUrl | String | NULLABLE | Portfolio |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| updatedAt | DateTime | AUTO | Última actualización |

**Relaciones:**
- tiene muchas `applications` (1:N)

---

### **companies** - Empresas

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| email | String | UNIQUE, NOT NULL | Email de la empresa |
| password | String | NULLABLE | Password hasheado |
| googleId | String | UNIQUE, NULLABLE | ID de Google OAuth |
| companyName | String | NOT NULL | Nombre de la empresa |
| companyLogo | String | NULLABLE | URL del logo |
| description | Text | NULLABLE | Descripción |
| website | String | NULLABLE | Sitio web |
| location | String | NULLABLE | Ubicación |
| industry | String | NULLABLE | Industria |
| size | String | NULLABLE | Tamaño (1-10, 11-50, etc) |
| isActive | Boolean | DEFAULT true | Cuenta activa |
| isBlocked | Boolean | DEFAULT false | Bloqueada por falta de pago |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| updatedAt | DateTime | AUTO | Última actualización |

**Relaciones:**
- tiene muchas `jobOffers` (1:N)
- tiene muchas `subscriptions` (1:N)

---

### **admins** - Administradores

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| email | String | UNIQUE, NOT NULL | Email del admin |
| password | String | NOT NULL | Password hasheado |
| firstName | String | NOT NULL | Nombre |
| lastName | String | NOT NULL | Apellido |
| role | Enum | DEFAULT ADMIN | ADMIN o SUPER_ADMIN |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| updatedAt | DateTime | AUTO | Última actualización |

---

### **categories** - Categorías de Trabajo

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| name | String | UNIQUE, NOT NULL | Nombre de la categoría |
| slug | String | UNIQUE, NOT NULL | URL-friendly name |
| description | String | NULLABLE | Descripción |
| icon | String | NULLABLE | Emoji o ícono |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| updatedAt | DateTime | AUTO | Última actualización |

**Relaciones:**
- tiene muchas `jobOffers` (1:N)

---

### **job_offers** - Ofertas Laborales

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| companyId | UUID | FK, NOT NULL | ID de la empresa |
| categoryId | UUID | FK, NOT NULL | ID de la categoría |
| title | String | NOT NULL | Título del puesto |
| description | Text | NOT NULL | Descripción completa |
| requirements | String[] | DEFAULT [] | Requisitos |
| responsibilities | String[] | DEFAULT [] | Responsabilidades |
| location | String | NOT NULL | Ubicación |
| salaryMin | Decimal(10,2) | NULLABLE | Salario mínimo |
| salaryMax | Decimal(10,2) | NULLABLE | Salario máximo |
| salaryPeriod | String | NULLABLE | monthly/annual/hourly |
| workType | Enum | DEFAULT FULL_TIME | Tipo de trabajo |
| workMode | Enum | DEFAULT PRESENCIAL | Modalidad |
| experienceLevel | Enum | DEFAULT MID | Nivel de experiencia |
| whatsappNumber | String | NULLABLE | WhatsApp de contacto |
| contactEmail | String | NULLABLE | Email de contacto |
| languages | String[] | DEFAULT [] | Idiomas requeridos |
| isActive | Boolean | DEFAULT true | Oferta activa |
| expiresAt | DateTime | NULLABLE | Fecha de expiración |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| updatedAt | DateTime | AUTO | Última actualización |

**Enums:**
- `WorkType`: FULL_TIME, PART_TIME, CONTRACT, FREELANCE, INTERNSHIP
- `WorkMode`: PRESENCIAL, REMOTO, HIBRIDO
- `ExperienceLevel`: ENTRY, JUNIOR, MID, SENIOR, LEAD

**Relaciones:**
- pertenece a `company` (N:1)
- pertenece a `category` (N:1)
- tiene muchas `applications` (1:N)

**Índices:**
- `companyId`
- `categoryId`
- `isActive`

---

### **applications** - Postulaciones

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| userId | UUID | FK, NOT NULL | ID del usuario |
| jobOfferId | UUID | FK, NOT NULL | ID de la oferta |
| coverLetter | Text | NULLABLE | Carta de presentación |
| status | Enum | DEFAULT PENDING | Estado de la postulación |
| createdAt | DateTime | DEFAULT now() | Fecha de postulación |
| updatedAt | DateTime | AUTO | Última actualización |

**Enums:**
- `ApplicationStatus`: PENDING, REVIEWING, SHORTLISTED, INTERVIEWED, REJECTED, ACCEPTED

**Relaciones:**
- pertenece a `user` (N:1)
- pertenece a `jobOffer` (N:1)

**Constraints:**
- UNIQUE(userId, jobOfferId) - Un usuario solo puede postular una vez a cada oferta

**Índices:**
- `userId`
- `jobOfferId`

---

### **subscriptions** - Suscripciones

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| companyId | UUID | FK, NOT NULL | ID de la empresa |
| plan | Enum | DEFAULT MONTHLY | Plan contratado |
| status | Enum | DEFAULT ACTIVE | Estado de suscripción |
| startDate | DateTime | NOT NULL | Fecha de inicio |
| endDate | DateTime | NOT NULL | Fecha de fin |
| amount | Decimal(10,2) | NOT NULL | Monto pagado |
| currency | String | DEFAULT "ARS" | Moneda |
| paymentId | String | UNIQUE, NULLABLE | ID del pago en MP |
| paymentStatus | String | NULLABLE | Estado del pago |
| paymentMethod | String | NULLABLE | Método de pago |
| createdAt | DateTime | DEFAULT now() | Fecha de creación |
| updatedAt | DateTime | AUTO | Última actualización |

**Enums:**
- `SubscriptionPlan`: MONTHLY, QUARTERLY, ANNUAL
- `SubscriptionStatus`: ACTIVE, EXPIRED, CANCELLED, PENDING

**Relaciones:**
- pertenece a `company` (N:1)

**Índices:**
- `companyId`
- `status`

---

## 🔗 Tipos de Relaciones

```
User (1) ──< (N) Application (N) >── (1) JobOffer (N) >── (1) Company
                                           │
                                           │ (N)
                                           │
                                           ▼ (1)
                                        Category

Company (1) ──< (N) JobOffer

Company (1) ──< (N) Subscription
```

---

## 🔑 Índices y Optimizaciones

### Índices Creados:
1. `job_offers`: companyId, categoryId, isActive
2. `applications`: userId, jobOfferId
3. `subscriptions`: companyId, status

### Constraints UNIQUE:
1. `users.email`, `users.googleId`
2. `companies.email`, `companies.googleId`
3. `admins.email`
4. `categories.name`, `categories.slug`
5. `applications(userId, jobOfferId)` - Constraint compuesto
6. `subscriptions.paymentId`

---

## 📊 Consultas Comunes Optimizadas

### 1. Buscar Ofertas con Filtros
```sql
SELECT jo.*, c.companyName, cat.name as categoryName,
       COUNT(a.id) as applicationsCount
FROM job_offers jo
JOIN companies c ON jo.companyId = c.id
JOIN categories cat ON jo.categoryId = cat.id
LEFT JOIN applications a ON jo.id = a.jobOfferId
WHERE jo.isActive = true
  AND jo.location ILIKE '%Buenos Aires%'
  AND jo.workMode = 'REMOTO'
GROUP BY jo.id, c.id, cat.id
ORDER BY jo.createdAt DESC
LIMIT 20;
```

### 2. Obtener Postulantes de una Oferta
```sql
SELECT a.*, u.*
FROM applications a
JOIN users u ON a.userId = u.id
WHERE a.jobOfferId = 'uuid'
ORDER BY a.createdAt DESC;
```

### 3. Verificar Suscripción Activa
```sql
SELECT *
FROM subscriptions
WHERE companyId = 'uuid'
  AND status = 'ACTIVE'
  AND endDate >= NOW()
ORDER BY endDate DESC
LIMIT 1;
```

---

## 🔐 Estrategia de Seguridad

### Passwords
- Hash con bcrypt (salt rounds: 10)
- Nunca retornados en queries

### Cascade Deletes
```prisma
company.delete() → cascades to:
  - jobOffers
  - subscriptions

jobOffer.delete() → cascades to:
  - applications

user.delete() → cascades to:
  - applications
```

---

## 📈 Escalabilidad

### Consideraciones:
1. **Particionamiento**: `job_offers` por fecha si crece mucho
2. **Archivado**: Mover ofertas vencidas a tabla histórica
3. **Caché**: Redis para búsquedas frecuentes
4. **Full-Text Search**: PostgreSQL trgm para búsqueda de texto
5. **Read Replicas**: Para consultas de lectura

---

## 🔄 Migraciones

Para aplicar el esquema:

```bash
cd backend
npm run prisma:migrate
```

Para resetear la base de datos:

```bash
npm run prisma:migrate reset
```

Para poblar con datos de ejemplo:

```bash
npm run prisma:seed
```

---

**Última actualización: Marzo 2026**
