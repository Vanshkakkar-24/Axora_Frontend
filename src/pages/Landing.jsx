import { ArrowRight, FolderKanban, LogIn, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/axora-hero.png';
import { APP_NAME, APP_TAGLINE } from '../brand.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Landing() {
  const { booting, isAuthenticated, logout } = useAuth();

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* NAVBAR */}
      <header className="absolute left-0 top-0 z-50 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold"
          >
            <FolderKanban
              className="text-indigo-400"
              size={26}
            />

            <span>{APP_NAME}</span>
          </Link>

          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-indigo-400 sm:px-5"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur-md transition hover:bg-white/20 sm:px-5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-md transition hover:bg-white/20 sm:flex"
                >
                  <LogIn size={16} />
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-indigo-400 sm:px-5"
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
      <section className="relative flex min-h-screen items-center overflow-hidden">
        {/* Background Image */}
        <img
          src={heroImage}
          alt="Axora dashboard"
          className="absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-[75%_center] md:object-center"
        />

        {/* Main Overlay */}
        <div className="absolute inset-0 bg-slate-950/75" />

        {/* Left Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/20 md:to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-24">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-md">
              <ShieldCheck size={16} />
              Team execution platform
            </div>

            <h1 className="mb-6 text-5xl font-black leading-none tracking-tight text-white sm:text-6xl md:text-7xl">
              {APP_NAME}
            </h1>

            <p className="mb-10 max-w-lg text-lg leading-8 text-slate-300 sm:text-xl">
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
                  className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur-md transition hover:bg-white/20 sm:hidden"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}