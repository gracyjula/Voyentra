import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
        />
      ))}
      <span className="ml-1 text-sm text-slate-600 font-medium">{rating?.toFixed(1)}</span>
    </div>
  );
}
