import { useState } from "react";

import NavLogo from "./NavLogo";
import DesktopNav from "./DesktopNav";
import MobileNavButton from "./MobileNavButton";
import MobileNav from "./MobileNav";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLogo />
          <DesktopNav />
          <MobileNavButton
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>
        <MobileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </nav>
  );
}

export default NavBar;
