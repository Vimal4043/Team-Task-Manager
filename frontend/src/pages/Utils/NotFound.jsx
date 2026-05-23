import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  const homePath = user?.role === 'admin' ? '/dashboard' : '/projects';
  const homeLabel = user?.role === 'admin' ? 'Back to Dashboard' : 'Back to Projects';

  return (
    <section className="grid min-h-[70vh] place-items-center text-center">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">404</h1>
        <p className="mt-2 text-slate-600">The page you requested was not found.</p>
        <Link to={homePath} className="mt-4 inline-block rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white">
          {homeLabel}
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
