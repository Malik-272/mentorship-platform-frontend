import { footerData } from "../data/navigationData";
import Logo from "./Logo";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-blue-950 text-gray-200 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Logo withLink={true} />
                <span className="text-xl font-bold dark:text-white">
                  {footerData.company.name}
                </span>
              </div>

              <p className="text-gray-300 dark:text-gray-400 mb-4 max-w-md">
                {footerData.company.description}
              </p>
              <div className="flex space-x-4">
                <Globe className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300 dark:text-gray-400 text-sm">
                  {footerData.company.tagline}
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                {footerData.links.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {footerData.links.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">{footerData.copyright}</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">
                {footerData.taglineBottom}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
