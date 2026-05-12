import { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { favoritesApi } from '../api/api';
import { Favorite } from '../types';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const load = () => favoritesApi.getAll().then(({ data }) => setFavorites(data));
  useEffect(() => { load(); }, []);

  const handleRemove = async (itemId: number) => {
    await favoritesApi.remove(itemId);
    load();
  };

  return (
    <div className="container">
      <p className="page-title"><Heart size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />Избранное</p>
      <p className="page-sub">Твои сохранённые варианты</p>

      {favorites.length === 0 && (
        <p className="empty">Избранное пусто. Добавь варианты из рандомайзера!</p>
      )}

      {favorites.map(fav => (
        <div key={fav.id} className="item-row">
          <div>
            <span style={{ color: 'var(--accent-light)', fontSize: '.85rem' }}>
              {fav.item?.category?.name} ·{' '}
            </span>
            <span className="item-name">{fav.item?.name}</span>
          </div>
          <button className="btn-icon" title="Удалить из избранного"
            onClick={() => handleRemove(fav.item.id)}><Trash2 size={16} /></button>
        </div>
      ))}
    </div>
  );
}
