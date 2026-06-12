const CURRENT_LEGAL_VERSION = '2026-06-12';

const DOCUMENTS = {
  patient: [
    {
      key: 'terms',
      title: 'Términos y Condiciones',
      route: '/psicologos/terminos-y-condiciones',
    },
    {
      key: 'privacy',
      title: 'Política de Privacidad',
      route: '/psicologos/politicas-de-privacidad',
    },
    {
      key: 'agreement',
      title: 'Acuerdo de Aceptación del Usuario / Paciente',
      route: '/psicologos/acuerdo-aceptacion-paciente',
    },
  ],
  psychologist: [
    {
      key: 'terms',
      title: 'Términos y Condiciones',
      route: '/psicologos/terminos-y-condiciones',
    },
    {
      key: 'privacy',
      title: 'Política de Privacidad',
      route: '/psicologos/politicas-de-privacidad',
    },
    {
      key: 'agreement',
      title: 'Acuerdo de Aceptación del Profesional Psicólogo',
      route: '/psicologos/acuerdo-aceptacion-psicologo',
    },
  ],
};

const getRequestIp = (req) => {
  const forwardedFor = req.headers?.['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || null;
};

const buildConsentMetadata = ({ role, req }) => {
  const documents = DOCUMENTS[role] || [];

  return {
    role,
    version: CURRENT_LEGAL_VERSION,
    acceptedAt: new Date().toISOString(),
    ip: getRequestIp(req),
    userAgent: req.get('user-agent') || null,
    documents: documents.map((document) => ({
      ...document,
      version: CURRENT_LEGAL_VERSION,
      accepted: true,
    })),
  };
};

module.exports = {
  CURRENT_LEGAL_VERSION,
  buildConsentMetadata,
};
