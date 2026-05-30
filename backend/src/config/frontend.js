const LOCALHOST_FRONTEND_REGEX = /^https?:\/\/localhost:\d+$/i;

const normalizeUrl = (value) => String(value || '').trim().replace(/\/+$/, '');

const getConfiguredFrontendUrl = () => normalizeUrl(process.env.FRONTEND_URL);

const getConfiguredFrontendUrls = () => {
  const urls = [
    getConfiguredFrontendUrl(),
    ...String(process.env.FRONTEND_URLS || '')
      .split(',')
      .map(normalizeUrl),
  ].filter(Boolean);

  const allowedUrls = new Set(urls);

  urls.forEach((url) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      if (hostname.startsWith('www.')) {
        parsedUrl.hostname = hostname.replace(/^www\./i, '');
        allowedUrls.add(normalizeUrl(parsedUrl.toString()));
        return;
      }

      parsedUrl.hostname = `www.${hostname}`;
      allowedUrls.add(normalizeUrl(parsedUrl.toString()));
    } catch (error) {
      console.warn(`FRONTEND_URL inválida ignorada: ${url}`);
    }
  });

  return allowedUrls;
};

const getDefaultFrontendUrl = () => getConfiguredFrontendUrl() || 'http://localhost:5173';

const isAllowedFrontendOrigin = (origin) => {
  const normalizedOrigin = normalizeUrl(origin);
  if (!normalizedOrigin) return false;

  if (getConfiguredFrontendUrls().has(normalizedOrigin)) {
    return true;
  }

  return LOCALHOST_FRONTEND_REGEX.test(normalizedOrigin);
};

module.exports = {
  getConfiguredFrontendUrls,
  getConfiguredFrontendUrl,
  getDefaultFrontendUrl,
  isAllowedFrontendOrigin,
  normalizeUrl,
};
