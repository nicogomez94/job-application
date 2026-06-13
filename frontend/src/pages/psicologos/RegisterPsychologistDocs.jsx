import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, RefreshCw, Trash2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService } from '../../services';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import { useAuthStore } from '../../context/authStore';
import './Psicologos.css';

const AR_DOCUMENT_TYPES = [
  { key: 'DNI', label: 'Foto/escaneo del DNI (frente y dorso)' },
  { key: 'TITLE', label: 'Título de psicólogo (frente y dorso)' },
  { key: 'LICENSE', label: 'Certificado de matrícula profesional vigente' },
  { key: 'CUIT', label: 'Constancia de CUIT/CUIL' },
  { key: 'GOOD_CONDUCT', label: 'Certificado de buena conducta (si aplica según país/lugar de terapia)' },
  { key: 'SPECIALTY_CERT', label: 'Certificado por especialidad declarada (si aplica según país/lugar de terapia)' },
];

const INTL_DOCUMENT_TYPES = [
  { key: 'ID', label: 'Documento de identidad / Pasaporte / Cédula (frente y dorso)' },
  { key: 'TITLE', label: 'Título profesional o diploma (frente y dorso)' },
  { key: 'LICENSE', label: 'Certificado de matrícula, licencia o colegiación profesional vigente' },
  { key: 'TAX_ID', label: 'Comprobante de identificación fiscal (si aplica)' },
  { key: 'CRIMINAL_RECORD', label: 'Certificado de antecedentes penales o de buena conducta (si aplica según país/lugar de terapia)' },
  { key: 'SPECIALTY_CERT', label: 'Certificado por especialidad declarada (si aplica según país/lugar de terapia)' },
];

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const toAssetUrl = (p) => {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${BACKEND_BASE_URL}${p}`;
};

export default function RegisterPsychologistDocs() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [registrationType, setRegistrationType] = useState(user?.registrationType || '');
  const isAR = registrationType === 'ARGENTINA';
  const docTypes = isAR ? AR_DOCUMENT_TYPES : INTL_DOCUMENT_TYPES;
  const requiredDocTypes = docTypes.slice(0, 4).map((docType) => docType.key);

  const [files, setFiles] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [psychologistStatus, setPsychologistStatus] = useState(user?.status || '');
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [documentActionId, setDocumentActionId] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const getFileExtension = (fileName) => fileName.split('.').pop()?.toLowerCase() || '';
  const isReviewedStatus = ['APPROVED', 'ACTIVE', 'SUSPENDED'].includes(psychologistStatus);

  useEffect(() => {
    const loadExistingDocuments = async () => {
      try {
        const res = await psychologistService.getProfile();
        setExistingDocuments(Array.isArray(res.data?.documents) ? res.data.documents : []);
        setRegistrationType(res.data?.registrationType || user?.registrationType || '');
        setPsychologistStatus(res.data?.status || user?.status || '');
      } catch (error) {
        toast.error(error.response?.data?.error || 'No se pudieron cargar los documentos existentes');
      } finally {
        setLoadingExisting(false);
      }
    };

    loadExistingDocuments();
  }, [user?.registrationType]);

  const validateFiles = (selected, existingCount = files.length) => {
    if (existingCount + selected.length > MAX_FILES) {
      return `Podés subir hasta ${MAX_FILES} archivos en total. Ya tenés ${existingCount} cargado(s) o seleccionado(s).`;
    }

    const invalidType = selected.find((file) => {
      const extension = getFileExtension(file.name);
      return !ALLOWED_EXTENSIONS.includes(extension) && !ALLOWED_MIME_TYPES.includes(file.type);
    });
    if (invalidType) {
      return `El archivo "${invalidType.name}" no tiene un formato permitido. Usá PDF, JPG o PNG.`;
    }

    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      return `El archivo "${oversized.name}" supera el máximo de 5 MB.`;
    }

    return '';
  };

  const getMissingRequiredDocs = (selectedFiles) => {
    if (isReviewedStatus) return [];

    const uploadedTypes = new Set([
      ...existingDocuments.map((document) => document.documentType),
      ...selectedFiles.map((file) => file.docType),
    ]);
    return requiredDocTypes.filter((docType) => !uploadedTypes.has(docType));
  };

  const handleFileAdd = (e, docType) => {
    const selected = Array.from(e.target.files);
    if (selected.length === 0) {
      e.target.value = '';
      return;
    }

    const error = validateFiles(selected, existingDocuments.length + files.length);
    if (error) {
      setValidationMessage(error);
      toast.error(error);
      e.target.value = '';
      return;
    }

    const newFiles = selected.map((f) => ({ file: f, docType, id: Math.random() }));
    setFiles((prev) => [...prev, ...newFiles]);
    setSubmitAttempted(false);
    setValidationMessage('');
    e.target.value = '';
  };

  const handleRemoveSelectedFile = (id) => {
    const idx = files.findIndex((f) => f.id === id);
    if (idx === -1) return;
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReplaceDocument = async (document, e) => {
    const selected = Array.from(e.target.files || []);
    const file = selected[0];
    e.target.value = '';

    if (!file) return;

    const error = validateFiles([file], 0);
    if (error) {
      setValidationMessage(error);
      toast.error(error);
      return;
    }

    const confirmed = window.confirm('¿Está seguro que desea reemplazar el documento seleccionado?');
    if (!confirmed) return;

    const actionId = `replace-${document.id}`;
    setDocumentActionId(actionId);
    setValidationMessage('');

    try {
      const res = await psychologistService.replaceDocument(document.id, file, document.documentType);
      const updatedDocument = res.data?.document;
      if (updatedDocument) {
        setExistingDocuments((prev) =>
          prev.map((item) => (item.id === document.id ? updatedDocument : item))
        );
      }
      if (res.data?.status) {
        setPsychologistStatus(res.data.status);
        updateUser({ status: res.data.status });
      }
      toast.success('Documento reemplazado. Queda pendiente de verificación.');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Error al reemplazar documento';
      setValidationMessage(msg);
      toast.error(msg);
    } finally {
      setDocumentActionId('');
    }
  };

  const handleDeleteDocument = async (document) => {
    const confirmed = window.confirm('¿Querés borrar este documento?');
    if (!confirmed) return;

    const actionId = `delete-${document.id}`;
    setDocumentActionId(actionId);
    setValidationMessage('');

    try {
      const res = await psychologistService.deleteDocument(document.id);
      setExistingDocuments((prev) => prev.filter((item) => item.id !== document.id));
      if (res.data?.status) {
        setPsychologistStatus(res.data.status);
        updateUser({ status: res.data.status });
      }
      toast.success('Documento eliminado.');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Error al eliminar documento';
      setValidationMessage(msg);
      toast.error(msg);
    } finally {
      setDocumentActionId('');
    }
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    if (files.length === 0) {
      const missingRequiredDocs = getMissingRequiredDocs([]);
      if (missingRequiredDocs.length === 0) {
        toast.success('La documentación obligatoria ya está cargada.');
        navigate('/psicologo/dashboard');
        return;
      }

      const message = 'Enviá los 4 primeros archivos obligatorios';
      setValidationMessage(message);
      toast.error(message);
      return;
    }

    const missingRequiredDocs = getMissingRequiredDocs(files);
    if (missingRequiredDocs.length > 0) {
      const missingLabels = missingRequiredDocs
        .map((docType) => docTypes.find((doc) => doc.key === docType)?.label || docType)
        .join(', ');
      const message = `Faltan documentos obligatorios: ${missingLabels}.`;
      setValidationMessage(message);
      toast.error(message);
      return;
    }

    const error = validateFiles(files.map((f) => f.file), 0);
    if (error) {
      setValidationMessage(error);
      toast.error(error);
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setValidationMessage('');
    try {
      const res = await psychologistService.uploadDocuments(
        files.map((f) => f.file),
        files.map((f) => f.docType),
        {
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          },
        }
      );
      const status = res.data?.status || psychologistStatus;
      if (status) {
        setPsychologistStatus(status);
        updateUser({ status });
      }

      if (['APPROVED', 'ACTIVE'].includes(status)) {
        toast.success('Documentos actualizados.');
        navigate('/psicologo/dashboard');
        return;
      }

      navigate('/register/psicologo/confirmacion');
    } catch (err) {
      const msg = err?.code === 'ECONNABORTED'
        ? 'La subida tardó demasiado. Probá subir menos archivos por vez o verificá tu conexión.'
        : err?.response?.data?.error || 'Error al subir documentos';
      setValidationMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setUploadProgress(0);
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
          {isReviewedStatus
            ? ' Si actualizás estos archivos, tu cuenta volverá a quedar en revisión hasta que el admin la apruebe.'
            : ' El equipo los revisará en aproximadamente 5 días hábiles.'}
          {!isReviewedStatus && requiredDocTypes.length > 0 ? ' Los primeros 4 documentos son obligatorios para continuar.' : ''}
        </p>

        {loadingExisting ? (
          <p className="psico-secondary-text">Cargando documentos existentes...</p>
        ) : existingDocuments.length > 0 && (
          <div className="psico-docs-uploaded">
            <h3>Documentos cargados anteriormente ({existingDocuments.length})</h3>
            <ul>
              {existingDocuments.map((document) => {
                const label = docTypes.find((d) => d.key === document.documentType)?.label || document.documentType;
                return (
                  <li key={document.id} className="psico-doc-file-row">
                    <FileText size={14} />
                    <a
                      href={toAssetUrl(document.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="psico-doc-file-name"
                    >
                      {document.originalName || label}
                    </a>
                    <span className="psico-doc-file-type">{label}</span>
                    <div className="psico-doc-actions">
                      <label
                        className={`psico-doc-action-btn${documentActionId ? ' is-disabled' : ''}`}
                        title="Reemplazar documento"
                      >
                        <RefreshCw size={14} /> Reemplazar
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleReplaceDocument(document, e)}
                          disabled={loading || Boolean(documentActionId)}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(document)}
                        className="psico-doc-action-btn psico-doc-action-btn--danger"
                        disabled={loading || Boolean(documentActionId)}
                        title="Borrar documento"
                      >
                        <Trash2 size={14} /> Borrar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="psico-docs-types">
          {docTypes.map((dt, index) => {
            const isRequired = index < 4;
            const hasDocumentForType =
              existingDocuments.some((document) => document.documentType === dt.key)
              || files.some((selectedFile) => selectedFile.docType === dt.key);
            return (
              <div key={dt.key} className="psico-doc-type-row">
                <div className="psico-doc-type-label">
                  <FileText size={16} />
                  <span>
                    {dt.label}
                    {isRequired ? ' *' : ''}
                  </span>
                  <small>{isRequired ? 'Obligatorio' : 'Opcional'} · PDF, JPG o PNG · máx. 5 MB</small>
                </div>
                <label className={`psico-doc-upload-btn${hasDocumentForType ? ' is-complete' : ''}`}>
                  <Upload size={14} /> {hasDocumentForType ? 'Archivo agregado' : 'Agregar archivo'}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleFileAdd(e, dt.key)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            );
          })}
        </div>

        {(validationMessage || (submitAttempted && files.length === 0)) && (
          <p className="psico-docs-validation" role="alert">
            {validationMessage || 'Enviá los 4 primeros archivos obligatorios'}
          </p>
        )}

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
                    <button type="button" onClick={() => handleRemoveSelectedFile(f.id)} className="psico-doc-remove">
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
            disabled={loading}
          >
            {loading
              ? `Subiendo${uploadProgress ? ` ${uploadProgress}%` : '...'}`
              : isReviewedStatus ? 'Guardar documentos' : 'Enviar documentos'}
          </button>
        </div>
      </div>
    </div>
  );
}
