const prisma = require('../config/database');
const { repairMojibake, repairMojibakeDeep } = require('../utils/textEncoding');

// PUBLIC LISTING
// GET /api/psychologists?language=Español&country=Argentina&page=1&limit=20
exports.list = async (req, res) => {
  try {
    const { language, country, page = 1, limit = 20 } = req.query;
    const requestedLanguage = repairMojibake(language);
    const requestedCountry = repairMojibake(country);

    const psychologists = await prisma.psychologist.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        displayName: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        profileImage: true,
        country: true,
        specialties: true,
        languages: true,
        ageRanges: true,
        yearsExperience: true,
        registrationType: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    const normalized = psychologists.map((entry) => {
      const p = repairMojibakeDeep(entry);
      let age = null;

      if (p.dateOfBirth) {
        const dob = new Date(p.dateOfBirth);
        age = now.getFullYear() - dob.getFullYear();
        const monthDiff = now.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
          age -= 1;
        }
      }

      return { ...p, age, dateOfBirth: undefined };
    });

    const filtered = normalized.filter((psychologist) => {
      const matchesLanguage = !requestedLanguage || psychologist.languages?.includes(requestedLanguage);
      const matchesCountry = !requestedCountry
        || psychologist.country?.toLowerCase().includes(requestedCountry.toLowerCase());
      return matchesLanguage && matchesCountry;
    });

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const start = (pageNumber - 1) * pageSize;
    const result = filtered.slice(start, start + pageSize);

    res.json({ total: filtered.length, page: pageNumber, limit: pageSize, psychologists: result });
  } catch (error) {
    console.error('Error en list psychologists:', error);
    res.status(500).json({ error: 'Error al obtener psicólogos' });
  }
};

// PUBLIC PROFILE
// GET /api/psychologists/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const psychologist = await prisma.psychologist.findFirst({
      where: { id, status: 'ACTIVE' },
      select: {
        id: true,
        displayName: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        profileImage: true,
        country: true,
        specialties: true,
        languages: true,
        ageRanges: true,
        yearsExperience: true,
        remoteModality: true,
        bio: true,
        registrationType: true,
        universityDegree: true,
        universityName: true,
        licenseNumber: true,
        practiceProvince: true,
        region: true,
      },
    });

    if (!psychologist) {
      return res.status(404).json({ error: 'Psicólogo no encontrado' });
    }

    const normalized = repairMojibakeDeep(psychologist);
    const now = new Date();
    let age = null;

    if (normalized.dateOfBirth) {
      const dob = new Date(normalized.dateOfBirth);
      age = now.getFullYear() - dob.getFullYear();
      const monthDiff = now.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
        age -= 1;
      }
    }

    res.json({ ...normalized, age, dateOfBirth: undefined });
  } catch (error) {
    console.error('Error en getById psychologist:', error);
    res.status(500).json({ error: 'Error al obtener psicólogo' });
  }
};
