import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import './Psicologos.css';

const AR_DOCUMENT_TYPES = [
  { key: 'DNI', label: 'Foto/escaneo del DNI (frente y dorso)' },
  { key: 'TITLE', label: 'Título de psicólogo (frente y dorso)' },
  { key: 'LICENSE', label: 'Certificado de matrícula profesional vigente' },
  { key: 'CUIT', label: 'Constancia de CUIT/CUIL' },
  { key: 'GOOD_CONDUCT', label: 'Certificado de buena conducta (si aplica en tu provincia)' },
  { key: 'SPECIALTY_CERT', label: 'Certificado por especialidad declarada (uno por especialidad)' },
];

const INTL_DOCUMENT_TYPES = [
  { key: 'ID', label: 'Documento de identidad / Pasaporte / Cédula (frente y dorso)' },
  { key: 'TITLE', label: 'Título profesional o diploma (frente y dorso)' },
  { key: 'LICENSE', label: 'Certificado de licencia / colegiación vigente' },
  { key: 'TAX_ID', label: 'Comprobante de identificación fiscal (si aplica)' },
  { key: 'CRIMINAL_RECORD', label: 'Certificado de antecedentes penales o de buena conducta' },
  { key: 'SPECIALTY_CERT', label: 'Certificado por especialidad declarada' },
];

export default function RegisterPsychologistDocs() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isAR = user?.registrationType === 'ARGENTINA';
  const docTypes = isAR ? AR_DOCUMENT_TYPES : INTL_DOCUMENT_TYPES;

  const [files, setFiles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileAdd = (e, docType) => {
    const selected = Array.from(e.target.files);
    const newFiles = selected.map((f) => ({ file: f, docType, id: Math.random() }));
    setFiles((prev) => [...prev, ...newFiles]);
    setDocumentTypes((prev) => [...prev, ...selected.map(() => docType)]);
    e.target.value = '';
  };

  const removeFile = (id) => {
    const idx = files.findIndex((f) => f.id === id);
    if (idx === -1) return;
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setDocumentTypes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error('Subí al menos un documento');
      return;
    }
    setLoading(true);
    try {
      await psychologistService.uploadDocuments(
        files.map((f) => f.file),
        files.map((f) => f.docType)
      );
      navigate('/register/psicologo/confirmacion');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Error al subir documentos';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="psico-register-page">
      <div className="psico-register-container">
        <h1>Carga de documentos</h1>
        <p className="psico-docs-subtitle">
          Subí los documentos que acrediten tu identidad y habilitación profesional.
          El equipo los revisará en aproximadamente 5 días hábiles.
        </p>

        <div className="psico-docs-types">
          {docTypes.map((dt) => (
            <div key={dt.key} className="psico-doc-type-row">
              <div className="psico-doc-type-label">
                <FileText size={16} />
                <span>{dt.label}</span>
                <small>PDF, JPG o PNG · máx. 5 MB</small>
              </div>
              <label className="psico-doc-upload-btn">
                <Upload size={14} /> Agregar archivo
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => handleFileAdd(e, dt.key)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          ))}
        </div>

        {files.length > 0 && (
          <div className="psico-docs-uploaded">
            <h3>Archivos seleccionados ({files.length})</h3>
            <ul>
              {files.map((f) => {
                const label = docTypes.find((d) => d.key === f.docType)?.label || f.docType;
                return (
                  <li key={f.id} className="psico-doc-file-row">
                    <FileText size={14} />
                    <span className="psico-doc-file-name">{f.file.name}</span>
                    <span className="psico-doc-file-size">{formatBytes(f.file.size)}</span>
                    <span className="psico-doc-file-type">{label}</span>
                    <button type="button" onClick={() => removeFile(f.id)} className="psico-doc-remove">
                      <X size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="psico-form-actions">
          <button
            type="button"
            className="psico-btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Atrás
          </button>
          <button
            type="button"
            className="psico-btn-primary"
            onClick={handleSubmit}
            disabled={loading || files.length === 0}
          >
            {loading ? 'Subiendo...' : 'Enviar documentos'}
          </button>
        </div>
      </div>
    </div>
  );
}
