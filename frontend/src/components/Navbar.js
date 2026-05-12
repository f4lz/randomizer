import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useNavigate } from 'react-router-dom';
import { Shuffle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/auth');
    };
    return (_jsx("nav", { children: _jsxs("div", { className: "inner", children: [_jsxs(NavLink, { to: "/", className: "logo", children: [_jsx(Shuffle, { size: 18 }), " \u0420\u0430\u043D\u0434\u043E\u043C\u0430\u0439\u0437\u0435\u0440"] }), _jsxs("div", { className: "nav-links", children: [_jsx(NavLink, { to: "/", end: true, children: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438" }), _jsx(NavLink, { to: "/history", children: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F" }), _jsx(NavLink, { to: "/favorites", children: "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsx("span", { style: { color: 'var(--text-muted)', fontSize: '.9rem' }, children: user?.name }), _jsx("button", { className: "btn-logout", onClick: handleLogout, children: "\u0412\u044B\u0439\u0442\u0438" })] })] }) }));
}
