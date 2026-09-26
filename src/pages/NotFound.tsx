import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-20 lg:pt-24 min-h-[60vh] flex items-center">
      <div className="container-page text-center">
        <div className="w-20 h-20 rounded-2xl bg-saffron-50 flex items-center justify-center mx-auto mb-6">
          <Compass className="w-10 h-10 text-saffron-500" />
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-neutral-900 mb-3">404</h1>
        <h2 className="font-display text-xl font-bold text-neutral-700 mb-2">Page Not Found</h2>
        <p className="text-neutral-500 mb-6 max-w-md mx-auto">
          The page you're looking for seems to have wandered off the spiritual path. Let's guide you back home.
        </p>
        <Link to="/" className="btn-primary">
          <Home className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
