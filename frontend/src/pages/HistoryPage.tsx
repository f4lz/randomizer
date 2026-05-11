import { useEffect, useState } from 'react';
import { spinApi } from '../api/api';
import { HistoryRecord } from '../types';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    spinApi.getHistory().then(({ data }) => setHistory(data));
  }, []);

  const formatDate = (str: string) =>
    new Date(str).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="container">
      <p className="page-title">📋 История выборов</p>
      <p className="page-sub">Последние 20 результатов</p>

      {history.length === 0 && (
        <p className="empty">История пуста. Запусти рандомайзер!</p>
      )}

      {history.map(record => (
        <div key={record.id} className="history-item">
          <div className="h-top">
            <div>
              <span className="h-cat">{record.item?.category?.name} · </span>
              <span className="h-name">{record.item?.name}</span>
            </div>
            <span className="h-date">{formatDate(record.created_at)}</span>
          </div>
          {record.ai_response && (
            <p className="h-ai">{record.ai_response}</p>
          )}
        </div>
      ))}
    </div>
  );
}
