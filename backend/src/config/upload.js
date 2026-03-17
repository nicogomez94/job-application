const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorios si no existen
const createUploadDirs = () => {
  const dirs = ['./uploads/cvs', './uploads/profiles', './uploads/logos'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = './uploads/';
    
    if (file.fieldname === 'cv') {
      uploadPath += 'cvs/';
    } else if (file.fieldname === 'profileImage') {
      uploadPath += 'profiles/';
    } else if (file.fieldname === 'companyLogo') {
      uploadPath += 'logos/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'cv') {
    const allowedCvMimeTypes = new Set([
      'application/pdf',
      'image/jpeg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);
    const hasAllowedCvExtension = /\.(pdf|jpe?g|docx?)$/i.test(file.originalname);

    // Permitir PDF, JPG/JPEG y Word para CVs
    if (allowedCvMimeTypes.has(file.mimetype) || hasAllowedCvExtension) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF, JPG o Word para CVs'), false);
    }
  } else if (file.fieldname === 'profileImage' || file.fieldname === 'companyLogo') {
    // Solo imágenes para perfiles y logos
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB por defecto
  },
  fileFilter: fileFilter,
});

module.exports = upload;
