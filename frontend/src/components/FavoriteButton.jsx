import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '../lib/toast';

export default function FavoriteButton({ type, id, className = '' }) {
  const { isFav, toggle } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const saved = isFav(type, id);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    await toggle(type, id);
  };

  return (
    <button
      onClick={handleClick}
      title={saved ? 'Remove from favorites' : 'Save to favorites'}
      className={`p-2 rounded-full transition-all ${
        saved
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/40'
          : 'bg-white/90 text-slate-400 hover:bg-red-50 hover:text-red-500'
      } ${className}`}
    >
      <Heart size={16} className={saved ? 'fill-current' : ''} />
    </button>
  );
}
