const { getDefaultFrontendUrl, normalizeUrl } = require('../config/frontend');

const OAUTH_CALLBACK_PATH_REGEX = /^\/api\/auth\/(user|company|admin)\/google\/callback$/i;

const getFrontendBaseUrl = (req) => {
  const envBaseUrl = normalizeUrl(process.env.FRONTEND_URL);
  if (envBaseUrl) return envBaseUrl;

  const forwardedProto = String(req.headers['x-forwarded-proto'] || '')
    .split(',')[0]
    .trim();
  const protocol = forwardedProto || req.protocol || 'http';
  const host = req.get('host');
  if (host) return `${protocol}://${host}`;

  return getDefaultFrontendUrl();
};

const getOAuthFriendlyErrorMessage = (err) => {
  const targetFields = Array.isArray(err?.meta?.target)
    ? err.meta.target.map((field) => String(field).toLowerCase())
    : [];

  if (err?.code === 'P2002' && targetFields.includes('email')) {
    return 'Ese email ya esta registrado. Inicia sesion o recupera tu clave.';
  }

  return err?.message || 'No se pudo completar el login con Google';
};

const tryRedirectOAuthError = (err, req, res) => {
  if (req.method !== 'GET') return false;

  const pathMatch = req.path.match(OAUTH_CALLBACK_PATH_REGEX);
  if (!pathMatch) return false;

  const accountType = String(pathMatch[1]).toLowerCase();
  const params = new URLSearchParams({
    type: accountType,
    error: getOAuthFriendlyErrorMessage(err),
  });
  const redirectUrl = `${getFrontendBaseUrl(req)}/auth/callback?${params.toString()}`;
  res.redirect(redirectUrl);
  return true;
};

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (tryRedirectOAuthError(err, req, res)) {
    return;
  }

  // Error de validacion de Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Ya existe un registro con estos datos',
      field: err.meta?.target,
    });
  }

  // Error de registro no encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro no encontrado',
    });
  }

  // Error de validacion de multer
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'El archivo es demasiado grande',
        maxSize: process.env.MAX_FILE_SIZE,
      });
    }
    return res.status(400).json({ error: err.message });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token invalido' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expirado' });
  }

  // Error generico
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;
