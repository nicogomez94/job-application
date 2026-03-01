import { Link } from 'react-router-dom';
import { Search, Briefcase, Building2, TrendingUp, MapPin, Briefcase as BriefcaseIcon } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-left">
            <h1 className="home-hero-title">
              The <span className="text-highlight">Easiest Way</span><br />
              to Get Your New Job
            </h1>
            <p className="home-hero-subtitle">
              Each month, more than 3 million job seekers turn to website in their search for work, making over 140,000 applications every single day
            </p>

            <div className="home-search-container">
              <div className="home-search-bar">
                <div className="home-search-field">
                  <BriefcaseIcon size={20} className="search-icon" />
                  <select className="home-search-select">
                    <option>Industry</option>
                    <option>Technology</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                  </select>
                </div>
                <div className="home-search-divider"></div>
                <div className="home-search-field">
                  <MapPin size={20} className="search-icon" />
                  <select className="home-search-select">
                    <option>Location</option>
                    <option>Buenos Aires</option>
                    <option>Córdoba</option>
                    <option>Rosario</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div className="home-search-divider"></div>
                <div className="home-search-field home-search-field-input">
                  <input
                    type="text"
                    placeholder="Keywords"
                    className="home-search-input"
                  />
                </div>
                <Link to="/jobs" className="btn btn-primary home-search-btn">
                  <Search size={20} />
                  <span>Search</span>
                </Link>
              </div>
            </div>

            <div className="home-popular-searches">
              <span className="popular-label">Popular Searches:</span>
              <a href="#" className="popular-link">Content Writer</a>,
              <a href="#" className="popular-link">Finance</a>,
              <a href="#" className="popular-link">Human Resource</a>,
              <a href="#" className="popular-link">Management</a>
            </div>
          </div>

          <div className="home-hero-right">
            <div className="hero-image-container">
              <div className="hero-image-wrapper hero-image-top">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600" alt="Team collaboration" />
              </div>
              <div className="hero-image-wrapper hero-image-bottom">
                <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600" alt="Business meeting" />
              </div>
              <div className="hero-dots-pattern"></div>
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
