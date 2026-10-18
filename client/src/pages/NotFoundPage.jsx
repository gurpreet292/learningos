import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(167,243,208,0.45),_transparent_18%),radial-gradient(circle_at_right,_rgba(196,181,253,0.22),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 text-slate-800">
      <div className="rounded-[32px] border border-white/70 bg-white/80 p-10 text-center shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">404</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-sky-200 via-violet-200 to-rose-200 px-5 py-3 font-semibold text-slate-800">
          Return home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
