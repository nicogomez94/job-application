const LOCALHOST_FRONTEND_REGEX = /^https?:\/\/localhost:\d+$/i;

const normalizeUrl = (value) => String(value || '').trim().replace(/\/+$/, '');

const getConfiguredFrontendUrl = () => normalizeUrl(process.env.FRONTEND_URL);

const getDefaultFrontendUrl = () => getConfiguredFrontendUrl() || 'http://localhost:5173';

const isAllowedFrontendOrigin = (origin) => {
  const normalizedOrigin = normalizeUrl(origin);
  if (!normalizedOrigin) return false;

  const configuredFrontendUrl = getConfiguredFrontendUrl();
  if (configuredFrontendUrl && normalizedOrigin === configuredFrontendUrl) {
    return true;
  }

  return LOCALHOST_FRONTEND_REGEX.test(normalizedOrigin);
};

module.exports = {
  getConfiguredFrontendUrl,
  getDefaultFrontendUrl,
  isAllowedFrontendOrigin,
  normalizeUrl,
};
