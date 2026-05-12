const hasMojibakeMarkers = (value) => /[\u00C2\u00C3\uFFFD]/.test(value);

export const repairMojibake = (value) => {
  if (typeof value !== 'string' || !hasMojibakeMarkers(value)) return value;

  let next = value;
  for (let i = 0; i < 3; i += 1) {
    if (!hasMojibakeMarkers(next)) break;

    try {
      const bytes = Uint8Array.from(next, (char) => char.charCodeAt(0) & 0xff);
      const repaired = new TextDecoder('utf-8').decode(bytes);
      if (!repaired || repaired === next) break;
      next = repaired;
    } catch {
      break;
    }
  }

  return next;
};

export const repairMojibakeDeep = (value) => {
  if (Array.isArray(value)) {
    return value.map(repairMojibakeDeep);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, repairMojibakeDeep(entryValue)])
    );
  }

  return repairMojibake(value);
};
