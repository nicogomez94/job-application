const prisma = require('../config/database');
const { repairMojibake, repairMojibakeDeep } = require('../utils/textEncoding');

const getBlockInfo = (block) => {
  if (!block) return null;
  const blockedByMe = block.blockedBy === 'PATIENT';

  return {
    id: block.id,
    blockedBy: block.blockedBy,
    blockedByMe,
    blockedMe: !blockedByMe,
    createdAt: block.createdAt,
    message: blockedByMe
      ? 'Bloqueaste a este usuario. Los datos de contacto ya no están disponibles.'
      : 'Este usuario te bloqueó. Ya no podés ver sus datos.',
  };
};

// PUBLIC LISTING
// GET /api/psychologists?search=ana&language=Español&country=Argentina&page=1&limit=20
exports.list = async (req, res) => {
  try {
    const { search, language, country, page = 1, limit = 20 } = req.query;
    const requestedSearch = repairMojibake(search);
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
        region: true,
        practiceProvince: true,
        licenseNumber: true,
        specialties: true,
        languages: true,
        ageRanges: true,
        yearsExperience: true,
        remoteModality: true,
        registrationType: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const blockedPsychologistIds = new Set();
    if (req.user?.type === 'patient') {
      const blocks = await prisma.psychologistPatientBlock.findMany({
        where: { patientId: req.user.id },
        select: { psychologistId: true },
      });
      blocks.forEach((block) => blockedPsychologistIds.add(block.psychologistId));
    }

    const now = new Date();
    const normalized = psychologists
      .filter((entry) => !blockedPsychologistIds.has(entry.id))
      .map((entry) => {
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

    const searchTerm = normalizeSearchText(requestedSearch);

    const filtered = normalized.filter((psychologist) => {
      const searchableText = normalizeSearchText([
        psychologist.displayName,
        psychologist.firstName,
        psychologist.lastName,
        psychologist.country,
        psychologist.region,
        psychologist.practiceProvince,
        psychologist.licenseNumber,
        psychologist.specialties,
        psychologist.languages,
        psychologist.ageRanges,
        psychologist.yearsExperience,
      ]);
      const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
      const matchesLanguage = !requestedLanguage || psychologist.languages?.includes(requestedLanguage);
      const matchesCountry = !requestedCountry
        || psychologist.country?.toLowerCase().includes(requestedCountry.toLowerCase());
      return matchesSearch && matchesLanguage && matchesCountry;
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

const normalizeSearchText = (value) => {
  const text = Array.isArray(value) ? value.flat(Infinity).join(' ') : String(value || '');

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
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

    if (req.user?.type === 'patient') {
      const block = await prisma.psychologistPatientBlock.findUnique({
        where: {
          patientId_psychologistId: {
            patientId: req.user.id,
            psychologistId: id,
          },
        },
      });

      if (block) {
        return res.json({
          id: psychologist.id,
          firstName: psychologist.firstName,
          lastName: psychologist.lastName,
          displayName: psychologist.displayName,
          isBlocked: true,
          blockInfo: getBlockInfo(block),
        });
      }
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
