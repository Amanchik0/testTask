import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  const features = [
    {
      title: "Каталог товаров",
      description: "Просматривайте все товары, добавляйте новые и используйте удобный поиск"
    },
    {
      title: "Личный кабинет",
      description: "Отслеживайте статистику и управляйте своими товарами в профиле"
    },
    {
      title: "Безопасность",
      description: "Ваши данные защищены современной системой аутентификации"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Управляйте товарами легко</h1>
          <p>
            Современная платформа для управления каталогом товаров. 
            Просматривайте общий каталог, добавляйте свои товары и отслеживайте статистику.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {user ? (
              <>
                <Link to="/products" className="btn btn-primary">
                  Каталог товаров
                </Link>
                <Link to="/profile" className="btn btn-secondary">
                  Мой профиль
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth" className="btn btn-primary">
                  Начать работу
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '36px' }}>
            Возможности платформы
          </h2>
          
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">
                  {index + 1}
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div className="container">
          <div className="grid grid-3">
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '48px', color: '#0066cc', marginBottom: '8px' }}>
                1000+
              </h3>
              <p style={{ color: '#666', fontSize: '18px' }}>Товаров в каталоге</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '48px', color: '#0066cc', marginBottom: '8px' }}>
                500+
              </h3>
              <p style={{ color: '#666', fontSize: '18px' }}>Активных пользователей</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '48px', color: '#0066cc', marginBottom: '8px' }}>
                99.9%
              </h3>
              <p style={{ color: '#666', fontSize: '18px' }}>Время работы</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '80px 0',
          textAlign: 'center' 
        }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>
              Готовы начать?
            </h2>
            <p style={{ fontSize: '20px', marginBottom: '30px', opacity: '0.9' }}>
              Присоединяйтесь к пользователям, которые управляют товарами эффективно
            </p>
            <Link 
              to="/auth" 
              className="btn"
              style={{ 
                background: 'white', 
                color: '#667eea',
                fontSize: '18px',
                padding: '16px 32px'
              }}
            >
              Зарегистрироваться бесплатно
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;