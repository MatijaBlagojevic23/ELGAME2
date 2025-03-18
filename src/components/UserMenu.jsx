import { useState } from "react";
import Link from "next/link";

const UserMenu = ({ user, onLogout, onShowRules }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 transition-opacity duration-300 ease-in-out">
          <div className="py-2">
            <button
              onClick={onShowRules}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Rules
            </button>
            {user ? (
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <Link href="/auth/signin">
                <a className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Login
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
