import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../animations.css';

const API_BASE_URL = 'http://localhost:8080';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/public/products`);
      const products = response.data.products || [];
      
      const foundProduct = products.find(p => p.id === parseInt(id));
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('Товар не найден');
      }
    } catch (error) {
      console.error('Ошибка загрузки товара:', error);
      setError('Ошибка загрузки товара');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Загрузка товара...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
              {error || 'Товар не найден'}
            </h2>
            <button 
              onClick={() => navigate('/products')}
              className="btn btn-primary"
            >
              Вернуться к каталогу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Кнопка назад */}
        <div className="animate-slideInLeft" style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => navigate('/products')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            ← Назад к каталогу
          </button>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Основная информация */}
          <div className="card">
            <div style={{ padding: '24px', borderBottom: '1px solid #eee' }}>
              <h1 className="gradient-text" style={{ marginBottom: '8px' }}>{product.name}</h1>
              <p style={{ color: '#666', margin: 0 }}>Товар #{product.id}</p>
            </div>

            <div style={{ padding: '24px' }}>
              <div className="grid grid-2" style={{ marginBottom: '30px' }}>
                <div>
                  <h3 style={{ marginBottom: '8px', color: '#666' }}>Название:</h3>
                  <p style={{ fontSize: '18px', marginBottom: '20px' }}>{product.name}</p>
                </div>
                <div>
                  <h3 style={{ marginBottom: '8px', color: '#666' }}>Цена:</h3>
                  <p style={{ fontSize: '18px', marginBottom: '20px', color: '#28a745', fontWeight: '600' }}>
                    ${product.price}
                  </p>
                </div>
                <div>
                  <h3 style={{ marginBottom: '8px', color: '#666' }}>Владелец:</h3>
                  <p style={{ fontSize: '18px', marginBottom: '20px' }}>ID: {product.user_id}</p>
                </div>
                <div>
                  <h3 style={{ marginBottom: '8px', color: '#666' }}>Дата создания:</h3>
                  <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                    {new Date(product.created_at).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Описание */}
              <div>
                <h3 style={{ marginBottom: '12px', color: '#666' }}>Описание:</h3>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '20px', 
                  borderRadius: '8px',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  {product.description}
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="card delay-2">
            <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
              <h3>Дополнительная информация</h3>
            </div>
            <div style={{ padding: '20px' }}>
              <div className="grid grid-3">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h4 className="stat-number" style={{ fontSize: '24px', color: '#0066cc', marginBottom: '8px' }}>
                    ${product.price}
                  </h4>
                  <p style={{ color: '#666' }}>Цена товара</p>
                </div>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h4 className="stat-number delay-1" style={{ fontSize: '24px', color: '#28a745', marginBottom: '8px' }}>
                    #{product.id}
                  </h4>
                  <p style={{ color: '#666' }}>ID товара</p>
                </div>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h4 className="stat-number delay-2" style={{ fontSize: '24px', color: '#6c757d', marginBottom: '8px' }}>
                    {product.user_id}
                  </h4>
                  <p style={{ color: '#666' }}>ID владельца</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button 
              onClick={() => navigate('/products')}
              className="btn btn-primary animate-fadeInScale"
              style={{ marginRight: '12px' }}
            >
              Вернуться к каталогу
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="btn btn-secondary animate-fadeInScale delay-1"
            >
              Мой профиль
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;