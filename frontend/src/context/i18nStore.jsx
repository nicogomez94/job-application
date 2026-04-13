import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'site-language';

const ES_TO_EN = {
  'Buscar empleo...': 'Search jobs...',
  'Ver Ofertas': 'View Jobs',
  'Registrarse': 'Sign up',
  Ingresar: 'Log in',
  'Publicar Empleo': 'Post a Job',
  'Usuario': 'User',
  'Salir': 'Log out',
  'Candidatos': 'Candidates',
  Empresas: 'Companies',
  Contacto: 'Contact',
  'Profesionales': 'Professionals',
  'Buscar Empleos': 'Search Jobs',
  'Crear Cuenta': 'Create Account',
  'MI perfil de trabajo': 'My Work Profile',
  'Sugerencias para Profesionales y Empresas': 'Tips for Professionals and Companies',
  'Registrar Empresa': 'Register Company',
  'Planes y Precios': 'Plans and Pricing',
  'Publicar Oferta': 'Post Job',
  'Publicar Ofertas Laborales': 'Post Job Offers',
  'Conectamos talento con oportunidades.': 'We connect talent with opportunities.',
  'T\u00e9rminos y Condiciones': 'Terms and Conditions',
  'Pol\u00edticas y Privacidad': 'Privacy Policy',
  'Qui\u00e9nes Somos': 'About Us',
  'Pr\u00f3ximamente': 'Coming soon',
  'Hecho por': 'Made by',
  'Todos los derechos reservados.': 'All rights reserved.',
  'Conectamos talento con oportunidades. La plataforma líder en búsqueda de empleo.':
    'We connect talent with opportunities. The leading job search platform.',
  'No se pudo cargar el panel': 'Could not load panel',
  'Cargando panel...': 'Loading panel...',
  'Panel de Candidato': 'Candidate Panel',
  'Postulaciones Totales': 'Total Applications',
  'Estado Pendiente/Revisión': 'Pending/Review Status',
  'Acciones rápidas': 'Quick Actions',
  'Buscar ofertas': 'Search jobs',
  'Ver mis postulaciones': 'View my applications',
  'Editar perfil': 'Edit profile',
  'No se pudo cargar tu perfil': 'Could not load your profile',
  'Perfil actualizado': 'Profile updated',
  'No se pudo actualizar el perfil': 'Could not update profile',
  'Cargando perfil...': 'Loading profile...',
  Nombre: 'First Name',
  'Apellido': 'Last Name',
  'Teléfono': 'Phone',
  'Ubicación': 'Location',
  'Título profesional': 'Professional title',
  'Resumen profesional': 'Professional summary',
  'Skills separadas por coma (ej: React, Node.js, SQL)': 'Skills separated by commas (e.g., React, Node.js, SQL)',
  'Idiomas': 'Languages',
  'Idiomas separados por coma (ej: Español, Inglés, Portugués)': 'Languages separated by commas (e.g., Spanish, English, Portuguese)',
  'LinkedIn URL': 'LinkedIn URL',
  'Portfolio URL': 'Portfolio URL',
  'Guardando...': 'Saving...',
  'Guardar cambios': 'Save changes',
  'Pendiente': 'Pending',
  'En revisión': 'In review',
  'Preseleccionado': 'Shortlisted',
  'Entrevistado': 'Interviewed',
  Rechazado: 'Rejected',
  Aceptado: 'Accepted',
  'No se pudieron cargar tus postulaciones': 'Could not load your applications',
  'Cargando postulaciones...': 'Loading applications...',
  'Mis Postulaciones': 'My Applications',
  'Todavía no realizaste postulaciones.': "You haven't applied yet.",
  Oferta: 'Job',
  Empresa: 'Company',
  'Postulado el ': 'Applied on ',
  'Ver oferta': 'View job',
  'No se pudo cargar el panel de empresa': 'Could not load company panel',
  'Panel de Empresa': 'Company Panel',
  '(Cuenta bloqueada)': '(Blocked account)',
  'Ofertas activas': 'Active jobs',
  'Ofertas totales': 'Total jobs',
  'Postulaciones recibidas': 'Received applications',
  'Suscripción': 'Subscription',
  'Inactiva': 'Inactive',
  'Tu empresa está bloqueada por falta de suscripción activa.': 'Your company is blocked due to no active subscription.',
  'Activar suscripción': 'Activate subscription',
  'Crear oferta': 'Create job',
  'Gestionar ofertas': 'Manage jobs',
  'Suscripciones': 'Subscriptions',
  'No se pudieron cargar tus ofertas': 'Could not load your jobs',
  '¿Eliminar esta oferta laboral?': 'Delete this job posting?',
  'Oferta eliminada': 'Job deleted',
  'No se pudo eliminar la oferta': 'Could not delete job',
  'Cargando ofertas...': 'Loading jobs...',
  'Mis Ofertas Laborales': 'My Job Posts',
  'Nueva oferta': 'New job',
  'No tenés ofertas publicadas todavía.': "You don't have job posts yet.",
  'Crear primera oferta': 'Create first job',
  'Activa': 'Active',
  'Postulaciones: ': 'Applications: ',
  'Creada: ': 'Created: ',
  'Editar': 'Edit',
  'Ver postulantes': 'View applicants',
  'Eliminando...': 'Deleting...',
  'Eliminar': 'Delete',
  'No se pudieron cargar datos para crear la oferta': 'Could not load data to create job',
  'La fecha de vencimiento es inválida': 'Expiration date is invalid',
  'Oferta creada exitosamente': 'Job created successfully',
  'No se pudo crear la oferta': 'Could not create job',
  'Cargando formulario...': 'Loading form...',
  'No podés crear ofertas': "You can't create jobs",
  'Necesitás una suscripción activa para publicar empleos.': 'You need an active subscription to post jobs.',
  'Crear Oferta Laboral': 'Create Job Posting',
  'Título del puesto': 'Job title',
  'Descripción del puesto': 'Job description',
  'Seleccionar categoría': 'Select category',
  'Tiempo completo': 'Full time',
  'Medio tiempo': 'Part time',
  Contrato: 'Contract',
  Freelance: 'Freelance',
  'Pasantía': 'Internship',
  'Presencial': 'On-site',
  Remoto: 'Remote',
  'Híbrido': 'Hybrid',
  'Salario mínimo': 'Minimum salary',
  'Salario máximo': 'Maximum salary',
  Mensual: 'Monthly',
  Anual: 'Annual',
  'Por hora': 'Hourly',
  'Requisitos (uno por línea)': 'Requirements (one per line)',
  'Responsabilidades (una por línea)': 'Responsibilities (one per line)',
  'Idiomas requeridos (separados por coma)': 'Required languages (comma separated)',
  'Idioma del anuncio': 'Ad language',
  'Idioma del anuncio: ': 'Ad language: ',
  'Idioma: ': 'Language: ',
  'Idioma': 'Language',
  'WhatsApp de contacto': 'Contact WhatsApp',
  'Email de contacto': 'Contact email',
  'Publicar oferta': 'Publish job',
  Cancelar: 'Cancel',
  'No se pudo subir el CV': 'Could not upload resume',
  'No se pudo crear la cuenta': 'Could not create account',
  'No se pudo subir el logo': 'Could not upload logo',
  'No se pudo registrar la empresa': 'Could not register company',
  'Nombre de la empresa': 'Company name',
  'No se pudieron cargar las suscripciones': 'Could not load subscriptions',
  'No se pudo activar el plan': 'Could not activate plan',
  'No se pudo cancelar la suscripción': 'Could not cancel subscription',
  'Cargando suscripciones...': 'Loading subscriptions...',
  'No tenés suscripción activa.': "You don't have an active subscription.",
  'No se pudo cargar el perfil de empresa': 'Could not load company profile',
  'No se pudo cargar la oferta': 'Could not load job',
  'No se pudo actualizar la oferta': 'Could not update job',
  'Cargando oferta...': 'Loading job...',
  'No se pudieron cargar categorías': 'Could not load categories',
  'No se pudieron cargar ofertas': 'Could not load jobs',
  'No se pudo enviar la postulación': 'Could not submit application',
  'Buscar Empleo': 'Find Jobs',
  'ofertas encontradas': 'jobs found',
  'No hay resultados para los filtros seleccionados.': 'No results for selected filters.',
  'No se pudo cargar la lista de postulantes': 'Could not load applicants list',
  'No se pudo actualizar el estado': 'Could not update status',
  'Cargando postulantes...': 'Loading applicants...',
  'No se encontró la oferta.': 'Job not found.',
  'Cargando detalle...': 'Loading details...',
  'No se recibió token de autenticación': 'Authentication token was not received',
  'No se pudo completar el login con Google': 'Could not complete Google login',
  '404 - Página no encontrada': '404 - Page not found',
  'Inicio': 'Home',
  Blog: 'Blog',
  'Páginas': 'Pages',
  La: 'The',
  'Forma Más Fácil': 'Easiest Way',
  'de Conseguir Tu Nuevo Trabajo': 'to Get Your New Job',
  'Cada mes, más de 3 millones de personas buscan trabajo en nuestra plataforma, realizando más de 140.000 postulaciones cada día':
    'Every month, more than 3 million people search for jobs on our platform, submitting over 140,000 applications each day.',
  'Industria': 'Industry',
  'Profesiones': 'Professions',
  'Tecnología': 'Technology',
  'Marketing': 'Marketing',
  'Finanzas': 'Finance',
  Salud: 'Healthcare',
  'Córdoba': 'Cordoba',
  'Rosario': 'Rosario',
  'Palabras clave': 'Keywords',
  Buscar: 'Search',
  'Búsquedas Populares:': 'Popular Searches:',
  'Retail & Producto': 'Retail & Product',
  'Navegá por categoría': 'Browse by category',
  'Encontrá el trabajo perfecto para vos. más de 800 trabajos nuevos cada día':
    'Find the perfect job for you. Over 800 new jobs every day.',
  'Trabajos Disponibles': 'Available Jobs',
  '¿Cómo Funciona?': 'How does it work?',
  Busca: 'Search',
  'Explora miles de ofertas laborales de empresas verificadas': 'Explore thousands of job opportunities from verified companies.',
  Postula: 'Apply',
  'Envía tu CV y carta de presentación con un solo click':
    'Send your CV and cover letter with a single click.',
  Crece: 'Grow',
  'Consigue el trabajo ideal y desarrolla tu carrera profesional':
    'Get the ideal job and grow your professional career.',
  '¿Buscas trabajo?': 'Looking for a job?',
  'Crea tu perfil profesional, sube tu CV y empieza a postular a las mejores ofertas laborales.':
    'Create your professional profile, upload your resume, and start applying to the best job openings.',
  'Crear Cuenta de Candidato': 'Create Candidate Account',
  '¿Contratas talento?': 'Hiring talent?',
  'Publica ofertas laborales, gestiona postulantes y encuentra a los mejores profesionales para tu empresa.':
    'Post job openings, manage applicants, and find the best professionals for your company.',
  'Planes y precios en versiÒ³n resumida': 'Plans and pricing summary',
  '*Incluye 2 meses gratis en la inscripciÒ³n inicial': '*Includes 2 free months in the initial registration',
  '*Beneficios por calidad de servicios y referidos en planes pagos.': '*Benefits for service quality and referrals on paid plans.',
  'Ver planes y precios': 'View plans and pricing',
  'Solo por tiempo limitado': 'Limited-time offer',
  Recomendado: 'Recommended',
  'Mejor relaciÒ³n precio-tiempo': 'Best price-time ratio',
  'Continuidad extendida para publicar': 'Extended continuity for posting',
  'Incluye 1 mes sin costo': 'Includes 1 month at no extra cost',
  '/ 3 meses': '/ 3 months',
  '/ 7 meses': '/ 7 months',
  '/ 13 meses': '/ 13 months',
  'Plan 3 meses': '3-Month Plan',
  'Plan 7 meses': '7-Month Plan',
  'Plan 12 + 1': '12 + 1 Plan',
  '3 meses': '3 months',
  '7 meses': '7 months',
  '13 meses': '13 months',
  'Plan para empresas': 'Plan for companies',
  'Pagás 12 meses y usás 13': 'Pay 12 months and use 13',
  'Ingreso inicial para nuevas empresas': 'Initial access for new companies',
  'MÒ¡s tiempo para contratar sin interrupciones': 'More time to hire without interruptions',
  'PagÒ¡s 12 meses y usÒ¡s 13 meses': 'Pay 12 months and use 13 months',
  'PublicaciÒ³n y gestiÒ³n de postulantes': 'Posting and applicant management',
  'Ideal para validar el servicio': 'Ideal for validating the service',
  'RenovaciÒ³n paga al finalizar': 'Paid renewal at the end',
  'Mayor continuidad de publicaciones': 'Greater posting continuity',
  'Mejor costo por mes': 'Better monthly cost',
  '1 mes adicional sin costo incluido': '1 additional month included at no extra cost',
  'Cobertura anual extendida': 'Extended yearly coverage',
  'ElegÒ­ el plan que mejor se adapte al ritmo de contrataciÒ³n de tu empresa.': 'Choose the plan that best fits your company hiring pace.',
  'Condiciones comerciales': 'Commercial terms',
  'Condiciones comerciales solo por tiempo limitado.': 'Commercial terms for a limited time only.',
  'InscripciÒ³n inicial: 2 meses gratis en tu primera vez en la plataforma.': 'Initial registration: 2 free months on your first time on the platform.',
  'Periodo de renovaciÒ³n: todas las renovaciones son pagas en cualquiera de sus formas.': 'Renewal period: all renewals are paid under any modality.',
  'Reconocimiento a la calidad: el empleador mejor calificado al finalizar su perÒ­odo pago recibe 2 meses sin costo.': 'Quality recognition: the highest-rated employer receives 2 months at no cost after its paid period.',
  'Programa de referidos: por cada nueva empresa que se inscriba con plan pago, obtenÒ©s 2 meses gratis.': 'Referral program: for each new company that signs up with a paid plan, you get 2 free months.',
  'Empezar ahora': 'Start now',
  '¿Ya tenÒ©s cuenta de empresa?': 'Do you already have a company account?',
  'Iniciar sesiÒ³n': 'Log in',
  'Seleccione el plan que mejor se adapte a su empresa': 'Select the plan that best fits your company',
  'Ideal para empezar': 'Ideal to start',
  'La mejor relaciÒ³n precio-valor': 'Best price-value ratio',
  'Para empresas en crecimiento': 'For growing companies',
  'No se pudieron cargar los planes': 'Could not load plans',
  'Cargando planes...': 'Loading plans...',
  'Valor regular:': 'Regular price:',
  'Activando...': 'Activating...',
  'Seleccionar plan': 'Select plan',
  'No se requiere tarjeta de crÒ©dito durante el perÒ­odo de lanzamiento. PodÒ©s cambiar de plan en cualquier momento desde tu panel de empresa.':
    'No credit card is required during the launch period. You can change plan at any time from your company dashboard.',
  'PrÒ³ximamente: pagos seguros con Mercado Pago.': 'Coming soon: secure payments with Mercado Pago.',
  'No se requiere tarjeta de crédito durante el período de lanzamiento. Podés cambiar de plan en cualquier momento desde tu panel de empresa.':
    'No credit card is required during the launch period. You can change plan at any time from your company dashboard.',
  'Próximamente: pagos seguros con Mercado Pago.': 'Coming soon: secure payments with Mercado Pago.',
  'SuscripciÒ³n activada': 'Subscription activated',
  'SuscripciÒ³n cancelada': 'Subscription canceled',
  '¿Cancelar la suscripciÒ³n activa?': 'Cancel active subscription?',
  'Suscripción activada': 'Subscription activated',
  'Suscripción cancelada': 'Subscription canceled',
  '¿Cancelar la suscripción activa?': 'Cancel active subscription?',
  'POR TIEMPO LIMITADO': 'LIMITED TIME',
  'Tu empresa se registrÒ³ con un plan gratuito de 2 meses hasta el ': 'Your company was registered with a free 2-month plan until ',
  'Luego deberÒ¡s cambiar a un plan pago de la lista para continuar sin interrupciones.':
    'Then you must switch to a paid plan from the list to continue without interruptions.',
  'Tu empresa se registró con un plan gratuito de 2 meses hasta el ': 'Your company was registered with a free 2-month plan until ',
  'Luego deberás cambiar a un plan pago de la lista para continuar sin interrupciones.':
    'Then you must switch to a paid plan from the list to continue without interruptions.',
  'Elegir plan pago': 'Choose paid plan',
  'Estado actual': 'Current status',
  'Plan: ': 'Plan: ',
  'Vigencia: ': 'Validity: ',
  'Monto: ': 'Amount: ',
  'Cancelando...': 'Canceling...',
  'Cancelar suscripciÒ³n': 'Cancel subscription',
  'Cancelar suscripción': 'Cancel subscription',
  'Planes disponibles': 'Available plans',
  'Procesando...': 'Processing...',
  'Activar plan': 'Activate plan',
  'Historial': 'History',
  'Sin historial de suscripciones.': 'No subscription history.',
  'Prueba 2 meses': '2-Month Trial',
  'Moderador de Comunidades (Discord/Telegram)': 'Community Moderator (Discord/Telegram)',
  'Tutor/Profesor Online primaria, secundaria': 'Online Tutor/Teacher (Primary, Secondary)',
  'Tutor/Profesor Online universidad, terciario': 'Online Tutor/Teacher (University, College)',
  'Curador de Contenido para Redes Sociales': 'Social Media Content Curator',
  'Ingeniero de Prompts (Prompt Engineer) IA': 'AI Prompt Engineer',
  'Revisor de Contenido Escolar (Gaggle)': 'School Content Reviewer (Gaggle)',
  'Probador de Usabilidad (UserTesting)': 'Usability Tester (UserTesting)',
  'Especialista en Finanzas/Contabilidad': 'Finance/Accounting Specialist',
  'Etiquetador de Datos para IA': 'AI Data Labeler',
  'Transcriptor de Reuniones Online': 'Online Meeting Transcriber',
  'Dibujante Comic / Manga / etc.': 'Comic / Manga / etc. Illustrator',
  'BI, Especialista en Ciberseguridad': 'BI, Cybersecurity Specialist',
  'Experto/a en Cloud (AWS, Azure)': 'Cloud Expert (AWS, Azure)',
  'Especialista en Marketing Digital': 'Digital Marketing Specialist',
  'Especialista en Atención al Cliente': 'Customer Support Specialist',
  'Creador de Productos Digitales': 'Digital Product Creator',
  'Telemedicina': 'Telemedicine',
  'Consultor de Sostenibilidad': 'Sustainability Consultant',
  'Investigación de mercados': 'Market Research',
  'Diseñador Indumentaria': 'Fashion Designer',
  'Ingeniero/a de Software': 'Software Engineer',
  'Redactor/a de Contenidos': 'Content Writer',
  'Social Media Manager': 'Social Media Manager',
  'Profesores de Idiomas': 'Language Teachers',
  'Copywriter (con SEO)': 'Copywriter (with SEO)',
  'Ejecutivo/a de Ventas': 'Sales Executive',
  'Marketing digital': 'Digital Marketing',
  'Escritor / Guionista': 'Writer / Screenwriter',
  'Profesor Secundaria': 'Secondary School Teacher',
  'Diseñador Gráfico': 'Graphic Designer',
  'Profesor Primaria': 'Primary School Teacher',
  'Ingeniero/a de IA': 'AI Engineer',
  'Analista de Datos': 'Data Analyst',
  'Project Manager': 'Project Manager',
  'Product Manager': 'Product Manager',
  'Arquitecto': 'Architect',
  'Publicidad': 'Advertising',
  'Márquetin': 'Marketing',
  Traductor: 'Translator',
  Redactor: 'Copywriter',
  'Fotógrafo': 'Photographer',
  Abogado: 'Lawyer',
  'Casting': 'Casting',
  Otros: 'Other',
  'Gana más': 'Earn more',
  'Haciendo menos': 'Doing less',
  'Cada mes, más de 3 millones de personas buscan trabajo en línea, realizando más de 140.000 postulaciones':
    'Every month, more than 3 million people search for jobs online, making more than 140,000 applications.',
  'Categoría': 'Category',
  'Buscar Trabajo': 'Search Jobs',
  'Simplifica tu búsqueda de trabajo buscando por categorías': 'Simplify your job search by browsing categories',
  'Explora las ofertas laborales': 'Explore job offers',
  'Crear Cuenta de Profesional': 'Create Professional Account',
  'Ofertas Laborales': 'Job Offers',
  'Empresas Registradas': 'Registered Companies',
  'Candidatos Activos': 'Active Candidates',
  'Tasa de 0xito': 'Success Rate',
  'Iniciar Sesión': 'Log in',
  'Iniciando sesión...': 'Logging in...',
  'Accede a tu cuenta de professionals at home': 'Access your Professionals at Home account',
  'Recuperar tu clave': 'Recover your password',
  'O continúa con': 'Or continue with',
  'Continuar con Google': 'Continue with Google',
  '¿No tienes cuenta?': "Don't have an account?",
  'Regístrate aquí': 'Sign up here',
  'Ingresa un email valido': 'Enter a valid email',
  'No se pudo procesar la recuperacion de clave': 'Could not process password recovery',
  'Si el correo existe, te contactaremos para recuperar el acceso.':
    'If the email exists, we will contact you to recover access.',
  'Ingresá tu email y te enviaremos las instrucciones para restablecerla.':
    'Enter your email and we will send you instructions to reset it.',
  'Enviando...': 'Sending...',
  'Enviar recuperación': 'Send recovery',
  Cerrar: 'Close',
  'El email es requerido': 'Email is required',
  'Email inválido': 'Invalid email',
  'La contraseña es requerida': 'Password is required',
  'Error al iniciar sesión': 'Error logging in',
  '¡Bienvenido!': 'Welcome!',
  'Contraseña (mín. 6)': 'Password (min. 6)',
  'Registro de Profesional': 'Professional Registration',
  'Creá tu cuenta para postularte a ofertas laborales':
    'Create your account to apply to job offers',
  'Confirmar contraseña': 'Confirm password',
  'Teléfono (opcional)': 'Phone (optional)',
  'CV (PDF, JPG o Word. máximo 1 archivo)': 'CV (PDF, JPG or Word. max 1 file)',
  '1 archivo seleccionado': '1 selected file',
  'Archivos varios (PDF, JPG o Word. máximo 4 archivos)':
    'Additional files (PDF, JPG or Word. max 4 files)',
  'archivo seleccionado': 'selected file',
  'archivos seleccionados': 'selected files',
  Borrar: 'Delete',
  'Acepto los': 'I accept the',
  'Creando cuenta...': 'Creating account...',
  '¿Ya tenés cuenta?': 'Already have an account?',
  'Iniciá sesión': 'Log in',
  'El archivo debe pesar como máximo 5 MB': 'The file must be at most 5 MB',
  'Cada archivo debe pesar como máximo 5 MB': 'Each file must be at most 5 MB',
  'Podés subir hasta 4 archivos': 'You can upload up to 4 files',
  '¿Estás seguro de que querés borrar este archivo?':
    'Are you sure you want to delete this file?',
  'Debés aceptar los términos y condiciones y las políticas de privacidad para continuar':
    'You must accept the terms and conditions and privacy policies to continue',
  'Debés subir tu CV para crear la cuenta': 'You must upload your CV to create the account',
  'El CV debe pesar como máximo 5 MB': 'The CV must be at most 5 MB',
  'Las contraseñas no coinciden': 'Passwords do not match',
  'Archivo subido exitosamente': 'File uploaded successfully',
  'archivos subidos exitosamente': 'files uploaded successfully',
  'Cuenta creada exitosamente': 'Account created successfully',
  'No se pudieron subir los archivos': 'Could not upload files',
  'Solo se permiten archivos de imagen': 'Only image files are allowed',
  'Logo subido exitosamente': 'Logo uploaded successfully',
  'Empresa registrada. Se activó tu plan gratuito por 2 meses.':
    'Company registered. Your free 2-month plan is now active.',
  'Registro de Empresa': 'Company Registration',
  'Publicá ofertas y gestioná postulantes': 'Post jobs and manage applicants',
  'Email corporativo': 'Corporate email',
  'Sitio web': 'Website',
  'Sitio web (opcional)': 'Website (optional)',
  'Industria (ej: Tecnología)': 'Industry (e.g., Technology)',
  'Tamaño de empresa': 'Company size',
  'Descripción de la empresa (opcional)': 'Company description (optional)',
  'Logo (opcional)': 'Logo (optional)',
  'Registrando empresa...': 'Registering company...',

  'Ir al inicio': 'Go home',
  'Postulaciones totales': 'Total applications',
  'En proceso': 'In progress',
  'Aceptadas': 'Accepted',
  'Rechazadas': 'Rejected',
  'Postulaciones recientes': 'Recent applications',
  'Ver todas': 'View all',
  'A?n no te postulaste a ninguna oferta.': "You haven't applied to any job yet.",
  'Ver': 'View',
  'Mis postulaciones': 'My applications',
  'Buscar Profesi?n': 'Search Jobs',
  'Encontr? ofertas activas y postul? en pocos pasos.': 'Find active opportunities and apply in a few steps.',
  'Buscar Profesi?n, Empresa o Habilidad': 'Search profession, company, or skill',
  'Todas las categor?as': 'All categories',
  'Todos los idiomas': 'All languages',
  'Publicada: ': 'Posted: ',
  'Ver detalle': 'View details',
  'Anterior': 'Previous',
  'P?gina ': 'Page ',
  'Siguiente': 'Next',
  'Volver': 'Back',
  'Volver al panel': 'Back to dashboard',
  'Perfil de Empresa': 'Company Profile',
  'Logo de empresa': 'Company logo',
  'Logo de empresa (opcional)': 'Company logo (optional)',
  'Seleccion? un logo': 'Select a logo',
  'Subiendo...': 'Uploading...',
  'Subir logo': 'Upload logo',
  'Calificacion de la empresa': 'Company rating',
  'Todavia no tenes calificaciones': "You don't have ratings yet",
  'Inscripci?n inicial: 2 meses gratis en tu primera vez en la plataforma.':
    'Initial registration: 2 free months on your first time on the platform.',
  'Periodo de renovaci?n: todas las renovaciones son pagas en cualquiera de sus formas.':
    'Renewal period: all renewals are paid under any modality.',
  '?Ya ten?s cuenta de empresa?': 'Do you already have a company account?',
  'Tasa de ?xito': 'Success Rate',
};

