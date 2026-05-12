import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = isLogin
                ? await authApi.login(email, password)
                : await authApi.register(name, email, password);
            login(data.access_token, data.user);
            navigate('/');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Ошибка. Попробуйте снова.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "auth-page", children: _jsxs("div", { className: "card auth-card", children: [_jsx("h1", { children: isLogin ? 'Вход' : 'Регистрация' }), _jsxs("form", { onSubmit: handleSubmit, children: [!isLogin && (_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "\u0418\u043C\u044F" }), _jsx("input", { value: name, onChange: e => setName(e.target.value), placeholder: "\u0418\u0433\u043E\u0440\u044C", required: true })] })), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Email" }), _jsx("input", { type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "igor@example.com", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "\u041F\u0430\u0440\u043E\u043B\u044C" }), _jsx("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022", required: true, minLength: 6 })] }), error && _jsx("p", { className: "error-msg", children: error }), _jsx("button", { className: "btn-primary", disabled: loading, children: loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться' })] }), _jsxs("p", { className: "auth-toggle", children: [isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? ', _jsx("span", { onClick: () => { setIsLogin(!isLogin); setError(''); }, children: isLogin ? 'Зарегистрироваться' : 'Войти' })] })] }) }));
}
