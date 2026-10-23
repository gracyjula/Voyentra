import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'No results found', message = 'Try adjusting your search or filters.', icon: Icon = SearchX }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
        <Icon size={28} className="text-slate-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">{message}</p>
      </div>
    </div>
  );
}
