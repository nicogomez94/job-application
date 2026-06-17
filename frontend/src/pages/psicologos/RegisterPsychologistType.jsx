import { Link } from 'react-router-dom';
import { MapPin, Globe } from 'lucide-react';
import './Psicologos.css';

export default function RegisterPsychologistType() {
  return (
    <div className="psico-register-type-page">
      <div className="psico-register-type-container">
        <h1>Registrarme como psicólogo</h1>
        <p className="psico-register-type-subtitle">
          Elegí tu tipo de registro para comenzar con el formulario.
        </p>

        <div className="psico-register-type-cards">
          <Link to="/register/psicologo/argentina" className="psico-type-card">
            <div className="psico-type-card-icon">
              <MapPin size={40} />
            </div>
            <h2>Psicólogo en Argentina</h2>
            <p>Para profesionales con matrícula emitida en Argentina.</p>
            <ul>
              <li>DNI / CUIT</li>
              <li>Matrícula provincial</li>
              <li>Título universitario</li>
            </ul>
            <span className="psico-btn-primary psico-type-card-btn">Comenzar</span>
          </Link>

          <Link to="/register/psicologo/internacional" className="psico-type-card">
            <div className="psico-type-card-icon">
              <Globe size={40} />
            </div>
            <h2>Psicólogo Internacional</h2>
            <p>Para profesionales fuera de Argentina.</p>
            <ul>
              <li>Documento / Pasaporte / Cédula</li>
              <li>Licencia o colegiación según país</li>
              <li>Título profesional</li>
            </ul>
            <span className="psico-btn-primary psico-type-card-btn">Comenzar</span>
          </Link>
        </div>

        <p className="psico-register-type-login">
          ¿Ya tenés cuenta? <Link to="/psicologos/login">Ingresá acá</Link>
        </p>
      </div>
    </div>
  );
}
