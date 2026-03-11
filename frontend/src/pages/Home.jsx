import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Building2, TrendingUp, MapPin, Briefcase as BriefcaseIcon, ChevronLeft, ChevronRight, ChevronDown, ShoppingBag, PenTool, Users, BarChart2, Laptop, DollarSign, TrendingUp as TrendingUpIcon, Megaphone } from 'lucide-react';
import { useI18n } from '../context/i18nStore';
import './Home.css';

// Hook personalizado para animaciones de scroll
const useScrollAnimation = () => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return [elementRef, isVisible];
};

export default function Home() {
  const { t } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroRef, heroVisible] = useScrollAnimation();
  const [categoriesRef, categoriesVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();

  const categories = [
    { id: 1, name: 'Retail & Producto', icon: ShoppingBag, jobs: 3, color: '#e0f2fe' },
    { id: 2, name: 'Redactor de Contenido', icon: PenTool, jobs: 8, color: '#dbeafe' },
    { id: 3, name: 'Recursos Humanos', icon: Users, jobs: 3, color: '#e0f2fe' },
    { id: 4, name: 'Investigación de Mercado', icon: BarChart2, jobs: 4, color: '#dbeafe' },
    { id: 5, name: 'Software', icon: Laptop, jobs: 4, color: '#e0f2fe' },
    { id: 6, name: 'Finanzas', icon: DollarSign, jobs: 5, color: '#dbeafe' },
    { id: 7, name: 'Gestión', icon: TrendingUpIcon, jobs: 5, color: '#e0f2fe' },
    { id: 8, name: 'Marketing & Ventas', icon: Megaphone, jobs: 4, color: '#dbeafe' },
  ];

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="home-container">
      <section ref={heroRef} className={`home-hero animate-on-scroll ${heroVisible ? 'animate-visible' : ''}`}>
        <div className="home-hero-content">
          <div className="home-hero-left">
            <h1 className="home-hero-title">
              {t('La')} <span className="text-highlight">{t('Forma Más Fácil')}</span><br />
              {t('de Conseguir Tu Nuevo Trabajo')}
            </h1>
            <p className="home-hero-subtitle">
              {t('Cada mes, más de 3 millones de personas buscan trabajo en nuestra plataforma, realizando más de 140.000 postulaciones cada día')}
            </p>

            <div className="home-search-container">
              <div className="home-search-bar">
                <div className="home-search-field">
                  <BriefcaseIcon size={20} className="search-icon" />
                  <select className="home-search-select">
                    <option>{t('Industria')}</option>
                    <option>{t('Tecnología')}</option>
                    <option>{t('Marketing')}</option>
                    <option>{t('Finanzas')}</option>
                    <option>{t('Salud')}</option>
                  </select>
                  <ChevronDown size={16} className="home-search-chevron" />
                </div>
                <div className="home-search-divider"></div>
                <div className="home-search-field">
                  <MapPin size={20} className="search-icon" />
                  <select className="home-search-select">
                    <option>{t('Ubicación')}</option>
                    <option>Buenos Aires</option>
                    <option>{t('Córdoba')}</option>
                    <option>{t('Rosario')}</option>
                    <option>{t('Remoto')}</option>
                  </select>
                  <ChevronDown size={16} className="home-search-chevron" />
                </div>
                <div className="home-search-divider"></div>
                <div className="home-search-field home-search-field-input">
                  <input
                    type="text"
                    placeholder={t('Palabras clave')}
                    className="home-search-input"
                  />
                </div>
                <Link to="/jobs" className="btn btn-primary home-search-btn">
                  <Search size={20} />
                  <span>{t('Buscar')}</span>
                </Link>
              </div>
            </div>

            <div className="home-popular-searches">
              <span className="popular-label">{t('Búsquedas Populares:')}</span>
              <a href="#" className="popular-link">{t('Redactor de Contenido')}</a>,
              <a href="#" className="popular-link">{t('Finanzas')}</a>,
              <a href="#" className="popular-link">{t('Recursos Humanos')}</a>,
              <a href="#" className="popular-link">{t('Gestión')}</a>
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

      {/* Categories Carousel Section */}
      <section ref={categoriesRef} className={`home-categories animate-on-scroll ${categoriesVisible ? 'animate-visible' : ''}`}>
        <div className="home-categories-container">
          <h2 className="categories-title">{t('Navegá por categoría')}</h2>
          <p className="categories-subtitle">{t('Encontrá el trabajo perfecto para vos. más de 800 trabajos nuevos cada día')}</p>
          
          <div className="categories-carousel">
            <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
              <ChevronLeft size={24} />
            </button>

            <div className="categories-slider">
              <div 
                className="categories-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="categories-slide">
                    <div className="categories-grid">
                      {categories
                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                        .map((category) => (
                          <Link to={`/jobs?category=${category.id}`} key={category.id} className="category-card">
                            <div className="category-icon-wrapper" style={{ backgroundColor: category.color }}>
                              <category.icon size={24} className="category-icon" />
                            </div>
                            <div className="category-info">
                              <h3 className="category-name">{t(category.name)}</h3>
                              <p className="category-jobs">{category.jobs} {t('Trabajos Disponibles')}</p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="carousel-indicators">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section ref={featuresRef} className={`home-features animate-on-scroll ${featuresVisible ? 'animate-visible' : ''}`}>
        <div className="home-features-container">
          <h2>{t('¿Cómo Funciona?')}</h2>
          <div className="home-features-grid">
            <div className="home-feature-item">
              <div className="home-feature-icon">
                <Search />
              </div>
              <h3>{t('Busca')}</h3>
              <p>{t('Explora miles de ofertas laborales de empresas verificadas')}</p>
            </div>

            <div className="home-feature-item">
              <div className="home-feature-icon">
                <Briefcase />
              </div>
              <h3>{t('Postula')}</h3>
              <p>{t('Envía tu CV y carta de presentación con un solo click')}</p>
            </div>

            <div className="home-feature-item">
              <div className="home-feature-icon">
                <TrendingUp />
              </div>
              <h3>{t('Crece')}</h3>
              <p>{t('Consigue el trabajo ideal y desarrolla tu carrera profesional')}</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={ctaRef} className={`home-cta animate-on-scroll ${ctaVisible ? 'animate-visible' : ''}`}>
        <div className="home-cta-container">
          <div className="home-cta-grid">
            <div className="card">
              <Briefcase className="home-cta-card-icon" />
              <h3>{t('¿Buscas trabajo?')}</h3>
              <p>
                {t('Crea tu perfil profesional, sube tu CV y empieza a postular a las mejores ofertas laborales.')}
              </p>
              <br />
              <Link to="/register/user" className="btn btn-primary">
                {t('Crear Cuenta de Candidato')}
              </Link>
            </div>

            <div className="card">
              <Building2 className="home-cta-card-icon" />
              <h3>{t('¿Contratas talento?')}</h3>
              <p>
                {t('Publica ofertas laborales, gestiona postulantes y encuentra a los mejores profesionales para tu empresa.')}
              </p>
              <br />
              <Link to="/register/company" className="btn btn-primary">
                {t('Registrar Empresa')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className={`home-stats animate-on-scroll ${statsVisible ? 'animate-visible' : ''}`}>
        <div className="home-stats-container">
          <div className="home-stats-grid">
            <div>
              <div className="home-stat-number">10,000+</div>
              <div className="home-stat-label">{t('Ofertas Laborales')}</div>
            </div>
            <div>
              <div className="home-stat-number">5,000+</div>
              <div className="home-stat-label">{t('Empresas Registradas')}</div>
            </div>
            <div>
              <div className="home-stat-number">50,000+</div>
              <div className="home-stat-label">{t('Candidatos Activos')}</div>
            </div>
            <div>
              <div className="home-stat-number">95%</div>
              <div className="home-stat-label">{t('Tasa de Éxito')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
