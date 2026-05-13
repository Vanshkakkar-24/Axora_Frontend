import { X } from 'lucide-react';

export default function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      role="presentation"
    >
      <section
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1120] shadow-[0_0_60px_rgba(0,0,0,0.65)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-white"
          >
            {title}
          </h2>

          <button
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            type="button"
            onClick={onClose}
            title="Close"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="bg-[#0b1120] p-6">
          {children}
        </div>
      </section>
    </div>
  );
}