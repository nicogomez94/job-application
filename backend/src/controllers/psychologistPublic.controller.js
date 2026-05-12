const prisma = require('../config/database');
const { BACKEND_BASE_URL } = process.env;

// ─── PUBLIC LISTING ──────────────────────────────────────────────────────────
// GET /api/psychologists?language=Español&country=Argentina&page=1&limit=20
exports.list = async (req, res) => {
  try {
    const { language, country, page = 1, limit = 20 } = req.query;

    const where = { status: 'ACTIVE' };

    if (language) {
      where.languages = { has: language };
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [total, psychologists] = await Promise.all([
      prisma.psychologist.count({ where }),
      prisma.psychologist.findMany({
        where,
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
          phone: true,
          contactEmail: true,
          ageRanges: true,
          yearsExperience: true,
          registrationType: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    // Calculate age from dateOfBirth
    const now = new Date();
    const result = psychologists.map((p) => {
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

    res.json({ total, page: Number(page), limit: Number(limit), psychologists: result });
  } catch (error) {
    console.error('Error en list psychologists:', error);
    res.status(500).json({ error: 'Error al obtener psicólogos' });
  }
};

// ─── PUBLIC PROFILE ──────────────────────────────────────────────────────────
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
        phone: true,
        contactEmail: true,
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

    const now = new Date();
    let age = null;
    if (psychologist.dateOfBirth) {
      const dob = new Date(psychologist.dateOfBirth);
      age = now.getFullYear() - dob.getFullYear();
      const monthDiff = now.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
        age -= 1;
      }
    }

    res.json({ ...psychologist, age, dateOfBirth: undefined });
  } catch (error) {
    console.error('Error en getById psychologist:', error);
    res.status(500).json({ error: 'Error al obtener psicólogo' });
  }
};
