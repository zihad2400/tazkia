import Link from 'next/link';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 islamic-pattern">
      <div className="text-center max-w-md w-full">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-4xl mb-6 shadow-xl">
          <FaExclamationTriangle />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-3">404</h1>
        <h2 className="text-xl font-semibold text-base-content mb-2">Page Not Found</h2>
        <p className="text-base-content/60 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors whitespace-nowrap"
        >
          <FaHome size={14} className="shrink-0" />
          <span className="whitespace-nowrap">Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
