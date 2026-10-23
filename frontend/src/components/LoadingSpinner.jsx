export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="spinner" />
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}
