import { FolderKanban, Plus, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import ErrorAlert from '../components/ErrorAlert.jsx';
import Loading from '../components/Loading.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import { APP_NAME } from '../brand.js';

export default function Projects() {
  const [projects, setProjects] =
    useState([]);

  const [pagination, setPagination] =
    useState(null);

  const [filters, setFilters] =
    useState({
      page: 1,
      search: ''
    });

  const [searchText, setSearchText] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [showCreate, setShowCreate] =
    useState(false);

  const loadProjects = async (
    nextFilters = filters
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        '/projects',
        {
          params: {
            ...nextFilters,
            limit: 8
          }
        }
      );

      const payload =
        response.data?.data;

      setProjects(
        payload?.items || []
      );

      setPagination(
        payload?.pagination || null
      );
    } catch (loadError) {
      setError(loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(filters);
  }, [filters.page, filters.search]);

  const submitSearch = (event) => {
    event.preventDefault();

    setFilters({
      page: 1,
      search: searchText.trim()
    });
  };

  const createProject = async (
    payload
  ) => {
    setSaving(true);

    try {
      await api.post(
        '/projects',
        payload
      );

      const nextFilters = {
        page: 1,
        search: ''
      };

      setShowCreate(false);

      setFilters(nextFilters);

      setSearchText('');

      await loadProjects(nextFilters);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-300">
              <FolderKanban size={16} />
              {APP_NAME} Workspace
            </div>

            <h1 className="text-5xl font-black">
              Projects
            </h1>

            <p className="mt-3 text-lg text-slate-400">
              {pagination
                ? `${pagination.total} total projects`
                : `${APP_NAME} workspace overview`}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreate(true)
            }
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 font-semibold transition hover:bg-indigo-400"
          >
            <Plus size={18} />
            New project
          </button>
        </div>

        {/* SEARCH */}
        <form
          onSubmit={submitSearch}
          className="mb-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:flex-row"
        >
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4">
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
              placeholder="Search projects..."
              className="w-full bg-transparent py-3 text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl border border-white/10 bg-white/10 px-6 py-3 font-medium transition hover:bg-white/20"
          >
            Search
          </button>
        </form>

        <ErrorAlert error={error} />

        {/* CONTENT */}
        {loading ? (
          <Loading label="Loading projects" />
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 py-24 text-center">
            <h2 className="text-2xl font-bold">
              No projects found
            </h2>

            <p className="mt-3 text-slate-400">
              Create your first project to
              start collaborating.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-white/10"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold transition group-hover:text-indigo-300">
                        {project.name}
                      </h2>

                      <p className="mt-3 line-clamp-2 text-slate-400">
                        {project.description ||
                          'No description provided'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      {
                        project.members
                          .length
                      }{' '}
                      members
                    </div>

                    <span>
                      {new Date(
                        project.updatedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-slate-500">
                    Owner:{' '}
                    <span className="text-slate-300">
                      {
                        project.owner
                          ?.name
                      }
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10">
              <Pagination
                pagination={pagination}
                onPageChange={(
                  page
                ) =>
                  setFilters(
                    (
                      current
                    ) => ({
                      ...current,
                      page
                    })
                  )
                }
              />
            </div>
          </>
        )}

        {/* MODAL */}
        {showCreate && (
          <Modal
            title="Create project"
            onClose={() =>
              setShowCreate(false)
            }
          >
            <ProjectForm
              saving={saving}
              onCancel={() =>
                setShowCreate(false)
              }
              onSubmit={createProject}
            />
          </Modal>
        )}
      </div>
    </main>
  );
}