import {
  ArrowRight,
  FolderKanban,
  LogIn,
  ShieldCheck
} from 'lucide-react';

import { Link } from 'react-router-dom';
import heroImage from '../assets/axora-hero.png';
import { APP_NAME, APP_TAGLINE } from '../brand.js';
import { useAuth } from '../context/AuthContext.jsx';

const workflowHighlights = [
  { label: 'Plan', value: 'Project clarity' },
  { label: 'Assign', value: 'Member ownership' },
  { label: 'Track', value: 'Task momentum' }
];

export default function Landing() {
  const { booting, isAuthenticated, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* NAVBAR */}
      <header className="absolute top-0 left-0 z-50 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold"
          >
            <FolderKanban className="text-indigo-400" size={28} />
            <span>{APP_NAME}</span>
          </Link>

          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-indigo-400"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-md transition hover:bg-white/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-md transition hover:bg-white/20"
                >
                  <LogIn size={16} />
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-indigo-400"
                >
                  Get started
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center">
        {/* Background Image */}
        <img
          src={heroImage}
          alt="Axora dashboard"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/70" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-md">
              <ShieldCheck size={16} />
              Team execution platform
            </div>

            <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
              {APP_NAME}
            </h1>

            <p className="mb-10 text-lg leading-8 text-slate-300 md:text-xl">
              {APP_TAGLINE}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to={isAuthenticated ? '/projects' : '/signup'}
                className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold transition hover:bg-indigo-400"
              >
                {isAuthenticated
                  ? 'Open dashboard'
                  : 'Start organizing'}

                <ArrowRight size={18} />
              </Link>

              {!isAuthenticated && !booting && (
                <Link
                  to="/login"
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur-md transition hover:bg-white/20"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW CARDS */}
      <section className="relative z-20 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {workflowHighlights.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl transition hover:bg-white/15"
            >
              <span className="text-sm uppercase tracking-widest text-indigo-300">
                {item.label}
              </span>

              <h3 className="mt-3 text-2xl font-bold">
                {item.value}
              </h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}