import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTO_ES_TO_EN } from './i18nAutoMap';

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
  'Lo más simple suele ser lo más beneficioso y productivo.': 'The simplest is often the most beneficial and productive.',
  'Buscar Empleos': 'Search Jobs',
  'Crear Cuenta': 'Create Account',
  'MI perfil de trabajo': 'My Work Profile',
  'Sugerencias para Profesionales y Empresas': 'Tips for Professionals and Companies',
  'Sugerencias para los Empleadores y Profesionales': 'Suggestions for Employers and Professionals',
  'Registrar Empresa': 'Register Company',
  Planes: 'Plans',
  'Planes y Precios': 'Plans and Pricing',
  'Todos los planes son gratuitos por el momento y no requieren tarjeta.':
    'All plans are currently free and require no card.',
  'Planes 2 y 3 bonificados': 'Plans 2 and 3 are covered',
  'Pasando los 3 meses, la plataforma le pedirá un plan de abono para continuar.':
    'After 3 months, the platform will require a paid plan to continue.',
  'Ver planes': 'View plans',
  'Publicar Oferta': 'Post Job',
  'Publicar Ofertas Laborales': 'Post Job Offers',
  'Conectamos talento con oportunidades.': 'We connect talent with opportunities.',
  'T\u00e9rminos y Condiciones': 'Terms and Conditions',
  'Pol\u00edticas y Privacidad': 'Privacy Policy',
  'Qui\u00e9nes Somos': 'About Us',
  'C\u00f3mo trabajamos': 'How we work',
  'Como trabajamos': 'How we work',
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
  '¿Querés activar esta oferta laboral?': 'Do you want to activate this job posting?',
  '¿Querés pausar esta oferta laboral?': 'Do you want to pause this job posting?',
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
  'No se pudo eliminar el usuario': 'Could not delete user',
  'Usuario eliminado': 'User deleted',
  'No se pudo activar el plan': 'Could not activate plan',
  'No se pudo cancelar la suscripción': 'Could not cancel subscription',
  'Cargando suscripciones...': 'Loading subscriptions...',
  'No tenés suscripción activa.': "You don't have an active subscription.",
  'No se pudo cargar el perfil de empresa': 'Could not load company profile',
  'No se pudo cargar la oferta': 'Could not load job',
  'Iniciá sesión para postularte': 'Log in to apply',
  'Solo los candidatos pueden postularse': 'Only candidates can apply',
  'Postulación enviada': 'Application submitted',
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
  'Forma Más Fácil': 'Easiest Way',
  'de Conseguir Tu Nuevo Trabajo': 'to Get Your New Job',
  'Cada mes, más de 3 millones de personas buscan trabajo en nuestra plataforma, realizando más de 140.000 postulaciones cada día':
    'Every month, more than 3 million people search for jobs on our platform, submitting over 140,000 applications each day.',
  'Industria': 'Industry',
  'Profesiones': 'Professions',
  'Tecnología': 'Technology',
  'Tecnologia': 'Technology',
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
  'La mejor relación precio-valor': 'Best price-value ratio',
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
  'Renovaci\u00f3n paga al finalizar': 'Paid renewal at the end',
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
  '1. Beneficios para Empleadores': '1. Benefits for Employers',
  'Beneficios para Empleadores': 'Benefits for Employers',
  '5. Sistema de Evaluaci\u00f3n': '5. Evaluation System',
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
  'Seccion de publicacion y busqueda de trabajo': 'Job posting and search section',
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
  'Enlace inválido': 'Invalid link',
  'La nueva contraseña debe tener al menos 6 caracteres': 'The new password must be at least 6 characters',
  'Si el correo existe, te contactaremos para recuperar el acceso.':
    'If the email exists, we will contact you to recover access.',
  'Ingresá tu email y te enviaremos las instrucciones para restablecerla.':
    'Enter your email and we will send you instructions to reset it.',
  'Enviando...': 'Sending...',
  'Enviar recuperación': 'Send recovery',
  Cerrar: 'Close',
  'El email es requerido': 'Email is required',
  'Contrase\u00f1a': 'Password',
  'tu@email.com': 'you@email.com',
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
  'A\u00fan no te postulaste a ninguna oferta.': "You haven't applied to any jobs yet.",
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
  'Calificacion Freelance': 'Freelance Rating',
  'Todavia no tenes calificaciones': "You don't have ratings yet",
  'Inscripci?n inicial: 2 meses gratis en tu primera vez en la plataforma.':
    'Initial registration: 2 free months on your first time on the platform.',
  'Periodo de renovaci?n: todas las renovaciones son pagas en cualquiera de sus formas.':
    'Renewal period: all renewals are paid under any modality.',
  '?Ya ten?s cuenta de empresa?': 'Do you already have a company account?',
  'Tasa de ?xito': 'Success Rate',

  // ── Profile / CV / files ──────────────────────────────────────────────────
  'Seleccioná una imagen primero': 'Select an image first',
  'CV actualizado': 'CV updated',
  'CV eliminado': 'CV deleted',
  'No se pudo eliminar el CV': 'Could not delete CV',
  'Seleccioná un CV primero': 'Select a CV first',
  'Archivos varios actualizados': 'Additional files updated',
  'Seleccioná archivos para subir': 'Select files to upload',
  'Archivo eliminado': 'File deleted',
  'No se pudo eliminar el archivo': 'Could not delete file',
  'CV cargado': 'CV loaded',
  'Reemplazar CV': 'Replace CV',
  'Subir CV': 'Upload CV',
  'Subir archivos varios': 'Upload additional files',
  'Subir foto': 'Upload photo',
  'Todas las categorías': 'All categories',
  'Todavia no recibiste calificaciones': "You haven't received ratings yet",
  'Formación Académica': 'Academic Background',
  'Contá brevemente sobre vos': 'Tell us briefly about yourself',
  'Experiencia laboral': 'Work experience',
  'Contá brevemente tu experiencia laboral': 'Tell us briefly about your work experience',
  'Whatsapp': 'WhatsApp',
  'Podés subir hasta 4 archivos varios': 'You can upload up to 4 additional files',

  // ── Ratings / applications ────────────────────────────────────────────────
  'Puntuación guardada': 'Rating saved',
  'Puntuar postulante': 'Rate applicant',
  'Postulado': 'Applied',
  'Ver CV': 'View CV',
  'Estado actualizado': 'Status updated',
  'Logo actualizado': 'Logo updated',

  // ── Job applicants ────────────────────────────────────────────────────────
  'Ocultar detalle': 'Hide details',
  'Ampliar postulante': 'Expand applicant',
  'Postulantes': 'Applicants',
  'Finalización': 'Completion',
  'Estado': 'Status',
  'No disponible': 'Not available',
  'Cargado': 'Uploaded',
  'cargado(s)': 'uploaded',
  'Esta oferta no tiene postulantes todavía.': 'This job has no applicants yet.',
  'postulante': 'applicant',
  'postulantes': 'applicants',
  'postulación': 'application',
  'postulaciones': 'applications',

  // ── Company dashboard / jobs ──────────────────────────────────────────────
  'No publicaste ofertas todavía.': "You haven't posted jobs yet.",
  'Inicio: ': 'Start: ',
  'Vence: ': 'Expires: ',
  'días restantes': 'days remaining',
  'Gestionar': 'Manage',
  'Actualizando...': 'Updating...',
  'Pausar': 'Pause',
  'Activar': 'Activate',
  'empleados': 'employees',

  // ── Job form (create / edit) ──────────────────────────────────────────────
  'Modalidad': 'Modality',
  'Periodicidad salarial': 'Salary period',
  'Requisitos': 'Requirements',
  'Responsabilidades': 'Responsibilities',
  'Oferta activa': 'Active job posting',
  'Descripción': 'Description',

  // ── Job search ────────────────────────────────────────────────────────────
  'A convenir': 'To be agreed',

  // ── Job detail ────────────────────────────────────────────────────────────
  'Semi-senior': 'Mid-level',
  'Líder': 'Lead',
  'Publicada el ': 'Posted on ',
  'Vence el ': 'Expires on ',
  'Ya te postulaste a esta oferta': 'You have already applied to this job',
  'Postularse': 'Apply',
  'Solo candidatos pueden postularse.': 'Only candidates can apply.',
  'Postularme': 'Apply now',
  'Enviar postulación': 'Send application',

  // ── Auth / OAuth ──────────────────────────────────────────────────────────
  'Debés subir tu CV para iniciar sesión': 'You must upload your CV to log in',
  'Completando autenticacion...': 'Completing authentication...',
  'No se recibio token de autenticacion': 'Authentication token was not received',
  'Tipo de usuario invalido': 'Invalid user type',

  // ── Blog ──────────────────────────────────────────────────────────────────
  'Leer más': 'Read more',
  'Consejos': 'Tips',
  'Tendencias': 'Trends',

  // ── Psicólogos / mental health section ────────────────────────────────────
  'Psicólogos en Línea': 'Online Psychologists',
  'Buscar psicólogo': 'Find a psychologist',
  'Buscar psicólogo/a': 'Find a psychologist',
  'Buscar psicólogos': 'Find psychologists',
  'Sección de Psicología': 'Psychology Section',
  'Otro servicio de': 'Another service by',
  'Accedé a Psicólogos en Línea': 'Access Online Psychologists',
  'SOLO AQUÍ!': 'ONLY HERE!',
  'Persona trabajando desde casa': 'Person working from home',
  'Soy paciente': 'I am a patient',
  'Soy paciente →': 'I am a patient →',
  'Soy psicólogo': 'I am a psychologist',
  'Busco un psicólogo': 'I am looking for a psychologist',
  'Acceder a mi panel': 'Access my dashboard',
  'Sitio principal': 'Main site',
  'Registro usuario': 'User registration',
  'Registro Psicólogos': 'Psychologist registration',
  'Mi panel': 'My dashboard',
  'Mis solicitudes': 'My requests',
  'Cerrar menú': 'Close menu',
  'Abrir menú': 'Open menu',
  'Las consultas son pactadas directamente entre el paciente y el profesional.': 'Consultations are arranged directly between the patient and the professional.',
  'La plataforma no interviene ni garantiza los servicios.': 'The platform does not intervene in or guarantee the services.',
  'Encontrá un profesional de la salud mental que te acompañe de forma remota.': 'Find a mental health professional who can support you remotely.',
  'Crear cuenta': 'Create account',
  'Iniciar sesión': 'Log in',
  'Registrarme como psicólogo': 'Register as a psychologist',
  'Registrarme': 'Sign up',
  'Nombre, especialidad, idioma o país': 'Name, specialty, language, or country',
  'Todos los países': 'All countries',
  'Cargando psicólogos...': 'Loading psychologists...',
  'No se encontraron psicólogos con los filtros seleccionados.': 'No psychologists were found with the selected filters.',
  '¿Sos psicólogo/a?': 'Are you a psychologist?',
  'Registrarte en la plataforma y empezá a recibir pacientes de forma remota.': 'Register on the platform and start receiving remote patients.',
  'Ya solicitada': 'Already requested',
  'Solicitud aceptada': 'Request accepted',
  'Ver perfil de': 'View profile of',
  'País:': 'Country:',
  'Provincia/Región:': 'Province/Region:',
  'Matrícula:': 'License:',
  'Edad:': 'Age:',
  'Género:': 'Gender:',
  'Idiomas:': 'Languages:',
  'Experiencia:': 'Experience:',
  'Modalidad:': 'Modality:',
  'Costo final por sesión:': 'Final cost per session:',
  'Tiempo de sesión / promoción:': 'Session time / promotion:',
  'Título profesional:': 'Professional degree:',
  'Atiende:': 'Works with:',
  'Ocultar detalles': 'Hide details',
  'Ver más detalles': 'See more details',
  'Solicitar consulta': 'Request a consultation',
  'Volver al listado': 'Back to listing',
  'No se encontró el psicólogo.': 'Psychologist not found.',
  'Contactar por WhatsApp': 'Contact via WhatsApp',
  'Relación bloqueada': 'Relationship blocked',
  'Esta relación está bloqueada. Ya no podés ver los datos de este usuario.': 'This relationship is blocked. You can no longer see this user data.',
  'Bloqueando...': 'Blocking...',
  'Bloquear': 'Block',
  'Finalización solicitada': 'Termination requested',
  'El usuario finaliza la terapia': 'The user ends therapy',
  'El usuario ha decidido finalizar la terapia por razones personales': 'The user has decided to end therapy for personal reasons',
  'El profesional aceptó la finalización de la terapia.': 'The professional accepted the therapy termination.',
  'Solicitud enviada — esperando respuesta': 'Request sent — waiting for a response',
  'Cancelar solicitud': 'Cancel request',
  '¿Cancelar esta solicitud?': 'Cancel this request?',
  'Mensaje opcional para el psicólogo (ej. motivo de consulta)...': 'Optional message for the psychologist (e.g. reason for consultation)...',
  'Volver a solicitar consulta': 'Request consultation again',
  'Iniciar sesión para solicitar consulta': 'Log in to request a consultation',
  'Cargando estado...': 'Loading status...',
  'Especialidades': 'Specialties',
  'Información pública': 'Public information',
  'País': 'Country',
  'Provincia / Región': 'Province / Region',
  'Matrícula Nacional/Profesional Número': 'National/Professional License Number',
  'Edad': 'Age',
  'Género': 'Gender',
  'Experiencia': 'Experience',
  'Costo final por sesión': 'Final cost per session',
  'Tiempo de sesión / promoción': 'Session time / promotion',
  'Atiende': 'Works with',
  'Formación': 'Education',
  'Sobre mí': 'About me',
  'Aviso:': 'Notice:',
  'Aviso importante:': 'Important notice:',
  'La atención remota no es recomendable para crisis aguda de psicosis, riesgo de la salud física del paciente, intento de atentar contra la vida propia o de otros, etc. En estos casos se recomienda llamar al número de emergencia más cercano para casos de esta índole.': 'Remote care is not recommended for acute psychosis crises, risk to the patient’s physical health, attempts to harm oneself or others, or similar situations. In these cases, please call the nearest emergency number for this type of situation.',
  'La atención remota no es recomendada para crisis aguda con riesgo de vida o psicosis activa que requiera contención física inmediata, las cuales necesitan atención presencial de emergencia.': 'Remote care is not recommended for acute life-threatening crises or active psychosis requiring immediate physical containment; these require in-person emergency care.',
  'El profesional actúa de manera independiente.': 'The professional acts independently.',
  'La plataforma no interviene en sesiones, pagos ni resultados del servicio.': 'The platform does not intervene in sessions, payments, or service outcomes.',
  'Superás barreras geográficas y de movilidad': 'You overcome geographic and mobility barriers',
  'No importa si vivís en un pueblo pequeño, si no hay psicólogos cerca o si tenés dificultades para desplazarte. Solo necesitás internet.': 'It does not matter if you live in a small town, have no psychologists nearby, or have difficulty traveling. You only need internet.',
  'Ahorrás tiempo y dinero en traslados': 'You save time and travel costs',
  'Nada de atascos, esperas en sala o gasto en combustible. Ese tiempo y dinero lo invertís en tu bienestar.': 'No traffic jams, waiting rooms, or fuel costs. You invest that time and money in your wellbeing.',
  'Te sentís más cómodo y con privacidad': 'You feel more comfortable and private',
  'Estar en tu propio espacio reduce la ansiedad y el temor a encontrarte con conocidos en una sala de espera. Para muchos, esto disminuye el estigma de pedir ayuda.': 'Being in your own space reduces anxiety and the fear of running into acquaintances in a waiting room. For many people, this lowers the stigma of asking for help.',
  'Horarios a tu medida': 'Schedules that fit you',
  'Podés agendar sesiones al mediodía, al anochecer o fines de semana, algo difícil en consultorios físicos con horario fijo.': 'You can schedule sessions at midday, in the evening, or on weekends, which is difficult in physical offices with fixed hours.',
  'Continuidad sin interrupciones': 'Continuity without interruptions',
  'Si viajás por trabajo, te mudás o cambiás de ciudad, no perdés a tu terapeuta ni los avances. La terapia viaja con vos.': 'If you travel for work, move, or change cities, you do not lose your therapist or your progress. Therapy travels with you.',
  'Misma efectividad para la mayoría de los problemas': 'Same effectiveness for most concerns',
  'Los estudios muestran que la terapia online es tan eficaz como la presencial para ansiedad, depresión leve-moderada, duelo, estrés laboral, fobias, problemas de pareja, etc.': 'Studies show that online therapy can be as effective as in-person therapy for anxiety, mild to moderate depression, grief, work stress, phobias, relationship issues, and more.',
  'Menor costo económico': 'Lower financial cost',
  'Muchos psicólogos remotos tienen tarifas más bajas al no alquilar consultorio. Además, cero gastos de desplazamiento.': 'Many remote psychologists have lower fees because they do not rent an office. There are also no travel expenses.',
  'Opciones de comunicación variadas': 'Varied communication options',
  'No solo videollamada: hay chat, mensajes asíncronos, seguimiento por app, etc. Te adaptás a tu estilo.': 'Not only video calls: there can be chat, asynchronous messages, app follow-up, and more. You adapt it to your style.',
  'Mayor adherencia al tratamiento': 'Greater treatment adherence',
  'Al ser más cómodo, es menos probable que canceles sesiones por pereza, lluvia o tráfico. La constancia mejora los resultados.': 'Because it is more convenient, you are less likely to cancel sessions due to tiredness, rain, or traffic. Consistency improves outcomes.',
  'Personas con poca movilidad': 'People with limited mobility',
  'Mujeres embarazadas': 'Pregnant women',
  'Madres con hijos muy pequeños': 'Mothers with very young children',
  'Beneficios de la terapia en línea / remota': 'Benefits of online / remote therapy',
  '¿Por qué elegir la psicología remota?': 'Why choose remote psychology?',
  'Optar por la psicología remota tiene sentido por varias razones prácticas,': 'Choosing remote psychology makes sense for several practical,',
  'emocionales y económicas. Aquí los motivos clave:': 'emotional, and financial reasons. Here are the key reasons:',
  'Elimina barreras físicas: No necesitan desplazarse en transporte público o coche.': 'Removes physical barriers: no need to travel by public transport or car.',
  'Evita riesgos de caídas o accidentes en trayectos hacia el consultorio.': 'Avoids risks of falls or accidents on the way to the office.',
  'Ahorro de energía física: la fatiga por salir de casa se reduce al mínimo.': 'Saves physical energy: the fatigue of leaving home is minimized.',
  'Mayor autonomía: pueden recibir atención sin depender de familiares.': 'Greater autonomy: people can receive care without depending on family members.',
  'Continuidad ante problemas de salud crónicos o climatológicos.': 'Continuity despite chronic health or weather issues.',
  'Evita esfuerzos y riesgos en desplazamientos, especialmente en embarazos de alto riesgo.': 'Avoids effort and travel risks, especially in high-risk pregnancies.',
  'Ideal para reposo parcial o total: permite mantener el apoyo psicológico sin violar indicaciones médicas.': 'Ideal for partial or total rest: it allows psychological support while following medical instructions.',
  'Preparación al parto y postparto desde la tranquilidad del hogar, incluso con la pareja de forma remota.': 'Birth and postpartum preparation from the calm of home, even with the partner joining remotely.',
  'Sin necesidad de conseguir ni pagar cuidador: la madre puede estar en casa mientras el niño duerme o juega cerca.': 'No need to find or pay a caregiver: the mother can be at home while the child sleeps or plays nearby.',
  'Flexibilidad ante imprevistos: si el bebé llora o hay que atenderlo, se puede pausar brevemente la sesión.': 'Flexibility for unexpected moments: if the baby cries or needs attention, the session can briefly pause.',
  'Ahorro de tiempo y estrés: no hay que preparar la mochila del niño, desplazarse ni mantenerlo tranquilo en sala de espera.': 'Saves time and stress: no need to pack a child bag, travel, or keep the child calm in a waiting room.',
  'Planes para Psicólogos': 'Plans for Psychologists',
  'Elegí el plan que mejor se adapte a tu práctica profesional. Hoy están gratis.': 'Choose the plan that best fits your professional practice. Today they are free.',
  'Para mayor continuidad': 'For greater continuity',
  'Perfil visible para pacientes': 'Profile visible to patients',
  'Bonificado para psicólogos': 'Covered for psychologists',
  'Ver mi plan': 'View my plan',
  'Comenzar': 'Start',
  'Promoción vigente:': 'Current promotion:',
  'el precio regular figura como referencia, pero el acceso': 'the regular price is shown as a reference, but access',
  'a los planes para psicólogos está bonificado.': 'to psychologist plans is covered.',
  'IMPORTANTE': 'IMPORTANT',
  'Esta sección de Psicología es completamente independiente a la sección inicial de': 'This Psychology section is completely independent from the original',
  'professional at home, por lo tanto los registros, términos y condiciones, privacidad y': 'professionals at home section, so registrations, terms and conditions, privacy, and',
  'otros también son diferentes a los anteriores, ya que legalmente presentan otras normativas': 'other documents are also different from the previous ones, because legally they involve different regulations',
  'para los psicólogos profesionales. Para que el interesado en el servicio —cliente o': 'for professional psychologists. So that the person interested in the service — client or',
  'paciente— pueda hacer cumplir su derecho a la atención que demandan las leyes bajo este': 'patient — can exercise their right to the care required by law under this',
  'servicio de psicología a nivel Nacional e Internacional, el profesional debe estar de': 'psychology service at national and international level, the professional must agree',
  'acuerdo con dichas pautas, términos y condiciones. Este ratificado debe tener su conformidad': 'with those guidelines, terms, and conditions. This ratification must include their confirmation',
  'de que fue apropiadamente leído y aceptado por el profesional en cuestión, con pleno': 'that it was properly read and accepted by the professional in question, with full',
  'conocimiento de los mismos y bajo su propia decisión.': 'knowledge of them and by their own decision.',
  'Términos y condiciones': 'Terms and conditions',
  'Privacidad': 'Privacy',
  'Acuerdo de aceptación': 'Acceptance agreement',
  'Acuerdo psicólogo': 'Psychologist agreement',
  'Crear cuenta de paciente': 'Create patient account',
  'Registrate para contactar psicólogos en línea': 'Register to contact online psychologists',
  'La consulta en línea no es recomenda para situaciones que requieran contención física inmediata. En ese caso se necesita atención presencial de emergencia. El costo de la o las sesiones será tratado directamente con el profesional de su elección. ¡SIN EXCEPCIÓN!': 'Online consultation is not recommended for situations requiring immediate physical containment. In that case, in-person emergency care is needed. The cost of the session or sessions will be handled directly with the professional of your choice. NO EXCEPTIONS!',
  'Tu nombre': 'Your first name',
  'Tu apellido': 'Your last name',
  'Seleccioná una opción': 'Select an option',
  'Hombre': 'Man',
  'Mujer': 'Woman',
  'Otro': 'Other',
  'Mínimo 6 caracteres': 'Minimum 6 characters',
  'Repetí tu contraseña': 'Repeat your password',
  'Confirmá tu contraseña': 'Confirm your password',
  'El nombre es obligatorio': 'First name is required',
  'El apellido es obligatorio': 'Last name is required',
  'Seleccioná tu género': 'Select your gender',
  'El email es obligatorio': 'Email is required',
  'La contraseña es obligatoria': 'Password is required',
  'Debés aceptar los Términos y Condiciones': 'You must accept the Terms and Conditions',
  'Debés aceptar la Política de Privacidad': 'You must accept the Privacy Policy',
  'Debés aceptar el Acuerdo de Aceptación del Usuario / Paciente': 'You must accept the User / Patient Acceptance Agreement',
  'Acepto la': 'I accept the',
  'Acepto el': 'I accept the',
  'Política de Privacidad': 'Privacy Policy',
  'Acuerdo de Aceptación del Usuario / Paciente': 'User / Patient Acceptance Agreement',
  'Ver psicólogos sin registrarme': 'View psychologists without registering',
  'Ingresar como paciente': 'Log in as a patient',
  'Accedé para contactar psicólogos en línea': 'Log in to contact online psychologists',
  'Ingresar como psicólogo': 'Log in as a psychologist',
  'Accedé a tu panel profesional': 'Access your professional dashboard',
  'Tu contraseña': 'Your password',
  'Ingresando...': 'Logging in...',
  'Recuperar clave': 'Recover password',
  '¿No tenés cuenta?': 'Do not have an account?',
  'Ver psicólogos sin iniciar sesión': 'View psychologists without logging in',
  'Volver al listado de psicólogos': 'Back to the psychologist listing',
  'Ingresá tu email y te enviaremos un link para restablecer tu clave.': 'Enter your email and we will send you a link to reset your password.',
  'Enviar link de recuperación': 'Send recovery link',
  'Ingresá tu email.': 'Enter your email.',
  'Enviando link de recuperación...': 'Sending recovery link...',
  'Si el email está registrado, recibirás un link para restablecer tu clave.': 'If the email is registered, you will receive a link to reset your password.',
  'No se pudo procesar la recuperación de clave.': 'Could not process password recovery.',
  'Email o contraseña incorrectos': 'Incorrect email or password',
  '¡Cuenta creada! Ya podés buscar un psicólogo.': 'Account created! You can now search for a psychologist.',
  '¡Bienvenido/a!': 'Welcome!',
  'Elegí tu tipo de registro para comenzar con el formulario.': 'Choose your registration type to start the form.',
  'Psicólogo en Argentina': 'Psychologist in Argentina',
  'Para profesionales con matrícula emitida en Argentina.': 'For professionals with a license issued in Argentina.',
  'Matrícula provincial': 'Provincial license',
  'Título universitario': 'University degree',
  'Psicólogo Internacional': 'International Psychologist',
  'Para profesionales fuera de Argentina.': 'For professionals outside Argentina.',
  'Documento / Pasaporte / Cédula': 'ID Document / Passport / National ID',
  'Licencia o colegiación según país': 'License or board registration according to country',
  'Ingresá acá': 'Log in here',
  'Registro - Psicólogo en Argentina': 'Registration - Psychologist in Argentina',
  'Registro - Psicólogo Internacional': 'Registration - International Psychologist',
  'La atención remota no es recomendada para crisis aguda con riesgo de vida o psicosis activa.': 'Remote care is not recommended for acute life-threatening crises or active psychosis.',
  'Visible para pacientes': 'Visible to patients',
  'El email y el WhatsApp lo verá el paciente una vez que el profesional apruebe la solicitud de consulta enviada por el usuario/paciente.': 'The patient will see the email and WhatsApp once the professional approves the consultation request sent by the user/patient.',
  'País y provincia donde ejerce': 'Country and province where they practice',
  'País y región': 'Country and region',
  'Matrícula nacional/profesional': 'National/professional license',
  'Edad y género': 'Age and gender',
  'Título, universidad y formación': 'Degree, university, and education',
  'Título, institución y formación': 'Degree, institution, and education',
  'Cuenta': 'Account',
  'Personal': 'Personal',
  'Profesional': 'Professional',
  'Campo requerido': 'Required field',
  'Complete los campos requeridos': 'Complete the required fields',
  'Usá solo letras y al menos 2 caracteres': 'Use only letters and at least 2 characters',
  'Debe ser una fecha válida y mayor de 21 años': 'Must be a valid date and over 21 years old',
  'Ingresá 7 u 8 números': 'Enter 7 or 8 numbers',
  'CUIT inválido': 'Invalid CUIT',
  'Ingresá un WhatsApp válido, solo números y prefijo': 'Enter a valid WhatsApp number, using only numbers and prefix',
  'Ingresá una calle válida': 'Enter a valid street',
  'Número inválido': 'Invalid number',
  'Piso/depto inválido': 'Invalid floor/apartment',
  'Localidad inválida': 'Invalid locality',
  'Ciudad inválida': 'Invalid city',
  'Código postal inválido': 'Invalid postal code',
  'Ingresá una universidad válida': 'Enter a valid university',
  'La matrícula debe incluir números': 'The license must include numbers',
  'Registro inválido': 'Invalid registration',
  'Autorización inválida': 'Invalid authorization',
  'Costo inválido': 'Invalid cost',
  'Texto demasiado largo': 'Text is too long',
  'Ingresá un número entre 0 y 50': 'Enter a number between 0 and 50',
  'Modalidad inválida': 'Invalid modality',
  'Mínimo 20 caracteres': 'Minimum 20 characters',
  'Seleccioná al menos un idioma': 'Select at least one language',
  'Seleccioná al menos una especialidad': 'Select at least one specialty',
  'Seleccioná al menos una edad': 'Select at least one age range',
  'Ingresá un año entre 1950 y': 'Enter a year between 1950 and',
  'La licencia debe incluir números': 'The license must include numbers',
  'Entidad inválida': 'Invalid issuing entity',
  'País inválido': 'Invalid country',
  'Región inválida': 'Invalid region',
  'Documento inválido': 'Invalid document',
  'Institución inválida': 'Invalid institution',
  'Identificación fiscal como Monotributista inválida': 'Invalid tax identification as self-employed taxpayer',
  'Email de contacto público': 'Public contact email',
  'El que verán los pacientes': 'The one patients will see',
  'Provincia/Número': 'Province/Number',
  'Piso/departamento': 'Floor/apartment',
  'Según corresponda': 'If applicable',
  'Localidad': 'Locality',
  'Provincia': 'Province',
  'Seleccionar': 'Select',
  'Provincia donde ejerce': 'Province where you practice',
  'Año de graduación': 'Graduation year',
  'Nombre oficial de la institución': 'Official institution name',
  'Matrícula Provincial Numero': 'Provincial License Number',
  'Nro. Ministerio de Salud': 'Health Ministry No.',
  'Licencia Sanitaria Federal': 'Federal Health License',
  'Tiempo de sesión / promoción *': 'Session time / promotion *',
  'Ej: 50 minutos': 'E.g.: 50 minutes',
  'Promoción: 2 sesiones al costo de una': 'Promotion: 2 sessions for the cost of one',
  'Años de experiencia': 'Years of experience',
  'Años de experiencia *': 'Years of experience *',
  'Modalidad remota': 'Remote modality',
  'Modalidad remota *': 'Remote modality *',
  'Breve descripción de experiencia y estudios': 'Brief description of experience and studies',
  'Breve descripción de experiencia y estudios *': 'Brief description of experience and studies *',
  'Idiomas hablados': 'Spoken languages',
  'puede marcar una o más': 'you may select one or more',
  'Edad de atención': 'Care age range',
  'Adultos (mayor a 18 años)': 'Adults (over 18 years old)',
  'Infanto-juvenil (hasta los 18 años)': 'Child and adolescent (up to 18 years old)',
  'Declaraciones obligatorias': 'Required declarations',
  'Declaración jurada de que toda la información es verdadera.': 'Sworn statement that all information is truthful.',
  'Aceptación del Contrato de Prestación de Servicios de Suscripción.': 'Acceptance of the Subscription Services Agreement.',
  'Autorización para verificar datos ante colegios profesionales.': 'Authorization to verify information with professional boards.',
  'Autorización para verificar datos ante organismos competentes.': 'Authorization to verify information with competent authorities.',
  'Acuerdo de Aceptación del Profesional Psicólogo': 'Psychologist Professional Acceptance Agreement',
  'Atrás': 'Back',
  'Enviar registro': 'Submit registration',
  'Cambiar tipo de registro': 'Change registration type',
  'Tipo de documento': 'Document type',
  'Pasaporte': 'Passport',
  'Cédula': 'National ID',
  'Número de documento': 'Document number',
  'Estado / Provincia / Región': 'State / Province / Region',
  'Número de licencia / colegiación / matrícula': 'License / board registration / license number',
  'Entidad que expide la licencia': 'License issuing entity',
  'País de emisión de la licencia': 'License issuing country',
  'Institución que otorgó el título': 'Institution that granted the degree',
  'Cargando documentos existentes...': 'Loading existing documents...',
  'Carga de documentos': 'Document upload',
  'Subí los documentos que acrediten tu identidad y habilitación profesional.': 'Upload documents that prove your identity and professional authorization.',
  'Tu cuenta ya fue aprobada: podés actualizar estos archivos sin nueva aprobación.': 'Your account has already been approved: you can update these files without new approval.',
  'El equipo los revisará en aproximadamente 5 días hábiles.': 'The team will review them in approximately 5 business days.',
  'Los primeros 4 documentos son obligatorios para continuar.': 'The first 4 documents are required to continue.',
  'Documentos cargados anteriormente': 'Previously uploaded documents',
  'Reemplazar documento': 'Replace document',
  'Borrar documento': 'Delete document',
  'Reemplazar': 'Replace',
  'Obligatorio': 'Required',
  'Opcional': 'Optional',
  'Agregar archivo': 'Add file',
  'Archivos seleccionados': 'Selected files',
  'Enviá los 4 primeros archivos obligatorios': 'Upload the first 4 required files',
  'Podés subir hasta': 'You can upload up to',
  'archivos en total. Ya tenés': 'files total. You already have',
  'cargado(s) o seleccionado(s).': 'uploaded or selected.',
  'no tiene un formato permitido. Usá PDF, JPG o PNG.': 'does not have an allowed format. Use PDF, JPG, or PNG.',
  'supera el máximo de 5 MB.': 'exceeds the 5 MB maximum.',
  '¿Está seguro que desea reemplazar el documento seleccionado?': 'Are you sure you want to replace the selected document?',
  '¿Querés borrar este documento?': 'Delete this document?',
  'Guardar documentos': 'Save documents',
  'Enviar documentos': 'Submit documents',
  'Subiendo': 'Uploading',
  'Foto/escaneo del DNI (frente y dorso)': 'Photo/scan of ID document (front and back)',
  'Título de psicólogo (frente y dorso)': 'Psychology degree (front and back)',
  'Certificado de matrícula profesional vigente': 'Current professional license certificate',
  'Constancia de CUIT': 'CUIT certificate',
  'Certificado de buena conducta (si aplica según país/lugar de terapia)': 'Good conduct certificate (if applicable according to country/place of therapy)',
  'Certificado por especialidad declarada (si aplica según país/lugar de terapia)': 'Certificate for declared specialty (if applicable according to country/place of therapy)',
  'Documento de identidad / Pasaporte / Cédula (frente y dorso)': 'Identity document / Passport / National ID (front and back)',
  'Título profesional o diploma (frente y dorso)': 'Professional degree or diploma (front and back)',
  'Certificado de matrícula, licencia o colegiación profesional vigente': 'Current professional license, authorization, or board registration certificate',
  'Comprobante de identificación fiscal (si aplica)': 'Tax identification proof (if applicable)',
  'Certificado de antecedentes penales o de buena conducta (si aplica según país/lugar de terapia)': 'Criminal record or good conduct certificate (if applicable according to country/place of therapy)',
  '¡Registro enviado exitosamente!': 'Registration submitted successfully!',
  'Tu solicitud de registro fue recibida y está': 'Your registration request was received and is',
  'pendiente de verificación': 'pending verification',
  'El equipo de Professionals at Home revisará tu documentación en aproximadamente': 'The Professionals at Home team will review your documentation in approximately',
  '5 días hábiles': '5 business days',
  'Te enviaremos un email a tu dirección de correo': 'We will send an email to your email address',
  'cuando tu cuenta sea aprobada.': 'when your account is approved.',
  'Datos enviados': 'Data submitted',
  'Documentación cargada': 'Documentation uploaded',
  'Verificación por el equipo (~5 días hábiles)': 'Team verification (~5 business days)',
  'Activación de tu perfil': 'Profile activation',
  'Volver al inicio': 'Back home',
  'Mi panel de psicólogo': 'My psychologist dashboard',
  'Pendiente de documentación': 'Pending documentation',
  'En revisión (~5 días hábiles)': 'Under review (~5 business days)',
  'Aprobado - Elegí tu plan para activarte': 'Approved - Choose your plan to activate your profile',
  'Estamos considerando su registro. Disculpe las molestias.': 'We are considering your registration. Sorry for the inconvenience.',
  'Activo - Visible para pacientes': 'Active - Visible to patients',
  'Elegir plan': 'Choose plan',
  'Elegir plan →': 'Choose plan →',
  'Mi perfil': 'My profile',
  'Cambiar foto de perfil': 'Change profile photo',
  'Plan:': 'Plan:',
  'Estado:': 'Status:',
  'Válido hasta:': 'Valid until:',
  'Sin suscripción activa.': 'No active subscription.',
  'Ver / subir documentos': 'View / upload documents',
  'Cambiar plan': 'Change plan',
  'Ver cómo aparezco en el listado del paciente': 'See how I appear in the patient listing',
  'Solicitudes/consulta de los pacientes': 'Patient consultation requests',
  'pendiente': 'pending',
  'pendientes': 'pending',
  'Cargando solicitudes...': 'Loading requests...',
  'Aún no recibiste solicitudes de consulta.': 'You have not received consultation requests yet.',
  'Pendientes': 'Pending',
  'Aceptar': 'Accept',
  'Rechazar': 'Reject',
  'Bloqueado': 'Blocked',
  'Desbloquear': 'Unblock',
  'Desbloqueando...': 'Unblocking...',
  'Aceptar finalización': 'Accept termination',
  'Finalización de terapia aceptada.': 'Therapy termination accepted.',
  'Mi cuenta': 'My account',
  'Hola,': 'Hello,',
  'Mis solicitudes a psicólogos': 'My requests to psychologists',
  'Todavía no enviaste ninguna solicitud.': 'You have not sent any request yet.',
  'Ver psicólogos disponibles': 'View available psychologists',
  'Ver perfil →': 'View profile →',
  'Volver a solicitar': 'Request again',
  'Estimada/o. En estos momentos estamos con agenda completa. Será un gusto asistirle en un próximo contacto. Intente nuevamente después de 7 días.': 'Dear patient, our schedule is currently full. It will be a pleasure to assist you in a future contact. Please try again after 7 days.',
  'Todavía no figuras en el listado, porque no fuiste aprobado.': 'You are not listed yet because you have not been approved.',
  'Error al aceptar la finalización': 'Error accepting termination',
  'año': 'year',
  'años': 'years',
  'Bloquear usuario': 'Block user',
  'Borrando perfil...': 'Deleting profile...',
  'Borrar perfil': 'Delete profile',
  'Pendiente de respuesta': 'Waiting for response',
  'Guardar': 'Save',
  'Fecha de nacimiento': 'Date of birth',
  'DNI / documento': 'ID / document',
  'Identificación fiscal como Monotributista': 'Tax identification as self-employed taxpayer',
  'Región': 'Region',
  'Calle': 'Street',
  'Número': 'Number',
  'Provincia de domicilio': 'Home province',
  'Código postal': 'Postal code',
  'Universidad': 'University',
  'Institución emisora del título': 'Degree issuing institution',
  'País de licencia': 'License country',
  'Registro Ministerio de Salud': 'Health Ministry Registration',
  'Separadas por coma': 'Comma separated',
  'Separados por coma': 'Comma separated',
  'Elegí tu plan de psicólogo': 'Choose your psychologist plan',
  'Plan actual': 'Current plan',
  'Gratis': 'Free',
  'Precio regular:': 'Regular price:',
  'Solo plan superior': 'Higher plan only',
  'No se requiere tarjeta de crédito. Los planes para psicólogos están bonificados.': 'No credit card is required. Plans for psychologists are covered.',
  'Próximamente: pagos seguros con': 'Coming soon: secure payments with',
  'activado! Tu perfil ya es visible para los pacientes.': 'activated! Your profile is now visible to patients.',
  'No se pudo cargar el listado de psicólogos': 'Could not load the psychologist listing',
  'No se pudo cargar el perfil del psicólogo': 'Could not load the psychologist profile',
  '¡Solicitud enviada! El psicólogo la revisará pronto.': 'Request sent! The psychologist will review it soon.',
  'Error al enviar la solicitud': 'Error sending request',
  'Solicitud cancelada': 'Request canceled',
  'Error al cancelar': 'Error canceling',
  'Usuario bloqueado': 'User blocked',
  'Usuario desbloqueado': 'User unblocked',
  'Error al bloquear': 'Error blocking',
  'Error al desbloquear': 'Error unblocking',
  'Pedido enviado al profesional': 'Request sent to the professional',
  'Error al pedir la finalización': 'Error requesting termination',
  'No se pudieron cargar tus solicitudes': 'Could not load your requests',
  'Perfil borrado': 'Profile deleted',
  'No se pudo borrar el perfil': 'Could not delete profile',
  'No se pudo cargar los documentos existentes': 'Could not load existing documents',
  'Documento reemplazado.': 'Document replaced.',
  'Documento reemplazado. Queda pendiente de verificación.': 'Document replaced. It remains pending verification.',
  'Error al reemplazar documento': 'Error replacing document',
  'Documento eliminado.': 'Document deleted.',
  'Error al eliminar documento': 'Error deleting document',
  'La documentación obligatoria ya está cargada.': 'The required documentation is already uploaded.',
  'Faltan documentos obligatorios:': 'Required documents are missing:',
  'Error al subir documentos': 'Error uploading documents',
  'La subida tardó demasiado. Probá subir menos archivos por vez o verificá tu conexión.': 'The upload took too long. Try uploading fewer files at once or check your connection.',
  'Español': 'Spanish',
  'Inglés': 'English',
  'Portugués': 'Portuguese',
  'Francés': 'French',
  'Alemán': 'German',
  'Italiano': 'Italian',
  'Chino': 'Chinese',
  'Japonés': 'Japanese',
  'Árabe': 'Arabic',
  'Ruso': 'Russian',
  'Perú': 'Peru',
  'México': 'Mexico',
  'España': 'Spain',
  'Estados Unidos': 'United States',
  'Brasil': 'Brazil',
  'Entre Ríos': 'Entre Rios',
  'Tucumán': 'Tucuman',
  'Neuquén': 'Neuquen',
  'Río Negro': 'Rio Negro',
  'Tierra del Fuego': 'Tierra del Fuego',
  'Ciudad de Buenos Aires': 'Buenos Aires City',
  'Telepsicología / Telemedicina': 'Telepsychology / Telemedicine',
  'Psicología clínica y de la salud': 'Clinical and health psychology',
  'Psicología (diversos enfoques)': 'Psychology (various approaches)',
  'Terapia de pareja y familiar': 'Couples and family therapy',
  'Psicología del desarrollo y edades': 'Developmental psychology and life stages',
  'Psicología educativa': 'Educational psychology',
  'Psicología laboral/organizacional': 'Work / organizational psychology',
  'Psicología social y comunitaria': 'Social and community psychology',
  'Psicología perinatal y abordaje de ansiedad/depresión en embarazo o posparto': 'Perinatal psychology and anxiety/depression support during pregnancy or postpartum',
  'Psicólogo': 'Psychologist',
  'Lic. en Psicología': 'Degree in Psychology',
};

