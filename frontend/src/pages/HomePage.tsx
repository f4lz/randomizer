import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoriesApi } from '../api/api';
import { Category } from '../types';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setCategories(data));
  }, []);

  return (
    <div className="container">
      <p className="page-title">Что выбрать сегодня? 🎲</p>
      <p className="page-sub">Выбери категорию и позволь случаю решить за тебя</p>
      <div className="category-grid">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            className="category-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => navigate(`/category/${cat.id}`)}
          >
            <div className="icon">{cat.icon}</div>
            <div className="name">{cat.name}</div>
            <div className="count">{cat.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
