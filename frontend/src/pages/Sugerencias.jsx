import { Link } from 'react-router-dom';
import { Briefcase, Building2, CheckCircle2 } from 'lucide-react';
import './Sugerencias.css';

const professionalTips = [
  'Completá tu perfil con experiencia, habilidades y una descripción clara.',
  'Mantené tu CV actualizado y adaptado al puesto al que te postulás.',
  'Postulate solo a ofertas que se alineen con tu perfil para mejorar resultados.',
  'Escribí cartas de presentación concretas, personalizadas y sin texto genérico.',
  'Respondé rápido a mensajes o entrevistas para no perder oportunidades.',
];

const companyTips = [
  'Publicá descripciones de puesto claras, con objetivos y requisitos reales.',
  'Definí salario, modalidad y expectativas para reducir postulaciones no relevantes.',
  'Revisá perfiles con criterios consistentes para acelerar la selección.',
  'Dá feedback breve a candidatos para mejorar la experiencia de contratación.',
  'Mantené activa tu suscripción para sostener la visibilidad de tus ofertas.',
];

export default function Sugerencias() {
  return (
    <section className="tips-page">
      <div className="tips-container">
        <header className="tips-header">
          <h1>Sugerencias para Profesionales y Empresas</h1>
          <p>
            Recomendaciones prácticas para mejorar postulaciones, publicaciones y tiempos de
            contratación en la plataforma.
          </p>
        </header>

        <div className="tips-grid">
          <article className="tips-card">
            <div className="tips-card-title">
              <Briefcase size={22} />
              <h2>Para Profesionales</h2>
            </div>
            <ul>
              {professionalTips.map((tip) => (
                <li key={tip}>
                  <CheckCircle2 size={16} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <Link to="/jobs" className="tips-link">
              Ver ofertas laborales
            </Link>
          </article>

          <article className="tips-card">
            <div className="tips-card-title">
              <Building2 size={22} />
              <h2>Para Empresas</h2>
            </div>
            <ul>
              {companyTips.map((tip) => (
                <li key={tip}>
                  <CheckCircle2 size={16} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <Link to="/register/company" className="tips-link">
              Registrar empresa
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
