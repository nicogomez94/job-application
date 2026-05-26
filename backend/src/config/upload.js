const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorios si no existen
const createUploadDirs = () => {
  const dirs = [
    './uploads/cvs',
    './uploads/files',
    './uploads/profiles',
    './uploads/logos',
    './uploads/psychologist-profiles',
    './uploads/psychologist-docs',
    './uploads/patient-profiles',
  ];
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
    } else if (file.fieldname === 'file') {
      uploadPath += 'files/';
    } else if (file.fieldname === 'profileImage') {
      uploadPath += 'profiles/';
    } else if (file.fieldname === 'companyLogo') {
      uploadPath += 'logos/';
    } else if (file.fieldname === 'psychologistProfile') {
      uploadPath += 'psychologist-profiles/';
    } else if (file.fieldname === 'patientProfile') {
      uploadPath += 'patient-profiles/';
    } else if (file.fieldname === 'psychologistDoc') {
      uploadPath += 'psychologist-docs/';
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
    cb(null, true);
  } else if (file.fieldname === 'profileImage' || file.fieldname === 'companyLogo' || file.fieldname === 'psychologistProfile' || file.fieldname === 'patientProfile') {
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
