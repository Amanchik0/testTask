import { useState } from 'react';
import axios from 'axios';
import '../animations.css';

const API_BASE_URL = 'http://localhost:8080';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);

      if (response.data.token) {
        onLogin(response.data.user, response.data.token);
        setMessage('Успешно!');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({ email: '', first_name: '', last_name: '', password: '' });
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <div className="card auth-card glass-effect" style={{ 
        width: '100%', 
        maxWidth: '400px',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '32px 24px 0' }}>
          <h2 className="gradient-text" style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            {isLogin ? 'Добро пожаловать!' : 'Создать аккаунт'}
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            {isLogin ? 'Войдите в свой аккаунт' : 'Заполните данные для регистрации'}
          </p>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          {/* Message */}
          {message && (
            <div className={`${message.includes('ошибка') || message.includes('error') ? 'message-error' : 'message-success'}`}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                background: message.includes('ошибка') || message.includes('error') 
                  ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                  : 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
                color: 'white',
                fontWeight: '500',
                textAlign: 'center'
              }}
            >
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '16px' }}
              />
            </div>

            {/* Registration fields */}
            {!isLogin && (
              <div className="form-switch">
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>Имя:</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="form-input"
                    required
                    style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>Фамилия:</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="form-input"
                    required
                    style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>Пароль:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
                minLength="6"
                style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '16px' }}
              />
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                marginBottom: '20px',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px'
              }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span className="animate-spin" style={{
                    width: '20px', height: '20px',
                    border: '2px solid #ffffff40',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%'
                  }}></span>
                  Загрузка...
                </span>
              ) : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </button>
          </form>

          {/* Toggle mode */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: '12px' }}>
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            </p>
            <button 
              onClick={toggleMode}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#667eea', 
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '16px',
                fontWeight: '600'
              }}
              className="btn"
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;