import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../animations.css';

const API_BASE_URL = 'http://localhost:8080';

const Products = ({ token }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const apiHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchProducts();
    } else {
      setFilteredProducts(allProducts);
    }
  }, [searchTerm, allProducts]);

  const loadAllProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/public/products`);
      setAllProducts(response.data.products || []);
      setFilteredProducts(response.data.products || []);
    } catch (error) {
      setMessage('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(allProducts);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/public/products/search?name=${encodeURIComponent(searchTerm)}`
      );
      setFilteredProducts(response.data.products || []);
    } catch (error) {
      setMessage('Ошибка поиска товаров');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/api/products`,
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price)
        },
        { headers: apiHeaders }
      );
      
      setMessage('Товар успешно создан');
      setFormData({ name: '', description: '', price: '' });
      setShowForm(false);
      loadAllProducts();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Ошибка создания товара');
    } finally {
      setLoading(false);
    }
  };

  if (loading && allProducts.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Загрузка товаров...
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 className="gradient-text">Каталог товаров</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
            onMouseEnter={(e) => e.target.classList.add('animate-pulse')}
            onAnimationEnd={(e) => e.target.classList.remove('animate-pulse')}
          >
            {showForm ? '✕ Отмена' : '+ Добавить товар'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`message ${message.includes('Ошибка') ? 'message-error animate-shake' : 'message-success'}`}>
            {message}
            <button onClick={() => setMessage('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          </div>
        )}

        {/* Popup форма */}
        {showForm && (
          <>
            <div className="popup-backdrop" style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000
            }} onClick={() => setShowForm(false)} />
            
            <div className="popup-container" style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white', borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
              zIndex: 1001, width: '90%', maxWidth: '500px'
            }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Добавить новый товар</h3>
                <button onClick={() => setShowForm(false)} style={{
                  background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'
                }}>×</button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Название товара:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Описание:</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Цена:</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="submit" className="btn btn-success" disabled={loading} style={{ flex: 1 }}>
                    {loading ? 'Создание...' : 'Создать товар'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Поиск */}
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '16px' }}>Поиск товаров</h3>
          <input
            type="text"
            placeholder="Введите название товара для поиска..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
          {searchTerm && <div style={{ marginTop: '10px', color: '#666' }}>Найдено: {filteredProducts.length}</div>}
        </div>

        {/* Список товаров */}
        <div className="card">
          <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
            <h3>{searchTerm ? `Результаты поиска (${filteredProducts.length})` : `Все товары (${filteredProducts.length})`}</h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              {searchTerm ? 'По вашему запросу товары не найдены' : 'Товары пока не добавлены'}
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Описание</th>
                  <th>Цена</th>
                  <th>Владелец</th>
                  <th>Дата создания</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <Link to={`/products/${product.id}`} style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>
                        {product.name}
                      </Link>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      {product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}
                    </td>
                    <td style={{ fontWeight: '600', color: '#28a745' }}>${product.price}</td>
                    <td>ID: {product.user_id}</td>
                    <td>{new Date(product.created_at).toLocaleDateString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;