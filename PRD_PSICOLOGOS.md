# Documento de Alcance — Sección Psicólogos
### Professionals at Home · professionalsathome.com
**Versión:** 1.0 · **Fecha:** 7 de mayo de 2026  
**Para aprobación del cliente antes de iniciar el desarrollo**

---

## ¿De qué se trata esto?

La plataforma **Professionals at Home** ya conecta a profesionales del hogar (empleadas, niñeras, cuidadores, etc.) con personas que los buscan. El cliente quiere agregar una **nueva sección de Psicólogos en línea**, donde los pacientes puedan encontrar y contactar psicólogos que atienden de forma remota (videollamada, WhatsApp, etc.).

Este documento describe en lenguaje simple **qué se va a construir, cómo funciona y qué necesita el cliente aprobar antes de que empiece el trabajo**.

---

## ¿Cómo entra el usuario a la sección?

Desde la página principal del sitio va a aparecer un nuevo botón o acceso directo que dice **"Psicólogos en línea"**. Al hacer clic, el usuario llega a un listado de psicólogos disponibles donde puede buscar por **idioma** y por **país**.

---

## Hay dos tipos de personas que usan esto

### 1. El paciente (quien busca al psicólogo)
- Entra al sitio, puede ser nuevo o ya tener cuenta.
- Ve el listado de psicólogos.
- Puede filtrar por idioma y país.
- Ve el perfil del psicólogo: foto, nombre o apodo, edad, país, especialidad, idiomas y cómo contactarlo (WhatsApp o email).
- Elige cómo contactar al psicólogo y lo hace desde el sitio.

### 2. El psicólogo (el profesional que se registra)
- Se registra en el sitio completando un formulario.
- Existen **dos tipos de registro**: uno para psicólogos **en Argentina** y otro para psicólogos **fuera de Argentina**.
- Sube sus documentos para que la plataforma verifique que es un profesional real.
- Una vez aprobado, aparece en el listado y empieza a recibir contactos de pacientes.
- Para poder estar activo en la plataforma **debe contratar un plan de pago**.

---

## ¿Qué hace el psicólogo cuando ya tiene cuenta?

Cuando entra al sistema con su usuario y contraseña, va directo a un panel donde ve las **solicitudes de los pacientes**. Ahí puede ver:
- El nombre del paciente.
- Una nota o mensaje del paciente.
- Un botón para contactarlo por WhatsApp.

---

## Registro de psicólogos — ¿qué datos se piden?

### Registro en Argentina

**Datos personales:**
- Nombre completo y apellido
- Número de DNI
- CUIT/CUIL
- Fecha de nacimiento *(debe ser mayor de 21 años con título universitario)*
- Correo electrónico
- WhatsApp
- Domicilio legal (calle, número, piso, localidad, provincia, código postal)
- Provincia donde ejerce

**Datos profesionales:**
- Título universitario: "Psicólogo" o "Lic. en Psicología" *(controlado por lista)*
- Año de graduación
- Universidad donde obtuvo el título *(nombre oficial)*
- Número de matrícula profesional *(según provincia, ej: MP 12345, M.N. 1234, etc.)*
- Provincia de emisión de la matrícula
- Número de registro en el Ministerio de Salud *(opcional, solo si aplica en esa provincia)*

**Especialidades disponibles** *(puede marcar una o más)*:
- Psicología clínica y de la salud
- Psicología (diversos enfoques)
- Terapia de pareja y familiar
- Psicología del desarrollo y edades
- Psicología educativa
- Psicología laboral/organizacional
- Psicología social y comunitaria
- Psicología perinatal y abordaje de ansiedad/depresión en embarazo o posparto

**Rango etario de atención:**
- Adultos (mayor a 18 años)
- Infanto-juvenil (hasta los 18 años)

**Otros campos:**
- Años de experiencia
- Idiomas hablados
- Modalidad remota (telepsicología / telemedicina)
- Breve descripción de experiencia y estudios

---

### Registro Internacional (fuera de Argentina)

Los campos son similares pero adaptados al país de origen:
- Número de documento de identidad, pasaporte o cédula
- Número de identificación fiscal según el país
- Domicilio legal con país y provincia/región
- Número de licencia/colegiación/matrícula
- Entidad que expide la licencia
- País, estado o región de la licencia
- Institución que otorgó el título

> **Nota importante del cliente (que aparece en el diagrama):**  
> *"La atención remota no es recomendada para crisis aguda con riesgo de vida o psicosis activa que requiera contención física inmediata, las cuales necesitan atención presencial de emergencia."*  
> Este aviso de precaución debe mostrarse en la pantalla de registro internacional.

---

## Documentos que el psicólogo debe subir

