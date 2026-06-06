import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, ArrowLeft, MapPin, Languages, Star, BookOpen, Clock, UserPlus, CheckCircle, XCircle, Loader, Ban } from 'lucide-react';
import toast from 'react-hot-toast';
import { psychologistService, psychologistRequestService } from '../../services';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_BASE_URL } from '../../services/apiBaseUrl';
import './Psicologos.css';

const toAssetUrl = (p) => {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${BACKEND_BASE_URL}${p}`;
};

export default function PsychologistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuthStore();
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request state for logged-in patients
  const [myRequest, setMyRequest] = useState(null); // null = not loaded yet / no request
  const [requestLoading, setRequestLoading] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [blockingUser, setBlockingUser] = useState(false);
  const [endingTherapy, setEndingTherapy] = useState(false);
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState(null);

  const isPatient = isAuthenticated && userType === 'patient';

  useEffect(() => {
    const load = async () => {
      try {
        const res = await psychologistService.getById(id);
        setPsychologist(res.data);
      } catch {
        toast.error('No se pudo cargar el perfil del psicólogo');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Load the user's existing request for this psychologist
  useEffect(() => {
    if (!isPatient) return;
    const loadRequest = async () => {
      setRequestLoading(true);
      try {
        const res = await psychologistRequestService.getMyRequests();
        const existing = (res.data || []).find((r) => r.psychologistId === id || r.psychologist?.id === id);
        setMyRequest(existing || null);

        if (existing?.status === 'ACCEPTED') {
          // Load contact info
          try {
            const contactRes = await psychologistRequestService.getContactInfo(id);
            setContactInfo(contactRes.data);
          } catch {
            // contact info may not be available yet
          }
        }
      } catch {
        // silently ignore
      } finally {
        setRequestLoading(false);
      }
    };
    loadRequest();
  }, [id, isPatient]);

  const handleSendRequest = async () => {
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/psicologos/login-paciente', { state: { from: `/psicologos/${id}` } });
      return;
    }
    setSendingRequest(true);
    try {
      const res = await psychologistRequestService.send(id, message || undefined);
      setMyRequest(res.data.request);
      setMessage('');
      toast.success('¡Solicitud enviada! El psicólogo la revisará pronto.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al enviar la solicitud');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!myRequest) return;
    if (!window.confirm('¿Cancelar esta solicitud?')) return;
    setSendingRequest(true);
    try {
      await psychologistRequestService.cancel(myRequest.id);
      setMyRequest(null);
      toast.success('Solicitud cancelada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al cancelar');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleBlockRequest = async () => {
    if (!myRequest) return;
    const blockName = psychologist?.displayName
      || `${psychologist?.firstName || ''} ${psychologist?.lastName || ''}`.trim()
      || 'este psicólogo';
    if (!window.confirm(`¿Bloquear a ${blockName}? Ya no vas a poder ver sus datos de contacto.`)) return;
    setBlockingUser(true);
    try {
      const res = await psychologistRequestService.blockRelationship(myRequest.id);
      setMyRequest(res.data?.request || {
        ...myRequest,
        blockInfo: res.data?.blockInfo,
      });
      setContactInfo(null);
      toast.success('Usuario bloqueado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al bloquear');
    } finally {
      setBlockingUser(false);
    }
  };

  const handleRequestTherapyEnd = async () => {
    if (!myRequest) return;
    const blockName = psychologist?.displayName
      || `${psychologist?.firstName || ''} ${psychologist?.lastName || ''}`.trim()
      || 'este psicólogo';
    if (!window.confirm(`¿Enviar al profesional el pedido para finalizar la terapia con ${blockName}?`)) return;
    setEndingTherapy(true);
    try {
      const res = await psychologistRequestService.requestTermination(myRequest.id);
      setMyRequest(res.data?.request || myRequest);
      toast.success('Pedido enviado al profesional');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al pedir la finalización');
    } finally {
      setEndingTherapy(false);
    }
  };

  if (loading) {
    return <div className="psico-loading psico-page-loading">Cargando perfil...</div>;
  }

  if (!psychologist) {
    return (
      <div className="psico-profile-page">
        <div className="psico-profile-notfound">
          <p>No se encontró el psicólogo.</p>
          <Link to="/psicologos/buscar" className="psico-btn-secondary">
            <ArrowLeft size={16} /> Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const p = psychologist;
  const name = p.displayName || `${p.firstName} ${p.lastName}`;
  const photo = toAssetUrl(p.profileImage);
  const initials = `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase();

  // Determine contact info source: from accepted request or from profile (if available)
  const phone = contactInfo?.phone || p.phone;
  const contactEmail = contactInfo?.contactEmail || p.contactEmail;
  const whatsappUrl = phone ? `https://wa.me/${phone.replace(/\D/g, '')}` : null;

  const requestAccepted = myRequest?.status === 'ACCEPTED';
  const requestPending = myRequest?.status === 'PENDING';
  const requestRejected = myRequest?.status === 'REJECTED';
  const blockInfo = p.blockInfo || myRequest?.blockInfo;
  const requestBlocked = Boolean(p.isBlocked || blockInfo);
  const hasTerminationRequest = Boolean(myRequest?.terminationRequestedAt && !myRequest?.terminationAcceptedAt);
  const terminationAccepted = Boolean(myRequest?.terminationAcceptedAt);

  return (
    <div className="psico-profile-page">
      <div className="psico-profile-container">
        <Link to="/psicologos/buscar" className="psico-back-link">
          <ArrowLeft size={16} /> Volver al listado
        </Link>

        <div className="psico-profile-header">
          <div className="psico-profile-photo">
            {photo ? (
              <img src={photo} alt={name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            ) : null}
            <div className="psico-profile-initials" style={photo ? { display: 'none' } : {}}>{initials}</div>
          </div>
          <div className="psico-profile-main-info">
            <h1>{name}</h1>
            {p.age && <span className="psico-profile-age">{p.age} años</span>}
            {p.country && (
              <div className="psico-profile-location">
                <MapPin size={14} /> {p.country}{p.region ? `, ${p.region}` : ''}{p.practiceProvince ? `, ${p.practiceProvince}` : ''}
              </div>
            )}
            <div className="psico-profile-contact-btns">
              {requestBlocked && (
                <div className="psico-hire-section psico-blocked-panel">
                  <span className="psico-status-badge psico-status-red">
                    <Ban size={14} /> Relación bloqueada
                  </span>
                  <p className="psico-blocked-text">
                    {blockInfo?.message || 'Esta relación está bloqueada. Ya no podés ver los datos de este usuario.'}
                  </p>
                </div>
              )}

              {/* ACCEPTED: show real contact buttons */}
              {requestAccepted && !requestBlocked && (
                <div className="psico-accepted-contact-card">
                  <span className="psico-status-badge psico-status-green">
                    <CheckCircle size={14} /> Solicitud aceptada
                  </span>
                  <div className="psico-accepted-contact-actions">
                    {whatsappUrl && (
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="psico-btn-whatsapp psico-btn-large">
                        <MessageCircle size={18} /> <span>Contactar por WhatsApp</span>
                      </a>
                    )}
                    {contactEmail && (
                      <a href={`mailto:${contactEmail}`} className="psico-btn-email psico-btn-large">
                        <Mail size={18} /> <span>{contactEmail}</span>
                      </a>
                    )}
                  </div>
                  <div className="psico-accepted-management-actions">
                    <button
                      type="button"
                      className="psico-btn-danger-sm"
                      onClick={handleBlockRequest}
                      disabled={blockingUser}
                    >
                      <Ban size={14} /> {blockingUser ? 'Bloqueando...' : 'Bloquear'}
                    </button>
                    {!terminationAccepted && (
                      <button
                        type="button"
                        className="psico-btn-therapy-end"
                        onClick={handleRequestTherapyEnd}
                        disabled={endingTherapy || hasTerminationRequest}
                      >
                        {hasTerminationRequest ? 'Finalización solicitada' : 'El paciente finaliza la terapia'}
                      </button>
                    )}
                  </div>
                  {hasTerminationRequest && (
                    <p className="psico-request-message psico-request-message--termination">
                      "El paciente a decidido finalizar la terapia por razones personales"
                    </p>
                  )}
                  {terminationAccepted && (
                    <p className="psico-secondary-text">El profesional aceptó la finalización de la terapia.</p>
                  )}
                </div>
              )}

              {/* PENDING: show waiting status */}
              {requestPending && !requestBlocked && (
                <div className="psico-hire-section">
                  <span className="psico-status-badge psico-status-orange">
                    <Clock size={14} /> Solicitud enviada — esperando respuesta
                  </span>
                  <button
                    className="psico-btn-danger-sm"
                    onClick={handleCancelRequest}
                    disabled={sendingRequest}
                    style={{ marginTop: '0.5rem' }}
                  >
                    {sendingRequest ? 'Cancelando...' : 'Cancelar solicitud'}
                  </button>
                </div>
              )}

              {/* REJECTED: allow retrying */}
              {requestRejected && !requestBlocked && (
                <div className="psico-hire-section">
                  <span className="psico-status-badge psico-status-red psico-status-unavailable">
                    <XCircle size={14} /> Estimada/o. En estos momentos estamos con agenda completa. Será un gusto asistirle en un próximo contacto.
                  </span>
                </div>
              )}

              {/* No request yet */}
              {!myRequest && !requestLoading && !requestBlocked && (
                <div className="psico-hire-section">
                  {isPatient ? (
                    <>
                      <textarea
                        className="psico-hire-message"
                        placeholder="Mensaje opcional para el psicólogo (ej. motivo de consulta)..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                      />
                      <button
                        className="psico-btn-primary psico-btn-large"
                        onClick={handleSendRequest}
                        disabled={sendingRequest}
                      >
                        {sendingRequest ? (
                          <><Loader size={16} /> Enviando...</>
                        ) : (
                          <><UserPlus size={18} /> Solicitar consulta</>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      className="psico-btn-primary psico-btn-large"
                      onClick={() => navigate('/psicologos/login-paciente', { state: { from: `/psicologos/${id}` } })}
                    >
                      <UserPlus size={18} /> Iniciar sesión para solicitar consulta
                    </button>
                  )}
                </div>
              )}

              {requestLoading && (
                <div className="psico-loading" style={{ fontSize: '0.85rem', padding: '0.5rem 0' }}>
                  Cargando estado...
                </div>
              )}
            </div>
          </div>
        </div>

        {!requestBlocked && (
          <div className="psico-profile-body">
            {p.specialties?.length > 0 && (
              <section className="psico-profile-section">
                <h2><Star size={16} /> Especialidades</h2>
                <div className="psico-tags">
                  {p.specialties.map((s) => (
                    <span key={s} className="psico-tag psico-tag-specialty">{s}</span>
                  ))}
                </div>
              </section>
            )}

            <section className="psico-profile-section">
              <h2>Información pública</h2>
              <div className="psico-profile-details-grid">
                {p.country && (
                  <div className="psico-profile-detail-card">
                    <h3>País</h3>
                    <p>{p.country}</p>
                  </div>
                )}

                {(p.region || p.practiceProvince) && (
                  <div className="psico-profile-detail-card">
                    <h3>Provincia / Región</h3>
                    <p>{p.region || p.practiceProvince}</p>
                  </div>
                )}

                {p.licenseNumber && (
                  <div className="psico-profile-detail-card">
                    <h3>Matrícula profesional</h3>
                    <p>{p.licenseNumber}</p>
                  </div>
                )}

                {p.age && (
                  <div className="psico-profile-detail-card">
                    <h3>Edad</h3>
                    <p>{p.age} años</p>
                  </div>
                )}

                {p.gender && (
                  <div className="psico-profile-detail-card">
                    <h3>Género</h3>
                    <p>{p.gender}</p>
                  </div>
                )}

                {p.languages?.length > 0 && (
                  <div className="psico-profile-detail-card">
                    <h3><Languages size={14} /> Idiomas</h3>
                    <div className="psico-tags">
                      {p.languages.map((l) => <span key={l} className="psico-tag">{l}</span>)}
                    </div>
                  </div>
                )}

                {p.yearsExperience != null && (
                  <div className="psico-profile-detail-card">
                    <h3><Clock size={14} /> Experiencia</h3>
                    <p>{p.yearsExperience} {p.yearsExperience === 1 ? 'año' : 'años'}</p>
                  </div>
                )}

                {p.remoteModality && (
                  <div className="psico-profile-detail-card">
                    <h3>Modalidad</h3>
                    <p>{p.remoteModality}</p>
                  </div>
                )}

                {p.sessionCost && (
                  <div className="psico-profile-detail-card">
                    <h3>Costo final por sesión</h3>
                    <p>{p.sessionCost}</p>
                  </div>
                )}

                {p.sessionDuration && (
                  <div className="psico-profile-detail-card">
                    <h3>Tiempo de sesión / promoción</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{p.sessionDuration}</p>
                  </div>
                )}

                {(p.ageRanges?.length > 0) && (
                  <div className="psico-profile-detail-card">
                    <h3>Atiende</h3>
                    <div className="psico-tags">
                      {p.ageRanges.map((a) => <span key={a} className="psico-tag">{a}</span>)}
                    </div>
                  </div>
                )}

                {(p.universityDegree || p.universityName || p.degreeInstitution) && (
                  <div className="psico-profile-detail-card">
                    <h3>Formación</h3>
                    {p.universityDegree && <p>{p.universityDegree}</p>}
                    {(p.universityName || p.degreeInstitution) && (
                      <p className="psico-secondary-text">{p.universityName || p.degreeInstitution}</p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {p.bio && (
              <section className="psico-profile-section">
                <h2><BookOpen size={16} /> Sobre mí</h2>
                <p className="psico-profile-bio">{p.bio}</p>
              </section>
            )}

            <div className="psico-profile-disclaimer">
              <strong>Aviso:</strong> La atención remota no es recomendada para crisis aguda con riesgo de vida o psicosis activa que requiera contención física inmediata, las cuales necesitan atención presencial de emergencia.
            </div>

            <div className="psico-independent-notice">
              El profesional actúa de manera independiente.<br />
              La plataforma no interviene en sesiones, pagos ni resultados del servicio.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
