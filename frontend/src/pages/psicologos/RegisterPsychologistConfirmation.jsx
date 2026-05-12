import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Psicologos.css';

export default function RegisterPsychologistConfirmation() {
  return (
    <div className="psico-confirmation-page">
      <div className="psico-confirmation-box">
        <CheckCircle size={64} className="psico-confirmation-icon" />
        <h1>¡Registro enviado exitosamente!</h1>
        <p>
          Tu solicitud de registro fue recibida y está <strong>pendiente de verificación</strong>.
        </p>
        <p>
          El equipo de Professionals at Home revisará tu documentación en aproximadamente{' '}
          <strong>5 días hábiles</strong>. Te enviaremos un email a tu dirección de correo
          cuando tu cuenta sea aprobada.
        </p>
        <div className="psico-confirmation-steps">
          <div className="psico-confirmation-step done">
            <span className="psico-step-num">✓</span>
            <span>Datos enviados</span>
          </div>
          <div className="psico-confirmation-step done">
            <span className="psico-step-num">✓</span>
            <span>Documentación cargada</span>
          </div>
          <div className="psico-confirmation-step pending">
            <span className="psico-step-num">3</span>
            <span>Verificación por el equipo (~5 días hábiles)</span>
          </div>
          <div className="psico-confirmation-step pending">
            <span className="psico-step-num">4</span>
            <span>Activación de tu perfil</span>
          </div>
        </div>
        <Link to="/" className="psico-btn-secondary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
