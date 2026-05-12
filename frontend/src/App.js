import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import HistoryPage from './pages/HistoryPage';
import FavoritesPage from './pages/FavoritesPage';
import AuthPage from './pages/AuthPage';
function PrivateRoute({ children }) {
    const { isAuth } = useAuth();
    return isAuth ? children : _jsx(Navigate, { to: "/auth", replace: true });
}
export default function App() {
    const { isAuth } = useAuth();
    return (_jsxs(_Fragment, { children: [isAuth && _jsx(Navbar, {}), _jsx("main", { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/auth", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: "/", element: _jsx(PrivateRoute, { children: _jsx(HomePage, {}) }) }), _jsx(Route, { path: "/category/:id", element: _jsx(PrivateRoute, { children: _jsx(CategoryPage, {}) }) }), _jsx(Route, { path: "/history", element: _jsx(PrivateRoute, { children: _jsx(HistoryPage, {}) }) }), _jsx(Route, { path: "/favorites", element: _jsx(PrivateRoute, { children: _jsx(FavoritesPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) })] }));
}
