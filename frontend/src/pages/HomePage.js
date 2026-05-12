import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { categoriesApi } from '../api/api';
import CategoryIcon from '../components/CategoryIcon';
export default function HomePage() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        categoriesApi.getAll().then(({ data }) => setCategories(data));
    }, []);
    return (_jsxs("div", { className: "container", children: [_jsxs("p", { className: "page-title", children: ["\u0427\u0442\u043E \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0441\u0435\u0433\u043E\u0434\u043D\u044F? ", _jsx(Shuffle, { size: 20, style: { verticalAlign: 'middle' } })] }), _jsx("p", { className: "page-sub", children: "\u0412\u044B\u0431\u0435\u0440\u0438 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E \u0438 \u043F\u043E\u0437\u0432\u043E\u043B\u044C \u0441\u043B\u0443\u0447\u0430\u044E \u0440\u0435\u0448\u0438\u0442\u044C \u0437\u0430 \u0442\u0435\u0431\u044F" }), _jsx("div", { className: "category-grid", children: categories.map((cat, i) => (_jsxs(motion.div, { className: "category-card", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.07 }, onClick: () => navigate(`/category/${cat.id}`), children: [_jsx("div", { className: "icon", children: _jsx(CategoryIcon, { name: cat.icon }) }), _jsx("div", { className: "name", children: cat.name }), _jsx("div", { className: "count", children: cat.description })] }, cat.id))) })] }));
}
