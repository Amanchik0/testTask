import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            ProductApp
          </Link>

          <ul className="navbar-nav">
            <li>
              <Link 
                to="/" 
                className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              >
                Главная
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link 
                    to="/products" 
                    className={`navbar-link ${isActive('/products') ? 'active' : ''}`}
                  >
                    Товары
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                  >
                    Профиль
                  </Link>
                </li>
                <li>
                  <button onClick={onLogout} className="btn btn-secondary">
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/auth" className="btn btn-primary">
                  Войти
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;