### Psicólogo en Argentina:
| Documento | Formato | Tamaño máx. |
|---|---|---|
| Foto/escaneo del DNI (frente y dorso) | PDF, JPG o PNG | 5 MB |
| Título de psicólogo (frente y dorso) | PDF, JPG o PNG | 5 MB |
| Certificado de matrícula profesional vigente | PDF, JPG o PNG | 5 MB |
| Constancia de CUIT/CUIL | PDF o captura | 2 MB |
| Certificado de buena conducta *(si lo exige la provincia)* | PDF | 2 MB |
| Certificado por cada especialidad declarada | PDF, JPG o PNG | — |

### Psicólogo Internacional:
| Documento | Formato | Tamaño máx. |
|---|---|---|
| Documento de identidad / pasaporte / cédula (frente y dorso) | PDF, JPG o PNG | 5 MB |
| Título profesional o diploma (frente y dorso) | PDF, JPG o PNG | 5 MB |
| Certificado de licencia / colegiación vigente | PDF, JPG o PNG | 5 MB |
| Comprobante de identificación fiscal *(si aplica)* | PDF o captura | 2 MB |
| Certificado de antecedentes penales o de buena conducta | PDF | 2 MB |
| Certificado por cada especialidad declarada | PDF, JPG o PNG | — |

---

## ¿Cómo se verifica al psicólogo? (solo Argentina)

1. El psicólogo envía su registro y documentos.
2. La plataforma revisa todo en **aproximadamente 5 días hábiles**.
3. Durante ese tiempo, el perfil queda en estado **"pendiente de verificación"** y no aparece en el listado.
4. Una vez aprobado, se le envía un **email de confirmación**.
5. Con ese email confirmado, el psicólogo entra al sitio y **elige un plan de pago** para activarse.

---

## Términos que el psicólogo acepta al registrarse

El formulario incluye las siguientes confirmaciones obligatorias:
- Declaración jurada de que toda la información es verdadera.
- Aceptación del Contrato de Prestación de Servicios de Suscripción.
- Autorización para verificar datos ante colegios profesionales.
- Aceptación de la Política de Privacidad según la Ley 25.326.

---

## ¿Qué ve el paciente al buscar un psicólogo?

El listado muestra tarjetas con:
- Foto del psicólogo
- Nombre o apodo
- Edad
- País
- Especialidad
- Idiomas
- Forma de contacto: **WhatsApp** (con número) y/o **email**

---

## Pantallas que se van a crear

| Pantalla | Descripción |
|---|---|
| Acceso desde inicio | Botón / sección en la home que lleva a "Psicólogos en línea" |
| Listado de psicólogos | Búsqueda por idioma y país, tarjetas de profesionales |
| Perfil del psicólogo | Detalle completo del profesional y botón de contacto |
| Registro — elección de tipo | Pantalla para elegir entre registro nacional e internacional |
| Formulario registro Argentina | Datos personales, profesionales, especialidades y documentos |
| Formulario registro Internacional | Mismo flujo adaptado a profesionales del exterior |
| Carga de documentos | Pantalla para subir archivos en ambos registros |
| Confirmación de envío | Mensaje de que el registro fue recibido y está en verificación |
| Pago del plan | Pantalla para elegir y pagar el plan de suscripción |
| Panel del psicólogo | Vista de solicitudes de pacientes con datos y contacto por WhatsApp |

---

## Lo que NO está incluido en este alcance

Para evitar confusiones, esto **no se desarrolla en esta etapa**:

- Videollamadas integradas dentro del sitio (el contacto es por WhatsApp o email externo).
- Sistema de pagos entre paciente y psicólogo (solo el pago de suscripción del psicólogo a la plataforma).
- Chat interno dentro del sitio.
- Historial clínico ni gestión de turnos.
- Verificación de psicólogos internacionales (la verificación automatizada aplica solo a Argentina).

---

## Resumen para aprobación

| Ítem | Detalle |
|---|---|
| ¿Qué se construye? | Sección nueva de psicólogos en línea dentro del sitio existente |
| ¿Para quién? | Psicólogos (Argentina e internacional) y pacientes que los buscan |
| ¿Cómo se contactan? | WhatsApp y/o email, desde el perfil del psicólogo |
| ¿Hay verificación? | Sí, para Argentina (~5 días hábiles) |
| ¿Requiere pago? | Sí, el psicólogo debe tomar un plan para aparecer en el listado |
| ¿Cuántas pantallas nuevas? | ~10 pantallas / vistas |

---

**Por favor confirmar aprobación de este documento para comenzar el desarrollo.**

*Prepared by: Equipo de desarrollo · Mayo 2026*
