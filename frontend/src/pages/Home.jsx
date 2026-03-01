import { Link } from 'react-router-dom';
import { Search, Briefcase, Building2, TrendingUp } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="home-hero-content">
          <div>
            <h1>Encuentra el Trabajo de tus Sueños</h1>
            <p className="home-hero-subtitle">
              Miles de ofertas laborales esperando por ti. Conecta con las mejores empresas.
            </p>

            <div className="home-search-bar">
              <input
                type="text"
                placeholder="Buscar empleos por título, empresa o palabra clave..."
                className="home-search-input"
              />
              <Link to="/jobs" className="btn btn-primary home-search-btn">
                <Search />
                <span>Buscar</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="home-features-container">
          <h2>¿Cómo Funciona?</h2>
          <div className="home-features-grid">
            <div className="home-feature-item">
              <div className="home-feature-icon">
                <Search />
              </div>
              <h3>Busca</h3>
              <p>Explora miles de ofertas laborales de empresas verificadas</p>
            </div>

            <div className="home-feature-item">
              <div className="home-feature-icon">
                <Briefcase />
              </div>
              <h3>Postula</h3>
              <p>Envía tu CV y carta de presentación con un solo click</p>
            </div>

            <div className="home-feature-item">
              <div className="home-feature-icon">
                <TrendingUp />
              </div>
              <h3>Crece</h3>
              <p>Consigue el trabajo ideal y desarrolla tu carrera profesional</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta-container">
          <div className="home-cta-grid">
            <div className="card">
              <Briefcase className="home-cta-card-icon" />
              <h3>¿Buscas trabajo?</h3>
              <p>
                Crea tu perfil profesional, sube tu CV y empieza a postular a
                las mejores ofertas laborales.
              </p>
              <Link to="/register/user" className="btn btn-primary">
                Crear Cuenta de Candidato
              </Link>
            </div>

            <div className="card">
              <Building2 className="home-cta-card-icon" />
              <h3>¿Contratas talento?</h3>
              <p>
                Publica ofertas laborales, gestiona postulantes y encuentra a
                los mejores profesionales para tu empresa.
              </p>
              <Link to="/register/company" className="btn btn-primary">
                Registrar Empresa
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="home-stats-container">
          <div className="home-stats-grid">
            <div>
              <div className="home-stat-number">10,000+</div>
              <div className="home-stat-label">Ofertas Laborales</div>
            </div>
            <div>
              <div className="home-stat-number">5,000+</div>
              <div className="home-stat-label">Empresas Registradas</div>
            </div>
            <div>
              <div className="home-stat-number">50,000+</div>
              <div className="home-stat-label">Candidatos Activos</div>
            </div>
            <div>
              <div className="home-stat-number">95%</div>
              <div className="home-stat-label">Tasa de Éxito</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
