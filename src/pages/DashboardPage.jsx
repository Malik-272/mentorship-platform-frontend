import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import SearchOverlay from "../features/dashboard/SearchOverlay";
import MenteeDashboard from "../features/dashboard/MenteeDashboard";
import MentorDashboard from "../features/dashboard/MentorDashboard";
import CommunityManagerDashboard from "../features/dashboard/CommunityManagerDashboard";
import AdminDashboard from "../features/dashboard/AdminDashboard";
import { Search, X } from "lucide-react";

export default function DashboardPage() {
  const { data } = useAuth();
  const user = data?.user;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState({ users: [], communities: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // New state to track search bar visibility
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const lastScrollY = useRef(0);

  const { dashboardData, loading, error, searchUsers, refreshDashboard } = useDashboard();

  // Handle search input changes with debounce
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length > 0) {
      searchTimeoutRef.current = setTimeout(async () => {
        setSearchLoading(true);
        try {
          const results = await searchUsers(query.trim());
          setSearchResults(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults({ users: [], communities: [] });
        } finally {
          setSearchLoading(false);
        }
      }, 300);
    } else {
      setShowSearchResults(false);
      setSearchResults({ users: [], communities: [] });
    }
  };

  // Handle search result clicks
  const handleUserClick = (userId) => {
    if (user.role === "ADMIN") {
      navigate(`/management/users?id=${userId}`);
    } else {
      navigate(`/profile/${userId}`);
    }
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const handleCommunityClick = (communityId) => {
    navigate(`/communities/${communityId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // New useEffect for handling scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      // Don't hide the bar if search results are open
      if (showSearchResults) return;

      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const hasScrolledPastThreshold = currentScrollY > 100; // Adjust as needed

      // Hide if scrolling down and past the threshold, show if scrolling up
      if (isScrollingDown && hasScrolledPastThreshold) {
        setIsSearchBarVisible(false);
      } else if (!isScrollingDown) {
        setIsSearchBarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showSearchResults]); // Re-run effect if showSearchResults changes

  // Clear search input and results
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchResults({ users: [], communities: [] });
  };

  // Render role-based dashboard content
  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-12">
          <ErrorMessage message={error} onRetry={refreshDashboard} />
        </div>
      );
    }

    if (!user) {
      return <div className="text-center py-12 text-gray-500 dark:text-gray-400">User not authenticated.</div>
    }

    switch (user.role) {
      case "MENTEE":
        return <MenteeDashboard data={dashboardData} />;
      case "MENTOR":
        return <MentorDashboard data={dashboardData} />;
      case "COMMUNITY_MANAGER":
        return <CommunityManagerDashboard data={dashboardData} />;
      case "ADMIN":
        return <AdminDashboard data={dashboardData} />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Dashboard not available for your role.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Search Bar - Now with scroll-based visibility */}
      <div
        className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm transform transition-transform duration-300 ease-in-out ${isSearchBarVisible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for users and communities..."
                className="block w-full pl-11 pr-11 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Search Results Overlay */}
            {showSearchResults && (
              <SearchOverlay
                results={searchResults}
                loading={searchLoading}
                onUserClick={handleUserClick}
                onCommunityClick={handleCommunityClick}
                onClose={() => setShowSearchResults(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Here's what's happening on your dashboard today.
          </p>
        </div>
        {renderDashboardContent()}
      </div>
    </div>
  );
}