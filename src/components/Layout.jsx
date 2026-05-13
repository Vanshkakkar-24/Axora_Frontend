import {
  FolderKanban,
  LogOut
} from 'lucide-react';

import {
  Link,
  Outlet
} from 'react-router-dom';

import { APP_NAME } from '../brand.js';

import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { logout, user } =
    useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50  border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* LOGO */}
          <Link
            to="/projects"
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-indigo-500/20 p-2">
              <FolderKanban
                className="text-indigo-400"
                size={22}
              />
            </div>

            <div>
              <h1 className="text-xl font-black text-white">
                <Link to="/">{APP_NAME}</Link>
              </h1>

              <p className="text-xs text-slate-400">
                Workspace
              </p>
            </div>
          </Link>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">
            {/* USER */}
            <div className="hidden text-right md:block">
              <p className="text-sm text-slate-400">
                Logged in as
              </p>

              <p className="font-semibold text-white">
                {user?.name}
              </p>
            </div>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}