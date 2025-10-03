"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigationData, roleBasedNavigation } from "../data/navigationData";

import { SimpleThemeToggle } from "./ThemeToggle";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function DesktopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const {
    data,
    isAuthenticated,
    isLoading,
    logout: logoutMutation,
    setUser,
  } = useAuth();

  const getRoleBasedNavItems = () => {
    if (!isAuthenticated || !data?.user?.role) return [];
    return roleBasedNavigation[data.user.role] || [];
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: () => {
        navigate("/login");
      },
    });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-1">
          {!isAuthenticated &&
            navigationData.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </a>
            ))}
          {isAuthenticated &&
            getRoleBasedNavItems().map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
        </div>
      </div>

      {/* Desktop Auth Buttons & Theme Toggle */}
      <div className="hidden md:flex items-center space-x-3">
        <SimpleThemeToggle />
        {isLoading ? (
          <div className="w-20 h-8 bg-muted rounded-lg animate-pulse"></div>
        ) : isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${data?.user?.id}`}>
              <div className="flex items-center space-x-2 text-foreground hover:text-secondary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-muted">
                {data?.user?.imageUrl ? (
                  <img
                    src={data.user.imageUrl}
                    alt="User avatar"
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-border"
                  />
                ) : (
                  <User />
                )}
                <span className="text-sm font-medium">{data?.user?.name}</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex items-center space-x-1 text-muted-foreground hover:text-destructive px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 hover:bg-muted"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span>
                {logoutMutation.isPending ? "Signing out..." : "Sign out"}
              </span>
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default DesktopNav;