const COMBINED_ES_TO_EN = {
  ...AUTO_ES_TO_EN,
  ...ES_TO_EN,
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

const scoreSpanishKeyQuality = (value) => {
  if (typeof value !== 'string') return -999;
  let score = 0;

  if (/\\u[0-9a-f]{4}/i.test(value)) score -= 5;
  if (/[\uFFFD]/.test(value)) score -= 8;
  if (/[ÃÂ]/.test(value)) score -= 3;
  if (/[\u00C0-\u017F]/.test(value)) score += 2;
  if (/[\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1\u00FC\u00BF\u00A1]/i.test(value)) score += 3;

  return score;
};

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
    const entries = Object.entries(COMBINED_ES_TO_EN);
    const extras = [];

    for (const [key, value] of entries) {
      const repairedKey = repairMojibake(key);
      if (repairedKey !== key && !COMBINED_ES_TO_EN[repairedKey]) {
        extras.push([repairedKey, value]);
      }
    }

    return Object.fromEntries([...entries, ...extras]);
  }, []);

  const enToEsDictionary = useMemo(
    () => {
      const reverse = {};
      const scores = {};

      for (const [esText, enText] of Object.entries(esToEnDictionary)) {
        if (!enText) continue;
        const nextScore = scoreSpanishKeyQuality(esText);
        const prevScore = scores[enText] ?? -999;
        if (reverse[enText] === undefined || nextScore > prevScore) {
          reverse[enText] = esText;
          scores[enText] = nextScore;
        }
      }

      return reverse;
    },
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
