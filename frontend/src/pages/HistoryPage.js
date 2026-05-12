import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { spinApi } from '../api/api';
export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    useEffect(() => {
        spinApi.getHistory().then(({ data }) => setHistory(data));
    }, []);
    const formatDate = (str) => new Date(str).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
    return (_jsxs("div", { className: "container", children: [_jsxs("p", { className: "page-title", children: [_jsx(ClipboardList, { size: 20, style: { verticalAlign: 'middle', marginRight: 8 } }), "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0432\u044B\u0431\u043E\u0440\u043E\u0432"] }), _jsx("p", { className: "page-sub", children: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 20 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432" }), history.length === 0 && (_jsx("p", { className: "empty", children: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u0443\u0441\u0442\u0430. \u0417\u0430\u043F\u0443\u0441\u0442\u0438 \u0440\u0430\u043D\u0434\u043E\u043C\u0430\u0439\u0437\u0435\u0440!" })), history.map(record => (_jsxs("div", { className: "history-item", children: [_jsxs("div", { className: "h-top", children: [_jsxs("div", { children: [_jsxs("span", { className: "h-cat", children: [record.item?.category?.name, " \u00B7 "] }), _jsx("span", { className: "h-name", children: record.item?.name })] }), _jsx("span", { className: "h-date", children: formatDate(record.created_at) })] }), record.ai_response && (_jsx("div", { className: "h-ai", children: _jsx(ReactMarkdown, { children: record.ai_response }) }))] }, record.id)))] }));
}
