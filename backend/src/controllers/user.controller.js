const prisma = require('../config/database');

// Obtener perfil de usuario
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        applications: {
          include: {
            jobOffer: {
              include: {
                company: {
                  select: {
                    id: true,
                    companyName: true,
                    companyLogo: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Remover password
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar perfil de usuario
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      title,
      bio,
      experience,
      education,
      skills,
      location,
      linkedinUrl,
      portfolioUrl,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        phone,
        title,
        bio,
        experience,
        education,
        skills,
        location,
        linkedinUrl,
        portfolioUrl,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImage: true,
        title: true,
        bio: true,
        experience: true,
        education: true,
        skills: true,
        cvUrl: true,
        location: true,
        linkedinUrl: true,
        portfolioUrl: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// Subir CV
exports.uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const cvUrl = `/uploads/cvs/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { cvUrl },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        cvUrl: true,
      },
    });

    res.json({
      message: 'CV subido exitosamente',
      cvUrl: updatedUser.cvUrl,
    });
  } catch (error) {
    console.error('Error en uploadCV:', error);
    res.status(500).json({ error: 'Error al subir CV' });
  }
};

// Subir foto de perfil
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const profileImage = `/uploads/profiles/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { profileImage },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
      },
    });

    res.json({
      message: 'Foto de perfil actualizada',
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error('Error en uploadProfileImage:', error);
    res.status(500).json({ error: 'Error al subir foto' });
  }
};

// Obtener postulaciones del usuario
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: {
        jobOffer: {
          include: {
            company: {
              select: {
                id: true,
                companyName: true,
                companyLogo: true,
                location: true,
              },
            },
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(applications);
  } catch (error) {
    console.error('Error en getMyApplications:', error);
    res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
};

// Eliminar cuenta de usuario
exports.deleteAccount = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.user.id },
    });

    res.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteAccount:', error);
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
};
