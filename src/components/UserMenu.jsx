import { useState, useEffect, useRef } from "react";

const UserMenu = ({ user, onLogout, onShowRules, onShowPrivacy, onShowTerms, onShowContact }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      closeMenu();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex flex-col items-center justify-center w-10 h-10 bg-gray-700 text-white rounded-full"
      >
        <div className="w-6 h-0.5 bg-white mb-1"></div>
        <div className="w-6 h-0.5 bg-white mb-1"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg z-50">
          <div className="flex justify-end">
            <button
              onClick={closeMenu}
              className="text-gray-700 px-4 py-2 text-lg"
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
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 cursor-not-allowed"
            >
              Create New League <span className="text-sm text-gray-400">(Coming Soon)</span>
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 cursor-not-allowed"
            >
              Join League <span className="text-sm text-gray-400">(Coming Soon)</span>
            </button>
            <button
              onClick={() => { closeMenu(); onShowPrivacy(); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => { closeMenu(); onShowTerms(); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => { closeMenu(); onShowContact(); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Contact
            </button>
            {user && (
              <button
                onClick={() => { closeMenu(); onLogout(); }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
