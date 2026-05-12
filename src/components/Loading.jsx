import { Loader2 } from 'lucide-react';

export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-slate-600">
      <Loader2 className="animate-spin" size={22} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}