import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.45),_transparent_18%),radial-gradient(circle_at_right,_rgba(226,232,240,0.55),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-16 text-slate-800">
      <div className="w-full max-w-md rounded-[32px] border border-white/80 bg-white/85 p-7 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 via-blue-100 to-slate-100 text-lg font-black text-slate-800">
            L
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">LearningOS</p>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-300"
              placeholder="student@learningos.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-300"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-slate-200 via-blue-100 to-slate-100 px-4 py-3 font-semibold text-slate-800 shadow-lg shadow-slate-200/70 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-sky-700 hover:text-slate-900">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
