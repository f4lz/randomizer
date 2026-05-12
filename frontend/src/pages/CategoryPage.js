import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Sparkles, Heart, Trash2, Ban, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CategoryIcon from '../components/CategoryIcon';
import { categoriesApi, itemsApi, spinApi, favoritesApi, excludedApi, aiApi } from '../api/api';
export default function CategoryPage() {
    const { id } = useParams();
    const categoryId = Number(id);
    const [category, setCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [aiText, setAiText] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [generatedIdea, setGeneratedIdea] = useState('');
    const [ideaLoading, setIdeaLoading] = useState(false);
    const loadItems = () => categoriesApi.getItems(categoryId).then(({ data }) => setItems(data));
    useEffect(() => {
        categoriesApi.getAll().then(({ data }) => {
            setCategory(data.find((c) => c.id === categoryId) ?? null);
        });
        loadItems();
    }, [categoryId]);
    const handleSpin = async () => {
        setSpinning(true);
        setResult(null);
        setAiText('');
        try {
            const { data } = await spinApi.spin(categoryId);
            setResult(data);
            setAiLoading(true);
            const { data: ai } = await spinApi.getAi(data.history_id);
            setAiText(ai.text);
        }
        catch (e) {
            alert(e.response?.data?.message || 'Нет доступных вариантов');
        }
        finally {
            setSpinning(false);
            setAiLoading(false);
        }
    };
    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.trim())
            return;
        await itemsApi.create(newItem.trim(), categoryId);
        setNewItem('');
        loadItems();
    };
    const handleDelete = async (itemId) => {
        await itemsApi.remove(itemId);
        loadItems();
    };
    const handleFavorite = async (itemId) => {
        await favoritesApi.add(itemId);
        alert('Добавлено в избранное');
    };
    const handleExclude = async (itemId) => {
        await excludedApi.add(itemId);
        setResult(null);
        alert('Вариант временно исключён');
    };
    const handleGenerateIdea = async () => {
        if (!category)
            return;
        setIdeaLoading(true);
        setGeneratedIdea('');
        try {
            const { data } = await aiApi.generate(category.name);
            setGeneratedIdea(data.idea);
        }
        catch {
            setGeneratedIdea('Не удалось получить идею. Проверьте настройки ИИ.');
        }
        finally {
            setIdeaLoading(false);
        }
    };
    return (_jsxs("div", { className: "container", children: [_jsx(Link, { to: "/", className: "back-link", children: "\u2190 \u041D\u0430\u0437\u0430\u0434" }), _jsxs("p", { className: "page-title", children: [category && _jsx(CategoryIcon, { name: category.icon, size: 24 }), " ", category?.name] }), _jsxs("div", { className: "spin-row", children: [_jsxs(motion.button, { className: "spin-btn", onClick: handleSpin, disabled: spinning || ideaLoading, whileTap: { scale: 0.95 }, animate: spinning ? { rotate: [0, 360] } : { rotate: 0 }, transition: spinning ? { duration: 0.6, repeat: Infinity, ease: 'linear' } : {}, children: [_jsx(Shuffle, { size: 16, style: { marginRight: 6 } }), spinning ? 'Выбираем...' : 'Случайный выбор'] }), _jsxs(motion.button, { className: "ai-generate-btn", onClick: handleGenerateIdea, disabled: spinning || ideaLoading, whileTap: { scale: 0.95 }, children: [_jsx(Sparkles, { size: 16, style: { marginRight: 6 } }), ideaLoading ? 'Думаю...' : 'Придумай за меня'] })] }), _jsx(AnimatePresence, { children: (generatedIdea || ideaLoading) && (_jsxs(motion.div, { className: "result-card", initial: { opacity: 0, scale: 0.9, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9 }, children: [_jsxs("div", { className: "ai-idea-label", children: [_jsx(Sparkles, { size: 14, style: { marginRight: 4 } }), "\u0418\u0434\u0435\u044F \u043E\u0442 \u0418\u0418"] }), ideaLoading
                            ? _jsx("p", { className: "ai-loading", children: "\u0413\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u044E \u0438\u0434\u0435\u044E..." })
                            : _jsxs(_Fragment, { children: [_jsx("div", { className: "result-name", children: generatedIdea }), _jsx("div", { className: "result-actions", children: _jsx("button", { onClick: async () => {
                                                await itemsApi.create(generatedIdea, categoryId);
                                                setGeneratedIdea('');
                                                loadItems();
                                            }, children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B" }) })] })] })) }), _jsx(AnimatePresence, { children: result && (_jsxs(motion.div, { className: "result-card", initial: { opacity: 0, scale: 0.9, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9 }, children: [_jsx("div", { className: "result-name", children: result.item.name }), _jsxs("div", { className: "result-actions", children: [_jsxs("button", { onClick: handleSpin, children: [_jsx(RefreshCw, { size: 14, style: { marginRight: 4 } }), "\u0415\u0449\u0451 \u0440\u0430\u0437"] }), _jsxs("button", { onClick: () => handleFavorite(result.item.id), children: [_jsx(Heart, { size: 14, style: { marginRight: 4 } }), "\u0412 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435"] }), _jsxs("button", { onClick: () => handleExclude(result.item.id), children: [_jsx(Ban, { size: 14, style: { marginRight: 4 } }), "\u041D\u0435 \u044D\u0442\u043E\u0442"] })] }), aiLoading && _jsxs("p", { className: "ai-loading", children: [_jsx(Sparkles, { size: 14, style: { marginRight: 4 } }), "\u0418\u0418 \u0433\u043E\u0442\u043E\u0432\u0438\u0442 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E..."] }), aiText && _jsx("div", { className: "ai-block", children: _jsx(ReactMarkdown, { children: aiText }) })] })) }), _jsxs("div", { style: { marginTop: 32 }, children: [_jsx("div", { className: "items-header", children: _jsxs("h2", { children: ["\u0412\u0430\u0440\u0438\u0430\u043D\u0442\u044B (", items.length, ")"] }) }), _jsxs("form", { className: "add-item-row", onSubmit: handleAddItem, children: [_jsx("input", { value: newItem, onChange: e => setNewItem(e.target.value), placeholder: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u0430\u0440\u0438\u0430\u043D\u0442..." }), _jsx("button", { type: "submit", className: "btn-add", children: "+" })] }), items.length === 0 && (_jsx("p", { className: "empty", children: "\u041D\u0435\u0442 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u043E\u0432. \u0414\u043E\u0431\u0430\u0432\u044C \u043F\u0435\u0440\u0432\u044B\u0439!" })), items.map(item => (_jsxs("div", { className: "item-row", children: [_jsx("span", { className: "item-name", children: item.name }), _jsxs("div", { className: "item-actions", children: [_jsx("button", { className: "btn-icon", title: "\u0412 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435", onClick: () => handleFavorite(item.id), children: _jsx(Heart, { size: 15 }) }), _jsx("button", { className: "btn-icon", title: "\u0418\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u044C", onClick: () => handleExclude(item.id), children: _jsx(Ban, { size: 15 }) }), _jsx("button", { className: "btn-icon", title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C", onClick: () => handleDelete(item.id), children: _jsx(Trash2, { size: 15 }) })] })] }, item.id)))] })] }));
}
