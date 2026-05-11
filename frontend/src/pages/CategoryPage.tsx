import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { categoriesApi, itemsApi, spinApi, favoritesApi, excludedApi, aiApi } from '../api/api';
import { Category, Item, SpinResult } from '../types';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);

  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState('');
  const [ideaLoading, setIdeaLoading] = useState(false);

  const loadItems = () =>
    categoriesApi.getItems(categoryId).then(({ data }) => setItems(data));

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => {
      setCategory(data.find((c: Category) => c.id === categoryId) ?? null);
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
    } catch (e: any) {
      alert(e.response?.data?.message || 'Нет доступных вариантов');
    } finally {
      setSpinning(false);
      setAiLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    await itemsApi.create(newItem.trim(), categoryId);
    setNewItem('');
    loadItems();
  };

  const handleDelete = async (itemId: number) => {
    await itemsApi.remove(itemId);
    loadItems();
  };

  const handleFavorite = async (itemId: number) => {
    await favoritesApi.add(itemId);
    alert('Добавлено в избранное ❤️');
  };

  const handleExclude = async (itemId: number) => {
    await excludedApi.add(itemId);
    setResult(null);
    alert('Вариант временно исключён 🚫');
  };

  const handleGenerateIdea = async () => {
    if (!category) return;
    setIdeaLoading(true);
    setGeneratedIdea('');
    try {
      const { data } = await aiApi.generate(category.name);
      setGeneratedIdea(data.idea);
    } catch {
      setGeneratedIdea('Не удалось получить идею. Проверьте настройки ИИ.');
    } finally {
      setIdeaLoading(false);
    }
  };

  return (
    <div className="container">
      <Link to="/" className="back-link">← Назад</Link>

      <p className="page-title">
        {category?.icon} {category?.name}
      </p>

      {/* Кнопки запуска */}
      <div className="spin-row">
        <motion.button
          className="spin-btn"
          onClick={handleSpin}
          disabled={spinning || ideaLoading}
          whileTap={{ scale: 0.95 }}
          animate={spinning ? { rotate: [0, 360] } : { rotate: 0 }}
          transition={spinning ? { duration: 0.6, repeat: Infinity, ease: 'linear' } : {}}
        >
          {spinning ? '🎲 Выбираем...' : '🎲 Случайный выбор'}
        </motion.button>

        <motion.button
          className="ai-generate-btn"
          onClick={handleGenerateIdea}
          disabled={spinning || ideaLoading}
          whileTap={{ scale: 0.95 }}
        >
          {ideaLoading ? '✨ Думаю...' : '✨ Придумай за меня'}
        </motion.button>
      </div>

      {/* Идея от ИИ */}
      <AnimatePresence>
        {(generatedIdea || ideaLoading) && (
          <motion.div
            className="result-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="ai-idea-label">✨ Идея от ИИ</div>
            {ideaLoading
              ? <p className="ai-loading">Генерирую идею...</p>
              : <div className="result-name">{generatedIdea}</div>
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* Результат рандомайзера */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="result-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="result-name">{result.item.name}</div>
            <div className="result-actions">
              <button onClick={handleSpin}>🔄 Ещё раз</button>
              <button onClick={() => handleFavorite(result.item.id)}>❤️ В избранное</button>
              <button onClick={() => handleExclude(result.item.id)}>🚫 Не этот</button>
            </div>
            {aiLoading && <p className="ai-loading">✨ ИИ готовит информацию...</p>}
            {aiText && <div className="ai-block">{aiText}</div>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Список вариантов */}
      <div style={{ marginTop: 32 }}>
        <div className="items-header">
          <h2>Варианты ({items.length})</h2>
        </div>

        <form className="add-item-row" onSubmit={handleAddItem}>
          <input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            placeholder="Добавить вариант..."
          />
          <button type="submit" className="btn-add">+</button>
        </form>

        {items.length === 0 && (
          <p className="empty">Нет вариантов. Добавь первый!</p>
        )}

        {items.map(item => (
          <div key={item.id} className="item-row">
            <span className="item-name">{item.name}</span>
            <div className="item-actions">
              <button className="btn-icon" title="В избранное"
                onClick={() => handleFavorite(item.id)}>❤️</button>
              <button className="btn-icon" title="Исключить"
                onClick={() => handleExclude(item.id)}>🚫</button>
              {item.owner && (
                <button className="btn-icon" title="Удалить"
                  onClick={() => handleDelete(item.id)}>🗑️</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
