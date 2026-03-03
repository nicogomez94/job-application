import { MapPin, Briefcase, DollarSign, Clock, Building2, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobSearch() {
  const jobs = [
    {
      id: 1,
      title: "Desarrollador Full Stack",
      company: "TechCorp SA",
      location: "Buenos Aires, Argentina",
      salary: "$120.000 - $180.000",
      type: "Tiempo Completo",
      posted: "Hace 2 días",
      logo: "https://ui-avatars.com/api/?name=TechCorp&background=3b82f6&color=fff&size=80",
      description: "Buscamos un desarrollador full stack con experiencia en React y Node.js para unirse a nuestro equipo.",
      tags: ["JavaScript", "React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      title: "Diseñador UX/UI Senior",
      company: "Creative Studio",
      location: "Córdoba, Argentina",
      salary: "$100.000 - $150.000",
      type: "Tiempo Completo",
      posted: "Hace 3 días",
      logo: "https://ui-avatars.com/api/?name=Creative+Studio&background=8b5cf6&color=fff&size=80",
      description: "Diseñador experimentado para liderar proyectos de experiencia de usuario en aplicaciones web y móviles.",
      tags: ["Figma", "Adobe XD", "UI Design", "Prototyping"]
    },
    {
      id: 3,
      title: "Analista de Datos",
      company: "DataInsights Ltd",
      location: "Remoto",
      salary: "$90.000 - $130.000",
      type: "Tiempo Completo",
      posted: "Hace 1 día",
      logo: "https://ui-avatars.com/api/?name=DataInsights&background=10b981&color=fff&size=80",
      description: "Únete a nuestro equipo de análisis para transformar datos en insights estratégicos.",
      tags: ["Python", "SQL", "Power BI", "Excel"]
    },
    {
      id: 4,
      title: "Marketing Digital Manager",
      company: "Marketing Pro",
      location: "Rosario, Argentina",
      salary: "$95.000 - $140.000",
      type: "Tiempo Completo",
      posted: "Hace 4 días",
      logo: "https://ui-avatars.com/api/?name=Marketing+Pro&background=f59e0b&color=fff&size=80",
      description: "Gestiona campañas digitales y estrategias de marketing para marcas líderes.",
      tags: ["SEO", "Google Ads", "Social Media", "Analytics"]
    },
    {
      id: 5,
      title: "Redactor de Contenido",
      company: "ContentHub",
      location: "Remoto",
      salary: "$60.000 - $85.000",
      type: "Medio Tiempo",
      posted: "Hace 5 días",
      logo: "https://ui-avatars.com/api/?name=ContentHub&background=ec4899&color=fff&size=80",
      description: "Crea contenido atractivo y optimizado para SEO para diversos clientes.",
      tags: ["Copywriting", "SEO", "Content Strategy", "WordPress"]
    },
    {
      id: 6,
      title: "Gerente de Recursos Humanos",
      company: "PeopleFirst Inc",
      location: "Mendoza, Argentina",
      salary: "$110.000 - $160.000",
      type: "Tiempo Completo",
      posted: "Hace 1 semana",
      logo: "https://ui-avatars.com/api/?name=PeopleFirst&background=6366f1&color=fff&size=80",
      description: "Lidera el departamento de RRHH y desarrolla estrategias de talento.",
      tags: ["Reclutamiento", "Gestión de Talento", "Cultura Organizacional"]
    }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Search Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
        padding: '3rem 0',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Encuentra Tu Próximo Empleo
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem' }}>
            {jobs.length} oportunidades laborales disponibles
          </p>
          
          {/* Search Bar */}
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr auto',
            gap: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem' }}>
              <Search size={20} style={{ color: '#94a3b8' }} />
              <input 
                type="text"
                placeholder="Título del trabajo, palabras clave..."
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9375rem',
                  width: '100%',
                  color: '#1e293b'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem', borderLeft: '1px solid #e2e8f0' }}>
              <MapPin size={20} style={{ color: '#94a3b8' }} />
              <select style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.9375rem',
                width: '100%',
                color: '#1e293b',
                background: 'transparent',
                cursor: 'pointer'
              }}>
                <option>Todas las ubicaciones</option>
                <option>Buenos Aires</option>
                <option>Córdoba</option>
                <option>Rosario</option>
                <option>Remoto</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem', borderLeft: '1px solid #e2e8f0' }}>
              <Briefcase size={20} style={{ color: '#94a3b8' }} />
              <select style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.9375rem',
                width: '100%',
                color: '#1e293b',
                background: 'transparent',
                cursor: 'pointer'
              }}>
                <option>Todas las categorías</option>
                <option>Tecnología</option>
                <option>Diseño</option>
                <option>Marketing</option>
                <option>RRHH</option>
              </select>
            </div>
            <button style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.875rem 2rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}>
              <Search size={18} />
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          {/* Filters Sidebar */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Filter size={20} style={{ color: '#3b82f6' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>
                  Filtros
                </h3>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tipo de Empleo
                </h4>
                {['Tiempo Completo', 'Medio Tiempo', 'Freelance', 'Contrato'].map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ cursor: 'pointer' }} />
                    <span style={{ fontSize: '0.9375rem', color: '#475569' }}>{type}</span>
                  </label>
                ))}
              </div>

              <div style={{ marginBottom: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Experiencia
                </h4>
                {['Sin experiencia', 'Junior', 'Semi-Senior', 'Senior'].map(level => (
                  <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ cursor: 'pointer' }} />
                    <span style={{ fontSize: '0.9375rem', color: '#475569' }}>{level}</span>
                  </label>
                ))}
              </div>

              <button style={{
                width: '100%',
                padding: '0.75rem',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                Mostrando <strong>{jobs.length}</strong> empleos
              </p>
              <select style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                color: '#475569',
                cursor: 'pointer'
              }}>
                <option>Más recientes</option>
                <option>Salario más alto</option>
                <option>Más relevantes</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {jobs.map(job => (
                <article 
                  key={job.id}
                  style={{
                    background: 'white',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <img 
                      src={job.logo} 
                      alt={job.company}
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '0.5rem',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <h3 style={{ 
                          fontSize: '1.375rem', 
                          fontWeight: '700', 
                          color: '#1e293b',
                          marginBottom: '0.375rem' 
                        }}>
                          {job.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Building2 size={16} style={{ color: '#64748b' }} />
                          <span style={{ color: '#64748b', fontSize: '0.9375rem', fontWeight: '500' }}>
                            {job.company}
                          </span>
                        </div>
                      </div>
                      
                      <p style={{ 
                        color: '#64748b', 
                        marginBottom: '1rem',
                        fontSize: '0.9375rem',
                        lineHeight: '1.6'
                      }}>
                        {job.description}
                      </p>

                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        {job.tags.map(tag => (
                          <span 
                            key={tag}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: '#f1f5f9',
                              color: '#475569',
                              borderRadius: '9999px',
                              fontSize: '0.8125rem',
                              fontWeight: '500'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748b' }}>
                            <MapPin size={16} />
                            <span>{job.location}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748b' }}>
                            <DollarSign size={16} />
                            <span>{job.salary}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748b' }}>
                            <Clock size={16} />
                            <span>{job.type}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button style={{
                            padding: '0.5rem 1.25rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s'
                          }}>
                            Postular
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

