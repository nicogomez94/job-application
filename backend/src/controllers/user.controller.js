const fs = require('fs');
const path = require('path');
const prisma = require('../config/database');

const MAX_OTHER_FILES = 4;

const normalizeUploadedFiles = (uploadedFiles) => {
  if (!Array.isArray(uploadedFiles)) return [];
  return uploadedFiles
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const url = typeof item.url === 'string' ? item.url.trim() : '';
      const name = typeof item.name === 'string' ? item.name.trim() : '';
      if (!url) return null;
      return {
        url,
        name: name || url.split('/').pop() || 'archivo',
      };
    })
    .filter(Boolean);
};

const removeUploadedFile = (assetPath) => {
  if (!assetPath || typeof assetPath !== 'string') return;
  const normalized = assetPath.replace(/^\/+/, '');
  const absolutePath = path.resolve(process.cwd(), normalized);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

// Obtener perfil de usuario
exports.getProfile = async (req, res) => {
  try {
    const [user, userRatingAggregate] = await Promise.all([
      prisma.user.findUnique({
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
      }),
      prisma.application.aggregate({
        where: {
          userId: req.user.id,
          status: 'ACCEPTED',
          ratingByCompany: { not: null },
          jobOffer: {
            workType: 'FREELANCE',
          },
        },
        _avg: {
          ratingByCompany: true,
        },
        _count: {
          ratingByCompany: true,
        },
      }),
    ]);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Remover password
    const { password, ...userWithoutPassword } = user;
    userWithoutPassword.uploadedFiles = normalizeUploadedFiles(userWithoutPassword.uploadedFiles);
    const average = Number(userRatingAggregate?._avg?.ratingByCompany || 0);
    const total = Number(userRatingAggregate?._count?.ratingByCompany || 0);

    res.json({
      ...userWithoutPassword,
      ratingSummary: {
        average,
        total,
      },
    });
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
      languages,
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
        languages,
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
        languages: true,
        cvUrl: true,
        uploadedFiles: true,
        location: true,
        linkedinUrl: true,
        portfolioUrl: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        ...updatedUser,
        uploadedFiles: normalizeUploadedFiles(updatedUser.uploadedFiles),
      },
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

    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { cvUrl: true },
    });

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

    if (currentUser?.cvUrl && currentUser.cvUrl !== cvUrl) {
      try {
        removeUploadedFile(currentUser.cvUrl);
      } catch (fileError) {
        console.warn('No se pudo eliminar el CV anterior:', fileError.message);
      }
    }
  } catch (error) {
    console.error('Error en uploadCV:', error);
    res.status(500).json({ error: 'Error al subir CV' });
  }
};

// Eliminar CV
exports.deleteCV = async (req, res) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { cvUrl: true },
    });

    if (!currentUser?.cvUrl) {
      return res.status(400).json({ error: 'No hay CV cargado para eliminar' });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { cvUrl: null },
      select: { id: true },
    });

    try {
      removeUploadedFile(currentUser.cvUrl);
    } catch (fileError) {
      console.warn('No se pudo eliminar el CV del sistema:', fileError.message);
    }

    res.json({ message: 'CV eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteCV:', error);
    res.status(500).json({ error: 'Error al eliminar CV' });
  }
};

// Subir archivo varios
exports.uploadOtherFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { uploadedFiles: true },
    });

    const currentFiles = normalizeUploadedFiles(user?.uploadedFiles);
    if (currentFiles.length >= MAX_OTHER_FILES) {
      return res.status(400).json({ error: `Podés subir hasta ${MAX_OTHER_FILES} archivos varios` });
    }

    const nextFiles = [
      ...currentFiles,
      {
        url: `/uploads/files/${req.file.filename}`,
        name: req.file.originalname || req.file.filename,
      },
    ];

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { uploadedFiles: nextFiles },
      select: { uploadedFiles: true },
    });

    res.json({
      message: 'Archivo subido exitosamente',
      uploadedFiles: normalizeUploadedFiles(updatedUser.uploadedFiles),
    });
  } catch (error) {
    console.error('Error en uploadOtherFile:', error);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
};

// Eliminar archivo varios por índice
exports.deleteOtherFile = async (req, res) => {
  try {
    const index = Number.parseInt(req.params.index, 10);
    if (!Number.isInteger(index) || index < 0) {
      return res.status(400).json({ error: 'Índice de archivo inválido' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { uploadedFiles: true },
    });

    const currentFiles = normalizeUploadedFiles(user?.uploadedFiles);
    if (!currentFiles[index]) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    const fileToDelete = currentFiles[index];
    const nextFiles = currentFiles.filter((_, idx) => idx !== index);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { uploadedFiles: nextFiles.length ? nextFiles : null },
      select: { uploadedFiles: true },
    });

    try {
      removeUploadedFile(fileToDelete.url);
    } catch (fileError) {
      console.warn('No se pudo eliminar el archivo del sistema:', fileError.message);
    }

    res.json({
      message: 'Archivo eliminado exitosamente',
      uploadedFiles: normalizeUploadedFiles(updatedUser.uploadedFiles),
    });
  } catch (error) {
    console.error('Error en deleteOtherFile:', error);
    res.status(500).json({ error: 'Error al eliminar archivo' });
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
