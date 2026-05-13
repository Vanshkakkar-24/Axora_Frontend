import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import ErrorAlert from './ErrorAlert.jsx';

export default function ProjectForm({
  onSubmit,
  onCancel,
  saving
}) {
  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  const [error, setError] =
    useState(null);

  const updateField = (
    event
  ) => {
    setForm((current) => ({
      ...current,
      [event.target.name]:
        event.target.value
    }));
  };

  const submit = async (
    event
  ) => {
    event.preventDefault();

    setError(null);

    if (
      form.name.trim().length < 2
    ) {
      setError({
        message:
          'Project name must contain at least 2 characters'
      });

      return;
    }

    try {
      await onSubmit({
        name: form.name.trim(),
        description:
          form.description.trim()
      });
    } catch (submitError) {
      setError(submitError);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-3xl border border-white/10 bg-[#0a1020]/95 p-7 shadow-[0_0_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <ErrorAlert error={error} />

      {/* TITLE */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight text-white">
          New Project
        </h2>

        <p className="text-sm text-slate-400">
          Create and organize your workspace project.
        </p>
      </div>

      {/* PROJECT NAME */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold tracking-wide text-slate-200">
          Project Name
        </label>

        <input
          name="name"
          value={form.name}
          onChange={updateField}
          minLength={2}
          maxLength={120}
          required
          placeholder="Ex. Mobile App Redesign"
          className="w-full rounded-2xl border border-[#222b45] bg-[#0f172a] px-5 py-4 text-base font-medium text-white outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold tracking-wide text-slate-200">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          rows={6}
          maxLength={1000}
          placeholder="Describe your project goals, workflows, deliverables, and collaboration details..."
          className="min-h-[180px] w-full resize-none rounded-2xl border border-[#222b45] bg-[#0f172a] px-5 py-4 text-base leading-7 text-white outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-medium text-slate-300 transition-all hover:bg-white/[0.06] hover:text-white"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="flex min-w-[170px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:from-indigo-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving && (
            <Loader2
              className="animate-spin"
              size={18}
            />
          )}

          {saving
            ? 'Creating...'
            : 'Create Project'}
        </button>
      </div>
    </form>
  );
}