export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  category: Category;
  owner?: User;
}

export interface SpinResult {
  history_id: number;
  item: Item;
}

export interface HistoryRecord {
  id: number;
  item: Item;
  ai_response: string | null;
  created_at: string;
}

export interface Favorite {
  id: number;
  item: Item;
  created_at: string;
}
