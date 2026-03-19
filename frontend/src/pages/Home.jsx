import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Building2, TrendingUp, MapPin, Briefcase as BriefcaseIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useI18n } from '../context/i18nStore';
import { categoryService } from '../services';
import './Home.css';

const heroImageMain = '/herohome.png';

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
  const [homeFilters, setHomeFilters] = useState({ categoryId: '', location: '', search: '' });
  const [availableCategories, setAvailableCategories] = useState([]);
  const [heroRef, heroVisible] = useScrollAnimation();
  const [categoriesRef, categoriesVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll();
        const payload = response?.data;
        const normalized = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.categories)
            ? payload.categories
            : [];
        setAvailableCategories(normalized);
      } catch (error) {
        console.error('No se pudieron cargar categorías para home-search-select:', error);
      }
    };

    loadCategories();
  }, []);

  const categories = availableCategories;
  const legacyCategoryNames = new Set([
    'Retail & Producto',
    'Redactor de Contenido',
    'Recursos Humanos',
    'Investigación de Mercado',
  ]);
  const categoriesForCarousel = [...categories].sort((a, b) => {
    const aIsLegacy = legacyCategoryNames.has(a?.name);
    const bIsLegacy = legacyCategoryNames.has(b?.name);
    if (aIsLegacy !== bIsLegacy) return aIsLegacy ? 1 : -1;
    const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (aDate !== bDate) return bDate - aDate;
    return String(a?.name || '').localeCompare(String(b?.name || ''), 'es');
  });
  const getCategoryOffersCount = (category) => category?.activeJobOffersCount ?? category?._count?.jobOffers ?? 0;
  const getDisplayCategoryName = (category) => {
    const name = String(category?.name || '').trim();
    if (name.toLowerCase() === 'industria') return t('Profesiones');
    return t(name);
  };
  const itemsPerSlide = 4;
  const totalSlides = Math.max(1, Math.ceil(categoriesForCarousel.length / itemsPerSlide));

  useEffect(() => {
    if (currentSlide > totalSlides - 1) {
      setCurrentSlide(0);
    }
  }, [currentSlide, totalSlides]);

  const nextSlide = () => {
    if (categoriesForCarousel.length <= itemsPerSlide) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (categoriesForCarousel.length <= itemsPerSlide) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const jobsParams = new URLSearchParams();
  if (homeFilters.categoryId) jobsParams.set('categoryId', homeFilters.categoryId);
  if (homeFilters.location) jobsParams.set('location', homeFilters.location);
  if (homeFilters.search) jobsParams.set('search', homeFilters.search);
  const jobsSearch = jobsParams.toString();
  const jobsHref = jobsSearch ? `/jobs?${jobsSearch}` : '/jobs';
  const compactPlans = [
    {
      id: 'MONTHLY',
      name: 'Mensual',
      subtitle: 'Ideal para empezar',
      price: '$25.000',
      period: '/ mes',
      feature: 'Hasta 3 publicaciones activas',
    },
    {
      id: 'QUARTERLY',
      name: 'Trimestral',
      subtitle: 'Mejor relación precio-valor',
      price: '$60.000',
      period: '/ trimestre',
      feature: 'Hasta 10 publicaciones activas',
      highlight: true,
      badge: 'Más elegido',
    },
    {
      id: 'ANNUAL',
      name: 'Anual',
      subtitle: 'Para escalar contrataciones',
      price: '$210.000',
      period: '/ año',
      feature: 'Publicaciones ilimitadas',
    },
  ];

  return (
    <div className="home-container">
      <section ref={heroRef} className={`home-hero animate-on-scroll ${heroVisible ? 'animate-visible' : ''}`}>
        <div className="home-hero-content">
          <div className="home-hero-left">
            <h1 className="home-hero-title">
              {t('Gana más')}<br />
              {t('Haciendo menos')}
            </h1>
            <p className="home-hero-subtitle">
              {t('Cada mes, más de 3 millones de personas buscan trabajo en línea, realizando más de 140.000 postulaciones')}
            </p>
          </div>

          <div className="home-hero-right">
            <h2 className="home-hero-brand notranslate" translate="no" lang="en">
              Professionals at home
            </h2>
            <div className="hero-image-container">
              <div className="hero-image-wrapper hero-image-main">
                <img src={heroImageMain} alt="Persona trabajando desde casa" />
              </div>
            </div>
          </div>
        </div>

        <div className="home-search-container">
          <div className="home-search-bar">
            <div className="home-search-field">
              <BriefcaseIcon size={20} className="search-icon" />
              <select
                className="home-search-select"
                value={homeFilters.categoryId}
                onChange={(e) => setHomeFilters((prev) => ({ ...prev, categoryId: e.target.value }))}
              >
                <option value="">{t('Profesiones')}</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {getDisplayCategoryName(category)}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="home-search-chevron" />
            </div>
            <div className="home-search-divider"></div>
            <div className="home-search-field">
              <MapPin size={20} className="search-icon" />
              <select
                className="home-search-select"
                value={homeFilters.location}
                onChange={(e) => setHomeFilters((prev) => ({ ...prev, location: e.target.value }))}
              >
                <option value="">{t('Ubicación')}</option>
                <option value="Buenos Aires">Buenos Aires</option>
                <option value="Córdoba">{t('Córdoba')}</option>
                <option value="Rosario">{t('Rosario')}</option>
                <option value="Remoto">{t('Remoto')}</option>
              </select>
              <ChevronDown size={16} className="home-search-chevron" />
            </div>
            <div className="home-search-divider"></div>
            <div className="home-search-field home-search-field-input">
              <input
                type="text"
                placeholder={t('Buscar Trabajo')}
                className="home-search-input"
                value={homeFilters.search}
                onChange={(e) => setHomeFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <Link to={jobsHref} className="btn btn-primary home-search-btn">
              <Search size={20} />
              <span>{t('Buscar')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Carousel Section */}
      <section ref={categoriesRef} className={`home-categories animate-on-scroll ${categoriesVisible ? 'animate-visible' : ''}`}>
        <div className="home-categories-container">
          <h2 className="categories-title">{t('Navegá por categoría')}</h2>
          <p className="categories-subtitle">{t('Simplifica tu búsqueda de trabajo buscando por categorías')}</p>
          
          <div className="categories-carousel">
            <button className="carousel-btn carousel-btn-prev" onClick={prevSlide} disabled={categoriesForCarousel.length <= itemsPerSlide}>
              <ChevronLeft size={24} />
            </button>

            <div className="categories-slider">
              <div 
                className="categories-track"
                style={{ transform: `translateX(-${currentSlide * (100 / totalSlides)}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="categories-slide">
                    <div className="categories-grid">
                      {categoriesForCarousel
                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                        .map((category) => (
                          <Link to={`/jobs?categoryId=${category.id}`} key={category.id} className="category-card">
                            <div className="category-icon-wrapper">
                              <BriefcaseIcon size={24} className="category-icon" />
                            </div>
                            <div className="category-info">
                              <h3 className="category-name">{getDisplayCategoryName(category)}</h3>
                              <p className="category-jobs">{getCategoryOffersCount(category)} {t('Trabajos Disponibles')}</p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="carousel-btn carousel-btn-next" onClick={nextSlide} disabled={categoriesForCarousel.length <= itemsPerSlide}>
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
              <p>{t('Explora las ofertas laborales')}</p>
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
                {t('Crear Cuenta de Profesional')}
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
          <div className="home-stats-header">
            <p className="home-stats-eyebrow">Empresas</p>
            <h2>Planes y precios en versión resumida</h2>
            <p>Elegí un plan para publicar ofertas y gestionar postulantes.</p>
          </div>

          <div className="home-pricing-preview-grid">
            {compactPlans.map((plan) => (
              <article
                key={plan.id}
                className={`home-pricing-preview-card ${plan.highlight ? 'home-pricing-preview-card-highlight' : ''}`}
              >
                {plan.badge ? <span className="home-pricing-preview-badge">{plan.badge}</span> : null}
                <h3>{plan.name}</h3>
                <p className="home-pricing-preview-subtitle">{plan.subtitle}</p>
                <p className="home-pricing-preview-price">
                  {plan.price}
                  <span>{plan.period}</span>
                </p>
                <p className="home-pricing-preview-feature">{plan.feature}</p>
              </article>
            ))}
          </div>

          <div className="home-pricing-preview-cta">
            <Link to="/planes-y-precios" className="btn btn-outline home-pricing-preview-link">
              Ver planes y precios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
