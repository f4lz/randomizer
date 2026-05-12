import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { favoritesApi } from '../api/api';
export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const load = () => favoritesApi.getAll().then(({ data }) => setFavorites(data));
    useEffect(() => { load(); }, []);
    const handleRemove = async (itemId) => {
        await favoritesApi.remove(itemId);
        load();
    };
    return (_jsxs("div", { className: "container", children: [_jsxs("p", { className: "page-title", children: [_jsx(Heart, { size: 20, style: { verticalAlign: 'middle', marginRight: 8 } }), "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435"] }), _jsx("p", { className: "page-sub", children: "\u0422\u0432\u043E\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B" }), favorites.length === 0 && (_jsx("p", { className: "empty", children: "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u043F\u0443\u0441\u0442\u043E. \u0414\u043E\u0431\u0430\u0432\u044C \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B \u0438\u0437 \u0440\u0430\u043D\u0434\u043E\u043C\u0430\u0439\u0437\u0435\u0440\u0430!" })), favorites.map(fav => (_jsxs("div", { className: "item-row", children: [_jsxs("div", { children: [_jsxs("span", { style: { color: 'var(--accent-light)', fontSize: '.85rem' }, children: [fav.item?.category?.name, " \u00B7", ' '] }), _jsx("span", { className: "item-name", children: fav.item?.name })] }), _jsx("button", { className: "btn-icon", title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0438\u0437 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E", onClick: () => handleRemove(fav.item.id), children: _jsx(Trash2, { size: 16 }) })] }, fav.id)))] }));
}
