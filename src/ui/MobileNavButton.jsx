import { Menu, X } from "lucide-react";
import { SimpleThemeToggle } from "../ui/ThemeToggle";
import Notifications from "./Notifications";

function MobileNavButton({ isMenuOpen, setIsMenuOpen }) {
  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center space-x-2">
        <SimpleThemeToggle />
        <Notifications/>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
}

export default MobileNavButton;
