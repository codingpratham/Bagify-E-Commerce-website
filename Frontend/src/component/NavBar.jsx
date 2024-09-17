import React, { useState } from 'react';
import {Link} from 'react-router-dom'
const NavBar = ({label}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold">{label}</h1>
          </div>

          {/* Hamburger Icon for Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-black focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            
            <Link
              to="/products"
              className="text-gray-600 hover:text-black px-3 py-2 text-sm font-medium"
            >
              Products
            </Link>
            <a
              href="/cart"
              className="text-gray-600 hover:text-black px-3 py-2 text-sm font-medium"
            >
              Cart
            </a>
            <a
              href="/account"
              className="text-gray-600 hover:text-black px-3 py-2 text-sm font-medium"
            >
              My Account
            </a>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <a
                href="/products"
                className="block text-gray-600 hover:text-black px-3 py-2 text-base font-medium"
              >
                Products
              </a>
              <a
                href="/cart"
                className="block text-gray-600 hover:text-black px-3 py-2 text-base font-medium"
              >
                Cart
              </a>
              <a
                href="/account"
                className="block text-gray-600 hover:text-black px-3 py-2 text-base font-medium"
              >
                My Account
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
