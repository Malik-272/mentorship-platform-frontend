"use client";

import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

function NavLogo() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex items-center">
      <Link
        to={isAuthenticated ? "/dashboard" : "/"}
        className="flex items-center space-x-2 group"
      >
        <Logo />
        <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          Growtly
        </span>
      </Link>
    </div>
  );
}

export default NavLogo;
