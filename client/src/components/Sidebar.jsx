import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Courses', to: '/courses' },
  { label: 'Admin', to: '/admin' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="flex w-full max-w-xs flex-col justify-between rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 via-blue-100 to-slate-100 text-lg font-bold text-slate-800">
            L
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">LearningOS</p>
            <h2 className="text-lg font-semibold text-slate-900">Workspace</h2>
          </div>
        </div>

        <nav className="space-y-2">
          {links
            .filter((link) => {
              if (link.label === 'Admin') return user?.role === 'admin';
              if (link.label === 'Dashboard') return Boolean(user);
              return true;
            })
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                        ? 'bg-gradient-to-r from-slate-100 to-blue-50 text-slate-900 ring-1 ring-slate-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </nav>
      </div>

      {user ? (
        <div className="mt-6 rounded-2xl border border-white/80 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Account</p>
          <p className="mt-3 text-base font-semibold text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-600">{user.email}</p>
          <button
            onClick={logout}
            className="mt-4 w-full rounded-xl border border-white/80 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-200 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="mt-6 flex gap-3">
          <NavLink to="/login" className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700">
            Login
          </NavLink>
          <NavLink to="/register" className="flex-1 rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-medium text-white">
            Join now
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