const I18nContext = createContext({
  language: 'es',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (text) => text,
});

const normalizeLanguage = (language) => (language === 'en' ? 'en' : 'es');

const sortByLengthDesc = (values) => values.sort((a, b) => b.length - a.length);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const repairMojibake = (value) => {
  if (typeof value !== 'string') return value;

  let next = value;
  for (let i = 0; i < 3; i += 1) {
    if (!/[\u00C3\u00C2]/.test(next)) break;
    try {
      const repaired = decodeURIComponent(escape(next));
      if (!repaired || repaired === next) break;
      next = repaired;
    } catch {
      break;
    }
  }
  return next;
};

const isTranslationExcluded = (node) => {
  const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
  return Boolean(element?.closest?.('[translate="no"], .notranslate'));
};

const replaceByDictionary = (text, dictionary, sortedKeys) => {
  if (!text || typeof text !== 'string') return text;
  let next = text;
  for (const key of sortedKeys) {
    if (!next.includes(key)) continue;
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])(${escapeRegExp(key)})(?=$|[^\\p{L}\\p{N}])`, 'gu');
    next = next.replace(pattern, (_, prefix) => `${prefix}${dictionary[key]}`);
  }
  return next;
};

const skipParentTag = (node) => {
  const tag = node?.parentElement?.tagName;
  return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'CODE' || tag === 'PRE';
};

const applyTranslationOnNode = (node, dictionary, sortedKeys) => {
  if (!node || !dictionary) return;
  if (node.nodeType === Node.TEXT_NODE) {
    if (skipParentTag(node) || isTranslationExcluded(node) || !node.nodeValue?.trim()) return;
    const translated = replaceByDictionary(node.nodeValue, dictionary, sortedKeys);
    if (translated !== node.nodeValue) {
      node.nodeValue = translated;
    }
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE || isTranslationExcluded(node)) return;

  const textWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  let currentTextNode = textWalker.nextNode();
  while (currentTextNode) {
    if (!skipParentTag(currentTextNode) && !isTranslationExcluded(currentTextNode) && currentTextNode.nodeValue?.trim()) {
      const translated = replaceByDictionary(currentTextNode.nodeValue, dictionary, sortedKeys);
      if (translated !== currentTextNode.nodeValue) {
        currentTextNode.nodeValue = translated;
      }
    }
    currentTextNode = textWalker.nextNode();
  }

  const elements = node.querySelectorAll('[placeholder],[title],[aria-label],input[type="button"],input[type="submit"]');
  for (const element of elements) {
    if (isTranslationExcluded(element)) continue;
    const placeholder = element.getAttribute('placeholder');
    if (placeholder) {
      element.setAttribute('placeholder', replaceByDictionary(placeholder, dictionary, sortedKeys));
    }
    const title = element.getAttribute('title');
    if (title) {
      element.setAttribute('title', replaceByDictionary(title, dictionary, sortedKeys));
    }
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) {
      element.setAttribute('aria-label', replaceByDictionary(ariaLabel, dictionary, sortedKeys));
    }
    if (element.tagName === 'INPUT') {
      const type = element.getAttribute('type');
      if ((type === 'button' || type === 'submit') && element.value) {
        element.value = replaceByDictionary(element.value, dictionary, sortedKeys);
      }
    }
  }
};

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === 'undefined') return 'es';
    return normalizeLanguage(localStorage.getItem(STORAGE_KEY));
  });

  const esToEnDictionary = useMemo(() => {
    const entries = Object.entries(ES_TO_EN);
    const extras = [];

    for (const [key, value] of entries) {
      const repairedKey = repairMojibake(key);
      if (repairedKey !== key && !ES_TO_EN[repairedKey]) {
        extras.push([repairedKey, value]);
      }
    }

    return Object.fromEntries([...entries, ...extras]);
  }, []);

  const enToEsDictionary = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(esToEnDictionary).map(([esText, enText]) => [enText, esText]),
      ),
    [esToEnDictionary],
  );

  const sortedEsKeys = useMemo(() => sortByLengthDesc(Object.keys(esToEnDictionary)), [esToEnDictionary]);
  const sortedEnKeys = useMemo(() => sortByLengthDesc(Object.keys(enToEsDictionary)), [enToEsDictionary]);

  const setLanguage = useCallback((nextLanguage) => {
    setLanguageState(normalizeLanguage(nextLanguage));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const t = useCallback(
    (text) => {
      if (language === 'en') {
        return esToEnDictionary[text] || text;
      }
      return text;
    },
    [esToEnDictionary, language],
  );

  const applyLanguage = useCallback(
    (rootNode = document.body) => {
      if (typeof document === 'undefined' || !rootNode) return;
      if (language === 'en') {
        applyTranslationOnNode(rootNode, esToEnDictionary, sortedEsKeys);
      } else {
        applyTranslationOnNode(rootNode, enToEsDictionary, sortedEnKeys);
      }
    },
    [enToEsDictionary, esToEnDictionary, language, sortedEnKeys, sortedEsKeys],
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
    localStorage.setItem(STORAGE_KEY, language);
    applyLanguage(document.body);
  }, [applyLanguage, language]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          applyLanguage(addedNode);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [applyLanguage]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, setLanguage, toggleLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
