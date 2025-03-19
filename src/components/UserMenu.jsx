import { useState } from "react";
import Link from "next/link";

const UserMenu = ({ user, onLogout, onShowRules }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex flex-col items-center justify-center w-10 h-10 bg-gray-700 text-white rounded-md"
      >
        <div className="w-6 h-0.5 bg-white mb-1"></div>
        <div className="w-6 h-0.5 bg-white mb-1"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-end justify-end z-50">
          <div className="bg-white h-full w-64 shadow-lg transition-transform duration-300 ease-in-out">
            <div className="flex justify-end">
              <button
                onClick={closeMenu}
                className="text-gray-700 px-4 py-2"
              >
                &#10005;
              </button>
            </div>
            <div className="py-2">
              <button
                onClick={() => { closeMenu(); onShowRules(); }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Rules
              </button>
              {user ? (
                <button
                  onClick={() => { closeMenu(); onLogout(); }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <Link href="/auth/signin">
                  <a className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
                    Login
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
