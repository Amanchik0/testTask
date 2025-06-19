import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../animations.css';

const API_BASE_URL = 'http://localhost:8080';

const Profile = ({ user, token }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    loading: true
  });
  const [userProducts, setUserProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const apiHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    if (token) loadUserProducts();
  }, [token]);

  const loadUserProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/my-products`, { headers: apiHeaders });
      const products = response.data.products || [];
      setUserProducts(products);
      
      const totalValue = products.reduce((sum, product) => sum + product.price, 0);
      setStats({
        totalProducts: response.data.count || products.length,
        totalValue: totalValue,
        loading: false
      });
    } catch (error) {
      console.error('Ошибка загрузки товаров пользователя:', error);
      setStats(prev => ({ ...prev, loading: false }));
    } finally {
      setLoadingProducts(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1 className="gradient-text" style={{ marginBottom: '30px', textAlign: 'center' }}>
          Мой профиль
        </h1>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="card" style={{ marginBottom: '30px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
              <h2>Личная информация</h2>
            </div>
            <div style={{ padding: '20px' }}>
              <div className="grid grid-2">
                <div>
                  <h3 style={{ marginBottom: '8px', color: '#666' }}>Email:</h3>
                  <p style={{ fontSize: '18px', marginBottom: '20px' }}>{user.email}</p>
                </div>
                <div>
                  <h3 style={{ marginBottom: '8px', color: '#666' }}>ID пользователя:</h3>
                  <p style={{ fontSize: '18px', marginBottom: '20px' }}>{user.id}</p>
                </div>
                <div>
                  <h3 style={{ marginBottom: '8px', color: '#666' }}>Имя:</h3>
                  <p style={{ fontSize: '18px', marginBottom: '20px' }}>{user.first_name}</p>
                </div>
                <div>
                  <h3 style={{ marginBottom: '8px', color: '#666' }}>Фамилия:</h3>
                  <p style={{ fontSize: '18px', marginBottom: '20px' }}>{user.last_name}</p>
                </div>
              </div>

              {user.created_at && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
                  <h3 style={{ marginBottom: '8px', color: '#666' }}>Дата регистрации:</h3>
                  <p style={{ fontSize: '18px' }}>
                    {new Date(user.created_at).toLocaleDateString('ru-RU', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>



          <div className="card">
            <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
              <h3>Мои товары ({userProducts.length})</h3>
            </div>

            {loadingProducts ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Загрузка товаров...
              </div>
            ) : userProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p style={{ marginBottom: '20px' }}>У вас пока нет товаров</p>
                <Link to="/products" className="btn btn-primary">Добавить первый товар</Link>
              </div>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Название</th>
                      <th>Описание</th>
                      <th>Цена</th>
                      <th>Дата создания</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <Link to={`/products/${product.id}`} style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>
                            {product.name}
                          </Link>
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          {product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
                        </td>
                        <td style={{ fontWeight: '600', color: '#28a745' }}>${product.price}</td>
                        <td>{new Date(product.created_at).toLocaleDateString('ru-RU')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ 
                  margin: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{ fontWeight: '500' }}>Всего товаров: {userProducts.length}</span>
                  <span style={{ fontWeight: '600', color: '#28a745', fontSize: '18px' }}>
                    Общая стоимость: ${stats.totalValue.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;