import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  FolderKanban,
  LogIn
} from 'lucide-react';

import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert.jsx';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [formData, setFormData] =
    useState({
      email: '',
      password: ''
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    try {
      setLoading(true);

      const { data } =
        await API.post(
          '/auth/login',
          formData
        );

      localStorage.setItem(
        'userInfo',
        JSON.stringify(data)
      );

      setUser(data);

      toast.success(
        'Login successful'
      );

      navigate('/projects');
    } catch (submitError) {
      setError(submitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      {/* Background Glow */}
      <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl">
        {/* Logo */}
        <Link
          to="/"
          className="mb-8 flex items-center gap-2 text-3xl font-black text-white"
        >
          <FolderKanban
            className="text-indigo-400"
            size={32}
          />
          Axora
        </Link>

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-300">
            <LogIn size={16} />
            Welcome back
          </div>

          <h1 className="text-4xl font-black text-white">
            Login
          </h1>

          <p className="mt-3 text-slate-300">
            Continue managing your
            projects and tasks.
          </p>
        </div>

        {/* ERROR */}
        <div className="mb-5">
          <ErrorAlert error={error} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email address"
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-400"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? 'Logging in...'
              : 'Login'}

            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-indigo-300 hover:text-indigo-200"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;