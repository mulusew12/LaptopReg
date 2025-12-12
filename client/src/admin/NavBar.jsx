import React from 'react';
import { FaBell, FaSearch } from 'react-icons/fa'; // Added FaSearch for the input

const NavBar = () => {
  return (
    // Updated container: removed 'border', added flex justification, padding, shadow, and background
    <div className='flex items-center justify-between border z-60 border-blue-600 p-4 bg-white shadow-md shadow-green-400 fixed w-full'>
      {/* 1. Logo Section */}
      {/* Adjusted image size and added margin for separation */}
      <div className="flex items-center">
        <img 
          className='w-16 h-16 object-contain mr-4' // Smaller, more appropriate size for a nav bar logo
          src="/aastuLogo.png" 
          alt="AASTU Logo" 
        />
        {/* Optional: Add a title next to the logo */}
        <span className='text-xl font-semibold text-indigo-700 hidden sm:block'>
          AASTU Portal
        </span>
      </div>

      {/* 2. Search Input Section */}
      {/* Added focus styling and better alignment with a search icon */}
      <div className='relative flex items-center flex-grow mx-8 max-w-lg'>
        <FaSearch className='absolute left-3 text-gray-400 pointer-events-none' />
        <input 
          type="text" 
          placeholder="Filter laptops by user name or by ID"
          // Updated styling: full width, generous padding, rounded corners, focused border color
          className='w-full py-2 pl-10 pr-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150' 
        />
      </div>

      {/* 3. Notification Icon Section */}
      {/* Added margin, larger icon, and hover effect for interactivity */}
      <div className='relative'>
        <FaBell 
          className='text-2xl text-gray-600 hover:text-indigo-600 cursor-pointer transition duration-150'
        />
        {/* Optional: Add a small notification dot */}
        <span className='absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500'></span>
      </div>
    </div>
  );
};

export default NavBar;