import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import ErrorAlert from './ErrorAlert.jsx';

const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const statuses = ['Todo', 'In Progress', 'Done'];

const toDateInput = (value) => {
  if (!value) return '';
  return new Date(value)
    .toISOString()
    .slice(0, 10);
};

export default function TaskForm({ task, members, onSubmit, onCancel, saving }) {
  const memberOptions = useMemo(
    () =>
      members.map(
        (member) =>
          member.user || member
      ),
    [members]
  );

  const hasMembers =
    memberOptions.length > 0;

  const [form, setForm] =
    useState({
      title:
        task?.title || '',
      description:
        task?.description || '',
      priority:
        task?.priority ||
        'Medium',
      dueDate: toDateInput(
        task?.dueDate
      ),
      assignedTo:
        task?.assignedTo?._id ||
        '',
      status:
        task?.status || 'Todo'
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
      form.title.trim()
        .length < 2
    ) {
      setError({
        message:
          'Task title must be at least 2 characters'
      });

      return;
    }

    if (!form.dueDate) {
      setError({
        message:
          'Due date is required'
      });

      return;
    }

    if (!form.assignedTo) {
      setError({
        message:
          'Assigned user is required'
      });

      return;
    }

    try {
      await onSubmit({
        title:
          form.title.trim(),
        description:
          form.description.trim(),
        priority:
          form.priority,
        dueDate:
          form.dueDate,
        assignedTo:
          form.assignedTo,
        status:
          form.status
      });
    } catch (
    submitError
    ) {
      setError(submitError);
    }
  };

  const inputClass = 'w-full rounded-2xl border border-[#222b45] bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';

  return (
    <form
      className="space-y-6"
      onSubmit={submit}
    >
      <ErrorAlert error={error} />

      {/* HEADER */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight text-white">
          {task
            ? 'Edit Task'
            : 'Create Task'}
        </h2>

        <p className="text-sm text-slate-400">
          Manage assignments,
          deadlines and progress.
        </p>
      </div>

      {/* TITLE */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-200">
          Task Title
        </label>

        <input
          className={inputClass}
          name="title"
          value={form.title}
          onChange={updateField}
          minLength={2}
          maxLength={160}
          required
          placeholder="Enter task title"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-200">
          Description
        </label>

        <textarea
          className={`${inputClass} min-h-[140px] resize-none leading-7`}
          name="description"
          value={form.description}
          onChange={updateField}
          rows={5}
          maxLength={2000}
          placeholder="Describe the task, workflow, deliverables or requirements..."
        />
      </div>

      {/* PRIORITY + STATUS */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-200">
            Priority
          </label>

          <select
            className={inputClass}
            name="priority"
            value={form.priority}
            onChange={updateField}
          >
            {priorities.map(
              (priority) => (
                <option
                  key={priority}
                >
                  {priority}
                </option>
              )
            )}
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-200">
            Status
          </label>

          <select
            className={inputClass}
            name="status"
            value={form.status}
            onChange={updateField}
          >
            {statuses.map(
              (status) => (
                <option
                  key={status}
                >
                  {status}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* DATE + ASSIGNEE */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-200">
            Due Date
          </label>

          <input
            className={inputClass}
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={updateField}
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-200">
            Assignee
          </label>

          <select
            className={inputClass}
            name="assignedTo"
            value={form.assignedTo}
            onChange={updateField}
            required
            disabled={!hasMembers}
          >
            <option
              value=""
              disabled
            >
              {hasMembers
                ? 'Select a project member'
                : 'No project members available'}
            </option>

            {memberOptions.map(
              (member) => (
                <option
                  key={member._id}
                  value={
                    member._id
                  }
                >
                  {member.name} (
                  {member.email})
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
        <button
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-medium text-slate-300 transition-all hover:bg-white/[0.06] hover:text-white"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="flex min-w-[170px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:from-indigo-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={
            saving ||
            !hasMembers
          }
        >
          {saving && (
            <Loader2
              className="animate-spin"
              size={18}
            />
          )}

          {task
            ? 'Save Changes'
            : 'Create Task'}
        </button>
      </div>
    </form>
  );
}