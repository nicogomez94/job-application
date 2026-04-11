import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'site-language';

const ES_TO_EN = {
  'Buscar empleo...': 'Search jobs...',
  'Ver Ofertas': 'View Jobs',
  Registrarse: 'Sign up',
  Ingresar: 'Log in',
  'Publicar Empleo': 'Post a Job',
  Usuario: 'User',
  Salir: 'Log out',
  Candidatos: 'Candidates',
  Empresas: 'Companies',
  Contacto: 'Contact',
  'Buscar Empleos': 'Search Jobs',
  'Crear Cuenta': 'Create Account',
  'MI perfil de trabajo': 'My Work Profile',
  'Sugerencias para Profesionales y Empresas': 'Tips for Professionals and Companies',
  'Registrar Empresa': 'Register Company',
  'Planes y Precios': 'Plans and Pricing',
  'Publicar Oferta': 'Post Job',
  'Quiénes Somos': 'About Us',
  'Términos y Condiciones': 'Terms and Conditions',
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
  Apellido: 'Last Name',
  Teléfono: 'Phone',
  Ubicación: 'Location',
  'Título profesional': 'Professional title',
  'Resumen profesional': 'Professional summary',
  'Skills separadas por coma (ej: React, Node.js, SQL)': 'Skills separated by commas (e.g., React, Node.js, SQL)',
  Idiomas: 'Languages',
  'Idiomas separados por coma (ej: Español, Inglés, Portugués)': 'Languages separated by commas (e.g., Spanish, English, Portuguese)',
  'LinkedIn URL': 'LinkedIn URL',
  'Portfolio URL': 'Portfolio URL',
  'Guardando...': 'Saving...',
  'Guardar cambios': 'Save changes',
  Pendiente: 'Pending',
  'En revisión': 'In review',
  Preseleccionado: 'Shortlisted',
  Entrevistado: 'Interviewed',
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
  Suscripción: 'Subscription',
  Inactiva: 'Inactive',
  'Tu empresa está bloqueada por falta de suscripción activa.': 'Your company is blocked due to no active subscription.',
  'Activar suscripción': 'Activate subscription',
  'Crear oferta': 'Create job',
  'Gestionar ofertas': 'Manage jobs',
  Suscripciones: 'Subscriptions',
  'No se pudieron cargar tus ofertas': 'Could not load your jobs',
  '¿Eliminar esta oferta laboral?': 'Delete this job posting?',
  'Oferta eliminada': 'Job deleted',
  'No se pudo eliminar la oferta': 'Could not delete job',
  'Cargando ofertas...': 'Loading jobs...',
  'Mis Ofertas Laborales': 'My Job Posts',
  'Nueva oferta': 'New job',
  'No tenés ofertas publicadas todavía.': "You don't have job posts yet.",
  'Crear primera oferta': 'Create first job',
  Activa: 'Active',
  'Postulaciones: ': 'Applications: ',
  'Creada: ': 'Created: ',
  Editar: 'Edit',
  'Ver postulantes': 'View applicants',
  'Eliminando...': 'Deleting...',
  Eliminar: 'Delete',
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
  Pasantía: 'Internship',
  Presencial: 'On-site',
  Remoto: 'Remote',
  Híbrido: 'Hybrid',
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
  Idioma: 'Language',
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
  Inicio: 'Home',
  Blog: 'Blog',
  Páginas: 'Pages',
  La: 'The',
  'Forma Más Fácil': 'Easiest Way',
  'de Conseguir Tu Nuevo Trabajo': 'to Get Your New Job',
  'Cada mes, más de 3 millones de personas buscan trabajo en nuestra plataforma, realizando más de 140.000 postulaciones cada día':
    'Every month, more than 3 million people search for jobs on our platform, submitting over 140,000 applications each day.',
  Industria: 'Industry',
  Profesiones: 'Professions',
  Tecnología: 'Technology',
  Marketing: 'Marketing',
  Finanzas: 'Finance',
  Salud: 'Healthcare',
  Córdoba: 'Cordoba',
  Rosario: 'Rosario',
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
  'Planes y precios en versiÃ³n resumida': 'Plans and pricing summary',
  '*Incluye 2 meses gratis en la inscripciÃ³n inicial': '*Includes 2 free months in the initial registration',
  '*Beneficios por calidad de servicios y referidos en planes pagos.': '*Benefits for service quality and referrals on paid plans.',
  'Ver planes y precios': 'View plans and pricing',
  'Solo por tiempo limitado': 'Limited-time offer',
  Recomendado: 'Recommended',
  'Mejor relaciÃ³n precio-tiempo': 'Best price-time ratio',
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
  'MÃ¡s tiempo para contratar sin interrupciones': 'More time to hire without interruptions',
  'PagÃ¡s 12 meses y usÃ¡s 13 meses': 'Pay 12 months and use 13 months',
  'PublicaciÃ³n y gestiÃ³n de postulantes': 'Posting and applicant management',
  'Ideal para validar el servicio': 'Ideal for validating the service',
  'RenovaciÃ³n paga al finalizar': 'Paid renewal at the end',
  'Mayor continuidad de publicaciones': 'Greater posting continuity',
  'Mejor costo por mes': 'Better monthly cost',
  '1 mes adicional sin costo incluido': '1 additional month included at no extra cost',
  'Cobertura anual extendida': 'Extended yearly coverage',
  'ElegÃ­ el plan que mejor se adapte al ritmo de contrataciÃ³n de tu empresa.': 'Choose the plan that best fits your company hiring pace.',
  'Condiciones comerciales': 'Commercial terms',
  'Condiciones comerciales solo por tiempo limitado.': 'Commercial terms for a limited time only.',
  'InscripciÃ³n inicial: 2 meses gratis en tu primera vez en la plataforma.': 'Initial registration: 2 free months on your first time on the platform.',
  'Periodo de renovaciÃ³n: todas las renovaciones son pagas en cualquiera de sus formas.': 'Renewal period: all renewals are paid under any modality.',
  'Reconocimiento a la calidad: el empleador mejor calificado al finalizar su perÃ­odo pago recibe 2 meses sin costo.': 'Quality recognition: the highest-rated employer receives 2 months at no cost after its paid period.',
  'Programa de referidos: por cada nueva empresa que se inscriba con plan pago, obtenÃ©s 2 meses gratis.': 'Referral program: for each new company that signs up with a paid plan, you get 2 free months.',
  'Empezar ahora': 'Start now',
  'Â¿Ya tenÃ©s cuenta de empresa?': 'Do you already have a company account?',
  'Iniciar sesiÃ³n': 'Log in',
  'Seleccione el plan que mejor se adapte a su empresa': 'Select the plan that best fits your company',
  'Ideal para empezar': 'Ideal to start',
  'La mejor relaciÃ³n precio-valor': 'Best price-value ratio',
  'Para empresas en crecimiento': 'For growing companies',
  'No se pudieron cargar los planes': 'Could not load plans',
  'Cargando planes...': 'Loading plans...',
  'Valor regular:': 'Regular price:',
  'Activando...': 'Activating...',
  'Seleccionar plan': 'Select plan',
  'No se requiere tarjeta de crÃ©dito durante el perÃ­odo de lanzamiento. PodÃ©s cambiar de plan en cualquier momento desde tu panel de empresa.':
    'No credit card is required during the launch period. You can change plan at any time from your company dashboard.',
  'PrÃ³ximamente: pagos seguros con Mercado Pago.': 'Coming soon: secure payments with Mercado Pago.',
  'No se requiere tarjeta de crédito durante el período de lanzamiento. Podés cambiar de plan en cualquier momento desde tu panel de empresa.':
    'No credit card is required during the launch period. You can change plan at any time from your company dashboard.',
  'Próximamente: pagos seguros con Mercado Pago.': 'Coming soon: secure payments with Mercado Pago.',
  'SuscripciÃ³n activada': 'Subscription activated',
  'SuscripciÃ³n cancelada': 'Subscription canceled',
  'Â¿Cancelar la suscripciÃ³n activa?': 'Cancel active subscription?',
  'Suscripción activada': 'Subscription activated',
  'Suscripción cancelada': 'Subscription canceled',
  '¿Cancelar la suscripción activa?': 'Cancel active subscription?',
  'POR TIEMPO LIMITADO': 'LIMITED TIME',
  'Tu empresa se registrÃ³ con un plan gratuito de 2 meses hasta el ': 'Your company was registered with a free 2-month plan until ',
  'Luego deberÃ¡s cambiar a un plan pago de la lista para continuar sin interrupciones.':
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
  'Cancelar suscripciÃ³n': 'Cancel subscription',
  'Cancelar suscripción': 'Cancel subscription',
  'Planes disponibles': 'Available plans',
  'Procesando...': 'Processing...',
  'Activar plan': 'Activate plan',
  Historial: 'History',
  'Sin historial de suscripciones.': 'No subscription history.',
  'Prueba 2 meses': '2-Month Trial',
  'Gana más': 'Earn more',
  'Haciendo menos': 'Doing less',
  'Cada mes, más de 3 millones de personas buscan trabajo en línea, realizando más de 140.000 postulaciones':
    'Every month, more than 3 million people search for jobs online, making more than 140,000 applications.',
  Categoría: 'Category',
  'Buscar Trabajo': 'Search Jobs',
  'Simplifica tu búsqueda de trabajo buscando por categorías': 'Simplify your job search by browsing categories',
  'Explora las ofertas laborales': 'Explore job offers',
  'Crear Cuenta de Profesional': 'Create Professional Account',
  'Ofertas Laborales': 'Job Offers',
  'Empresas Registradas': 'Registered Companies',
  'Candidatos Activos': 'Active Candidates',
  'Tasa de Éxito': 'Success Rate',
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
