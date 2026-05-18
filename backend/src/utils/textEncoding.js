const hasMojibakeMarkers = (value) => /[\u00C2\u00C3\uFFFD]/.test(value);

const repairMojibake = (value) => {
  if (typeof value !== 'string' || !hasMojibakeMarkers(value)) return value;

  let next = value;
  for (let i = 0; i < 3; i += 1) {
    if (!hasMojibakeMarkers(next)) break;

    try {
      const repaired = Buffer.from(next, 'latin1').toString('utf8');
      if (!repaired || repaired === next) break;
      next = repaired;
    } catch {
      break;
    }
  }

  return next;
};

const repairMojibakeDeep = (value) => {
  if (Array.isArray(value)) {
    return value.map(repairMojibakeDeep);
  }

  if (value instanceof Date) {
    return value;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, repairMojibakeDeep(entryValue)])
    );
  }

  return repairMojibake(value);
};

module.exports = {
  repairMojibake,
  repairMojibakeDeep,
};
