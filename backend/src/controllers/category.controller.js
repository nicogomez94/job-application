const prisma = require('../config/database');

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    const activeJobOfferFilter = {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    };

    const [categories, activeOffersByCategory] = await Promise.all([
      prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
        include: {
          _count: {
            select: { jobOffers: true },
          },
        },
      }),
      prisma.jobOffer.groupBy({
        by: ['categoryId'],
        where: activeJobOfferFilter,
        _count: {
          _all: true,
        },
      }),
    ]);

    const activeOffersMap = activeOffersByCategory.reduce((acc, item) => {
      acc[item.categoryId] = item._count?._all || 0;
      return acc;
    }, {});

    const categoriesWithActiveCount = categories.map((category) => ({
      ...category,
      activeJobOffersCount: activeOffersMap[category.id] || 0,
    }));

    res.json(categoriesWithActiveCount);
  } catch (error) {
    console.error('Error en getAllCategories:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Obtener una categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { jobOffers: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error en getCategoryById:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
};

// Crear categoría (solo admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
      },
    });

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      category,
    });
  } catch (error) {
    console.error('Error en createCategory:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre o slug' });
    }
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

// Actualizar categoría (solo admin)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        icon,
      },
    });

    res.json({
      message: 'Categoría actualizada exitosamente',
      category,
    });
  } catch (error) {
    console.error('Error en updateCategory:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

// Eliminar categoría (solo admin)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si hay ofertas asociadas
    const jobOffersCount = await prisma.jobOffer.count({
      where: { categoryId: id },
    });

    if (jobOffersCount > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar la categoría porque tiene ofertas asociadas',
        jobOffersCount,
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteCategory:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};
