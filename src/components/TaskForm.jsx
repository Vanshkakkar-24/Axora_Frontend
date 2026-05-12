import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import ErrorAlert from './ErrorAlert.jsx';

const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const statuses = ['Todo', 'In Progress', 'Done'];

const toDateInput = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

export default function TaskForm({
  task,
  members,
  onSubmit,
  onCancel,
  saving
}) {
  const memberOptions = useMemo(
    () => members.map((member) => member.user || member),
    [members]
  );

  const hasMembers = memberOptions.length > 0;

  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    dueDate: toDateInput(task?.dueDate),
    assignedTo: task?.assignedTo?._id || '',
    status: task?.status || 'Todo'
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

    if (form.title.trim().length < 2) {
      setError(new Error('Task title must be at least 2 characters'));
      return;
    }

    if (!form.dueDate) {
      setError(new Error('Due date is required'));
      return;
    }

    if (!form.assignedTo) {
      setError(new Error('Assigned user is required'));
      return;
    }

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate,
        assignedTo: form.assignedTo,
        status: form.status
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
          Task Title
        </label>

        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          name="title"
          value={form.title}
          onChange={updateField}
          minLength={2}
          maxLength={160}
          required
          placeholder="Enter task title"
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
          maxLength={2000}
          placeholder="Describe the task..."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Priority
          </label>

          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            name="priority"
            value={form.priority}
            onChange={updateField}
          >
            {priorities.map((priority) => (
              <option key={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Status
          </label>

          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            name="status"
            value={form.status}
            onChange={updateField}
          >
            {statuses.map((status) => (
              <option key={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Due Date
          </label>

          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={updateField}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Assignee
          </label>

          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            name="assignedTo"
            value={form.assignedTo}
            onChange={updateField}
            required
            disabled={!hasMembers}
          >
            <option value="" disabled>
              {hasMembers
                ? 'Select a project member'
                : 'No project members available'}
            </option>

            {memberOptions.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        </div>
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
          disabled={saving || !hasMembers}
        >
          {saving && <Loader2 className="animate-spin" size={18} />}
          {task ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}