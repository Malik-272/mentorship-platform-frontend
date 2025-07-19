import { Link } from "react-router-dom";
import Logo from "./Logo";

function NavLogo() {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center space-x-2 group">
        <Logo />
        <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          Growtly
        </span>
      </Link>
    </div>
  );
}

export default NavLogo;
