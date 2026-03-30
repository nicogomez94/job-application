export const JOB_POSTING_LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
  { value: 'pt', label: 'Portugués' },
  { value: 'fr', label: 'Francés' },
  { value: 'de', label: 'Alemán' },
  { value: 'it', label: 'Italiano' },
];

export const JOB_POSTING_LANGUAGE_LABELS = JOB_POSTING_LANGUAGE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const getJobPostingLanguageLabel = (languageCode) => {
  const normalized = String(languageCode || '').trim().toLowerCase();
  return JOB_POSTING_LANGUAGE_LABELS[normalized] || (languageCode ? String(languageCode) : 'No definido');
};
