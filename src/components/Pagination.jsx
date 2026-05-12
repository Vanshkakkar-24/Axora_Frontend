import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page <= 1}
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
        Page {pagination.page} of {pagination.pages}
      </div>

      <button
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page >= pagination.pages}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}