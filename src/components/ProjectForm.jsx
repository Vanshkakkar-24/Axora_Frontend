import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import ErrorAlert from './ErrorAlert.jsx';

export default function ProjectForm({ onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  const [error, setError] = useState(null);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError(null);

    if (form.name.trim().length < 2) {
      setError(new Error('Project name must be at least 2 characters'));
      return;
    }

    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim()
      });
    } catch (submitError) {
      setError(submitError);
    }
  };

  return (
    <form className="space-y-5" onSubmit={submit}>
      <ErrorAlert error={error} />

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Project Name
        </label>

        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          name="name"
          value={form.name}
          onChange={updateField}
          minLength={2}
          maxLength={120}
          required
          placeholder="Enter project name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Description
        </label>

        <textarea
          className="min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          name="description"
          value={form.description}
          onChange={updateField}
          rows={4}
          maxLength={1000}
          placeholder="Describe your project..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
          type="submit"
          disabled={saving}
        >
          {saving && <Loader2 className="animate-spin" size={18} />}
          Create Project
        </button>
      </div>
    </form>
  );
}