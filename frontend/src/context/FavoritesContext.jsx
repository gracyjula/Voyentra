import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFavorites, addFavorite, removeFavoriteByTypeId } from '../lib/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext({ favorites: [], toggle: () => {}, isFav: () => false });

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const load = useCallback(() => {
    if (!user) { setFavorites([]); return; }
    getFavorites().then((r) => setFavorites(r.data)).catch(() => {});
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const isFav = (type, id) =>
    favorites.some((f) => f.item_type === type && f.item_id === id);

  const toggle = async (type, id) => {
    if (!user) return false; // signal: not logged in
    if (isFav(type, id)) {
      await removeFavoriteByTypeId({ item_type: type, item_id: id });
      setFavorites((prev) => prev.filter((f) => !(f.item_type === type && f.item_id === id)));
    } else {
      const res = await addFavorite({ item_type: type, item_id: id });
      setFavorites((prev) => [...prev, res.data]);
    }
    return true;
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFav, reload: load }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
