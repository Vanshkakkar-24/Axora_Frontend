import { X } from 'lucide-react';

export default function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <section
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-slate-800"
          >
            {title}
          </h2>

          <button
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            type="button"
            onClick={onClose}
            title="Close"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </section>
    </div>
  );
}