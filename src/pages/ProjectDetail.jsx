import { ArrowLeft, Loader2, Pencil, Plus, Search, Trash2, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import ErrorAlert from '../components/ErrorAlert.jsx';
import Loading from '../components/Loading.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const priorities = ['', 'Low', 'Medium', 'High', 'Urgent'];
const statuses = ['', 'Todo', 'In Progress', 'Done'];

const statusClass = {
  Todo: 'status-todo',
  'In Progress': 'status-progress',
  Done: 'status-done'
};

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ page: 1, search: '', status: '', priority: '', assignedTo: '' });
  const [searchText, setSearchText] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [savingTask, setSavingTask] = useState(false);
  const [savingMember, setSavingMember] = useState(false);
  const [error, setError] = useState(null);
  const [memberError, setMemberError] = useState(null);
  const [taskModal, setTaskModal] = useState(null);

  const members = project?.members || [];
  const memberUsers = useMemo(() => members.map((member) => member.user), [members]);
  const isOwner = project?.owner?._id === user?._id;

  const loadProject = async () => {
    setLoadingProject(true);
    setError(null);

    try {
      const response = await api.get(
        `/projects/${projectId}`
      );

      setProject(
        response.data?.data?.project
      );
    } catch (loadError) {
      setError(loadError);
    } finally {
      setLoadingProject(false);
    }
  };

  const loadTasks = async (
    nextFilters = filters
  ) => {
    setLoadingTasks(true);
    setError(null);

    try {
      const response = await api.get(
        `/projects/${projectId}/tasks`,
        {
          params: {
            ...nextFilters,
            limit: 8
          }
        }
      );

      const payload =
        response.data?.data;

      setTasks(payload?.items || []);

      setPagination(
        payload?.pagination || null
      );
    } catch (loadError) {
      setError(loadError);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  useEffect(() => {
    loadTasks(filters);
  }, [projectId, filters.page, filters.search, filters.status, filters.priority, filters.assignedTo]);

  const submitSearch = (event) => {
    event.preventDefault();
    setFilters((current) => ({ ...current, page: 1, search: searchText.trim() }));
  };

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, page: 1, [key]: value }));
  };

  const addMember = async (event) => {
    event.preventDefault();
    setMemberError(null);

    if (!memberEmail.trim()) {
      setMemberError(new Error('Member email is required'));
      return;
    }

    setSavingMember(true);

    try {
      const response = await api.post(`/projects/${projectId}/members`,
        {
          email: memberEmail.trim()
        }
      );
      setProject(
        response.data?.data?.project
      );
      setMemberEmail('');
    } catch (submitError) {
      setMemberError(submitError);
    } finally {
      setSavingMember(false);
    }
  };

  const createTask = async (payload) => {
    setSavingTask(true);

    try {
      const { data } = await api.post(`/projects/${projectId}/tasks`, payload);
      const nextFilters = { ...filters, page: 1 };
      setTaskModal(null);
      setFilters(nextFilters);
      await loadTasks(nextFilters);
    } finally {
      setSavingTask(false);
    }
  };

  const updateTask = async (taskId, payload) => {
    setSavingTask(true);

    try {
      const { data } = await api.patch(`/tasks/${taskId}`, payload);
      setTaskModal(null);
      await loadTasks(filters);
    } finally {
      setSavingTask(false);
    }
  };

  const updateStatus = async (task, status) => {
    const previousTasks = tasks;
    setTasks((current) => current.map((item) => (item._id === task._id ? { ...item, status } : item)));

    try {
      await api.patch(`/tasks/${task._id}`, { status });
    } catch (submitError) {
      setTasks(previousTasks);
      setError(submitError);
    }
  };

  const deleteTask = async (taskId) => {
    const confirmed = window.confirm('Delete this task?');

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      await loadTasks(filters);
    } catch (deleteError) {
      setError(deleteError);
    }
  };

  if (loadingProject) {
    return <Loading label="Loading project" />;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <ErrorAlert error={error} />

        {project && (
          <>
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-black">
                  {project.name}
                </h1>

                <p className="mt-3 max-w-2xl text-slate-400">
                  {project.description ||
                    'No description provided'}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setTaskModal({
                    mode: 'create'
                  })
                }
                className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 font-semibold transition hover:bg-indigo-400"
              >
                <Plus size={18} />
                New task
              </button>
            </div>

            {/* MEMBERS */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
              <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    Project members
                  </h2>

                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-300">
                    {members.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {members.map((member) => (
                    <div
                      key={member.user._id}
                      className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3"
                    >
                      <p className="font-medium">
                        {member.user.name}
                      </p>

                      <p className="text-sm text-slate-400 capitalize">
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {isOwner && (
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      Add member
                    </h2>

                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-300">
                      Owner only
                    </span>
                  </div>

                  <p className="mb-5 text-slate-400">
                    Add an existing user
                    before assigning tasks.
                  </p>

                  <form
                    onSubmit={addMember}
                    className="flex flex-col gap-4 md:flex-row"
                  >
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(event) =>
                        setMemberEmail(
                          event.target.value
                        )
                      }
                      placeholder="member@example.com"
                      required
                      className="flex-1 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
                    />

                    <button
                      type="submit"
                      disabled={savingMember}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 py-3 font-medium transition hover:bg-white/20 disabled:opacity-50"
                    >
                      {savingMember ? (
                        <Loader2
                          className="animate-spin"
                          size={18}
                        />
                      ) : (
                        <UserPlus size={18} />
                      )}

                      Add member
                    </button>
                  </form>

                  <div className="mt-4">
                    <ErrorAlert
                      error={memberError}
                    />
                  </div>
                </section>
              )}
            </div>

            {/* TASKS */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-black">
                  Tasks
                </h2>

                <span className="rounded-full bg-indigo-500/20 px-4 py-2 text-sm text-indigo-300">
                  {pagination
                    ? pagination.total
                    : 0}{' '}
                  tasks
                </span>
              </div>

              {/* FILTERS */}
              <form
                onSubmit={submitSearch}
                className="mb-8 grid gap-4 lg:grid-cols-5"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4">
                  <Search
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    value={searchText}
                    onChange={(event) =>
                      setSearchText(
                        event.target.value
                      )
                    }
                    placeholder="Search tasks..."
                    className="w-full bg-transparent py-3 text-white outline-none placeholder:text-slate-500"
                  />
                </div>

                <select
                  value={filters.status}
                  onChange={(event) =>
                    updateFilter(
                      'status',
                      event.target.value
                    )
                  }
                  className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none"
                >
                  {statuses.map((status) => (
                    <option
                      key={
                        status ||
                        'all-statuses'
                      }
                      value={status}
                    >
                      {status ||
                        'All statuses'}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.priority}
                  onChange={(event) =>
                    updateFilter(
                      'priority',
                      event.target.value
                    )
                  }
                  className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none"
                >
                  {priorities.map(
                    (priority) => (
                      <option
                        key={
                          priority ||
                          'all-priorities'
                        }
                        value={priority}
                      >
                        {priority ||
                          'All priorities'}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={filters.assignedTo}
                  onChange={(event) =>
                    updateFilter(
                      'assignedTo',
                      event.target.value
                    )
                  }
                  className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none"
                >
                  <option value="">
                    All assignees
                  </option>

                  {memberUsers.map(
                    (member) => (
                      <option
                        key={member._id}
                        value={member._id}
                      >
                        {member.name}
                      </option>
                    )
                  )}
                </select>

                <button
                  type="submit"
                  className="rounded-2xl bg-white/10 px-6 py-3 font-medium transition hover:bg-white/20"
                >
                  Search
                </button>
              </form>

              {/* TASK LIST */}
              {loadingTasks ? (
                <Loading label="Loading tasks" />
              ) : tasks.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 py-20 text-center">
                  <h3 className="text-2xl font-bold">
                    No tasks found
                  </h3>

                  <p className="mt-3 text-slate-400">
                    Create your first task
                    for this project.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {tasks.map((task) => (
                    <article
                      key={task._id}
                      className="rounded-3xl border border-white/10 bg-slate-900/70 p-6"
                    >
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold">
                            {task.title}
                          </h3>

                          <p className="mt-2 text-slate-400">
                            {task.description ||
                              'No description'}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setTaskModal({
                                mode: 'edit',
                                task
                              })
                            }
                            className="rounded-xl border border-white/10 p-2 transition hover:bg-white/10"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteTask(
                                task._id
                              )
                            }
                            className="rounded-xl border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mb-5 flex flex-wrap gap-3 text-sm">
                        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-indigo-300">
                          {task.status}
                        </span>

                        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-300">
                          {task.priority}
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1 text-slate-300">
                          Due{' '}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mb-5 text-sm text-slate-400">
                        Assigned to:{' '}
                        <span className="text-slate-200">
                          {task.assignedTo
                            ?.name ||
                            'Unassigned'}
                        </span>
                      </div>

                      <select
                        value={task.status}
                        onChange={(event) =>
                          updateStatus(
                            task,
                            event.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      >
                        {statuses
                          .filter(Boolean)
                          .map((status) => (
                            <option
                              key={status}
                            >
                              {status}
                            </option>
                          ))}
                      </select>
                    </article>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <Pagination
                  pagination={pagination}
                  onPageChange={(page) =>
                    setFilters(
                      (current) => ({
                        ...current,
                        page
                      })
                    )
                  }
                />
              </div>
            </section>
          </>
        )}

        {taskModal && (
          <Modal
            title={
              taskModal.mode === 'edit'
                ? 'Edit task'
                : 'Create task'
            }
            onClose={() =>
              setTaskModal(null)
            }
          >
            <TaskForm
              task={taskModal.task}
              members={members}
              saving={savingTask}
              onCancel={() =>
                setTaskModal(null)
              }
              onSubmit={(payload) =>
                taskModal.mode ===
                  'edit'
                  ? updateTask(
                    taskModal.task._id,
                    payload
                  )
                  : createTask(payload)
              }
            />
          </Modal>
        )}
      </div>
    </main>
  );
}
