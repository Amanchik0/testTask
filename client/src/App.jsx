import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Products from './pages/Products';
import ProductDetail from './pages/product';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Загрузка...</div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Navbar user={user} onLogout={logout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/profile" /> : <Auth onLogin={login} />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} token={token} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/products" 
            element={user ? <Products token={token} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/products/:id" 
            element={<ProductDetail />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;