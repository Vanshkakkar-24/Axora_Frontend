import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  FolderKanban,
  UserPlus
} from 'lucide-react';

import API from '../api/axios';
import { toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post(
        '/auth/signup',
        formData
      );

      toast.success(
        'Account created successfully'
      );

      navigate('/login');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong'
      );
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            <UserPlus size={16} />
            Create account
          </div>

          <h1 className="text-4xl font-black text-white">
            Signup
          </h1>

          <p className="mt-3 text-slate-300">
            Start organizing projects with your team.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            name="name"
            placeholder="Full name"
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create account'}
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-300 hover:text-indigo-200"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;