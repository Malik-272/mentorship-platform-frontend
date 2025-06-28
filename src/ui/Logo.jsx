import { Link } from "react-router-dom";

export default function Logo({ withLink = false }) {
  if (withLink)
    return (
      <Link
        to="/"
        className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
      >
        <span className="text-white font-bold text-sm">G</span>
      </Link>
    );

  return (
    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
      <span className="text-white font-bold text-sm">G</span>
    </div>
  );
}
