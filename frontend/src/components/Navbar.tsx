import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav>
      <div className="inner">
        <NavLink to="/" className="logo">🎲 Рандомайзер</NavLink>
        <div className="nav-links">
          <NavLink to="/" end>Категории</NavLink>
          <NavLink to="/history">История</NavLink>
          <NavLink to="/favorites">Избранное</NavLink>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{user?.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Выйти</button>
        </div>
      </div>
    </nav>
  );
}
