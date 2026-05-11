import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import HistoryPage from './pages/HistoryPage';
import FavoritesPage from './pages/FavoritesPage';
import AuthPage from './pages/AuthPage';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  const { isAuth } = useAuth();

  return (
    <>
      {isAuth && <Navbar />}
      <main>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/category/:id" element={<PrivateRoute><CategoryPage /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
