import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Consejos para Destacar en tu Próxima Entrevista de Trabajo",
      excerpt: "Descubre las estrategias más efectivas para impresionar a los reclutadores y aumentar tus posibilidades de conseguir el trabajo de tus sueños.",
      author: "María González",
      date: "15 Feb 2026",
      readTime: "5 min",
      category: "Consejos",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Las Habilidades Más Demandadas en 2026",
      excerpt: "El mercado laboral está en constante evolución. Conoce las competencias que las empresas están buscando activamente este año.",
      author: "Carlos Rodríguez",
      date: "10 Feb 2026",
      readTime: "7 min",
      category: "Tendencias",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Cómo Negociar tu Salario: Guía Completa",
      excerpt: "Aprende a negociar tu salario de manera efectiva con técnicas probadas que te ayudarán a obtener la remuneración que mereces.",
      author: "Ana Martínez",
      date: "5 Feb 2026",
      readTime: "6 min",
      category: "Desarrollo Profesional",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Trabajo Remoto: Ventajas y Desafíos",
      excerpt: "El trabajo remoto se ha convertido en la norma para muchos profesionales. Explora sus beneficios y cómo superar los desafíos comunes.",
      author: "Luis Fernández",
      date: "1 Feb 2026",
      readTime: "8 min",
      category: "Trabajo Remoto",
      image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Cómo Crear un CV que Destaque",
      excerpt: "Tu currículum es tu carta de presentación. Aprende a diseñar un CV que capture la atención de los reclutadores en segundos.",
      author: "Patricia Silva",
      date: "28 Ene 2026",
      readTime: "5 min",
      category: "Consejos",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "LinkedIn: Optimiza tu Perfil Profesional",
      excerpt: "LinkedIn es una herramienta esencial para networking profesional. Descubre cómo optimizar tu perfil para atraer oportunidades.",
      author: "Roberto Díaz",
      date: "25 Ene 2026",
      readTime: "6 min",
      category: "Redes Profesionales",
      image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&h=600&fit=crop"
    }
  ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <div style={{ background: '#fcf7ef', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #d7b24c 0%, #8f6b12 100%)', 
        padding: '4rem 0',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' }}>
            Blog Profesional
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px' }}>
            Consejos, tendencias y recursos para impulsar tu carrera profesional
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Featured Post */}
        <div style={{ 
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '3rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          <div style={{ 
            backgroundImage: `url(${featuredPost.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '400px'
          }}></div>
          <div style={{ padding: '2rem' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.25rem 1rem',
              background: '#f7e7b8',
              color: '#8f6b12',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              {featuredPost.category}
            </span>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#2f2416',
              marginBottom: '1rem' 
            }}>
              {featuredPost.title}
            </h2>
            <p style={{ 
              color: '#7e705c', 
              lineHeight: '1.75',
              marginBottom: '1.5rem' 
            }}>
              {featuredPost.excerpt}
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              color: '#7e705c'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} />
                <span>{featuredPost.author}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} />
                <span>{featuredPost.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
            <Link 
              to={`/blog/${featuredPost.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#c79b2b',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              Leer más <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Blog Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {regularPosts.map(post => (
            <article 
              key={post.id}
              style={{
                background: 'white',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                height: '200px',
                backgroundImage: `url(${post.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: '#fbefc9',
                  color: '#9e7b18',
                  borderRadius: '9999px',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem'
                }}>
                  {post.category}
                </span>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#2f2416',
                  marginBottom: '0.75rem',
                  lineHeight: '1.4'
                }}>
                  {post.title}
                </h3>
                <p style={{
                  color: '#7e705c',
                  fontSize: '0.9375rem',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {post.excerpt}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.8125rem',
                  color: '#aa9a7f',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e7dcc6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
