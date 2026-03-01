const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken } = require('../config/jwt');

// ==================== USUARIOS ====================

// Registro de usuario
exports.registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });

    // Generar token
    const token = generateToken({ id: user.id, type: 'user' });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      token,
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login de usuario
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken({ id: user.id, type: 'user' });

    // Remover password de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// ==================== EMPRESAS ====================

// Registro de empresa
exports.registerCompany = async (req, res) => {
  try {
    const { email, password, companyName, description, website, location, industry, size } = req.body;

    // Verificar si la empresa ya existe
    const existingCompany = await prisma.company.findUnique({ where: { email } });
    if (existingCompany) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear empresa
    const company = await prisma.company.create({
      data: {
        email,
        password: hashedPassword,
        companyName,
        description,
        website,
        location,
        industry,
        size,
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        description: true,
        website: true,
        location: true,
        industry: true,
        size: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Generar token
    const token = generateToken({ id: company.id, type: 'company' });

    res.status(201).json({
      message: 'Empresa registrada exitosamente',
      company,
      token,
    });
  } catch (error) {
    console.error('Error en registerCompany:', error);
    res.status(500).json({ error: 'Error al registrar empresa' });
  }
};

// Login de empresa
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar empresa
    const company = await prisma.company.findUnique({ where: { email } });
    if (!company || !company.password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar si está bloqueada
    if (company.isBlocked) {
      return res.status(403).json({ 
        error: 'Cuenta bloqueada',
        message: 'Tu suscripción ha vencido. Renueva tu plan para continuar.'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, company.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken({ id: company.id, type: 'company' });

    // Remover password de la respuesta
    const { password: _, ...companyWithoutPassword } = company;

    res.json({
      message: 'Login exitoso',
      company: companyWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error en loginCompany:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// ==================== ADMINISTRADORES ====================

// Login de admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken({ id: admin.id, type: 'admin' });

    // Remover password de la respuesta
    const { password: _, ...adminWithoutPassword } = admin;

    res.json({
      message: 'Login exitoso',
      admin: adminWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error en loginAdmin:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// ==================== PERFIL ====================

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const { id, type } = req.user;
    let profile;

    if (type === 'user') {
      profile = await prisma.user.findUnique({
        where: { id },
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
          createdAt: true,
          updatedAt: true,
        },
      });
    } else if (type === 'company') {
      profile = await prisma.company.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          companyName: true,
          companyLogo: true,
          description: true,
          website: true,
          location: true,
          industry: true,
          size: true,
          isActive: true,
          isBlocked: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else if (type === 'admin') {
      profile = await prisma.admin.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json({ profile, type });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
