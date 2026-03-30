# 🚀 Guía Rápida de Inicio - Job Platform

Esta guía te ayudará a poner en marcha la plataforma en menos de 10 minutos.

## ⚡ Inicio Rápido

### Paso 1: Instalar PostgreSQL

**Windows:**
1. Descargar desde: https://www.postgresql.org/download/windows/
2. Instalar con usuario `postgres` y contraseña de tu elección
3. Anotar el puerto (por defecto: 5432)

**Verificar instalación:**
```bash
psql --version
```

### Paso 2: Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE job_platform;

# Salir
\q
```

### Paso 3: Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Copiar archivo de ejemplo
copy .env.example .env

# Editar .env con tu configuración
notepad .env
```

**Configuración mínima en .env:**
```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/job_platform?schema=public"
JWT_SECRET="mi_secreto_super_seguro_12345"
FRONTEND_URL="http://localhost:5173"
PORT=5000
```

```bash
# Ejecutar migraciones
npm run prisma:migrate

# Poblar con datos de ejemplo
npm run prisma:seed

# Iniciar servidor
npm run dev
```

✅ Backend ejecutándose en: http://localhost:5000

### Paso 4: Configurar Frontend

**Nueva terminal:**
```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Copiar archivo de ejemplo
copy .env.example .env

# Editar .env
notepad .env
```

**Configuración en .env:**
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Iniciar servidor de desarrollo
npm run dev
```

✅ Frontend ejecutándose en: http://localhost:5173

## 🎉 ¡Listo! Ahora puedes:

1. Abrir http://localhost:5173
2. Hacer clic en "Iniciar Sesión"
3. Usar una de las cuentas de prueba:

### Cuentas de Prueba

**Administrador:**
- Email: `admin@professionalsathome.com`
- Contraseña: `admin123`

**Usuario (Candidato):**
- Email: `juan.perez@example.com`
- Contraseña: `user123`

**Empresa:**
- Email: `rrhh@techcorp.com`
- Contraseña: `company123`

## 📝 Comandos Útiles

### Backend

```bash
# Desarrollo con hot-reload
npm run dev

# Ver base de datos en navegador
npm run prisma:studio

# Crear migración
npm run prisma:migrate

# Regenerar cliente Prisma
npm run prisma:generate
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## 🔧 Solución de Problemas

### Error: "Cannot connect to database"

1. Verificar que PostgreSQL está ejecutándose
2. Verificar credenciales en `backend/.env`
3. Verificar que la base de datos existe:
   ```bash
   psql -U postgres -l
   ```

### Error: "Port 5000 already in use"

Cambiar el puerto en `backend/.env`:
```env
PORT=5001
```

Y actualizar en `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### Error: "Module not found"

```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error de Prisma

```bash
# Regenerar cliente
cd backend
npm run prisma:generate

# Si persiste, resetear base de datos
npm run prisma:migrate reset
npm run prisma:seed
```

## 📚 Próximos Pasos

Una vez que tengas el proyecto funcionando:

1. **Explorar el código**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`

2. **Leer la documentación**
   - [README principal](README.md)
   - [README backend](backend/README.md)
   - [README frontend](frontend/README.md)

3. **Probar funcionalidades**
   - Crear una oferta laboral (como empresa)
   - Postularse a una oferta (como usuario)
   - Ver el panel de admin

4. **Personalizar**
   - Cambiar colores en `frontend/tailwind.config.js`
   - Agregar nuevas categorías
   - Personalizar emails y mensajes

## 🆘 ¿Necesitas Ayuda?

- 📖 Lee la documentación completa en [README.md](README.md)
- 🐛 Reporta bugs en GitHub Issues
- 💬 Únete a nuestro Discord (próximamente)

## ✅ Checklist de Verificación

- [ ] PostgreSQL instalado y ejecutándose
- [ ] Base de datos `job_platform` creada
- [ ] Backend ejecutándose en puerto 5000
- [ ] Frontend ejecutándose en puerto 5173
- [ ] Puedes iniciar sesión con las cuentas de prueba
- [ ] Prisma Studio funciona (`npm run prisma:studio`)

---

**¡Feliz desarrollo! 🚀**
