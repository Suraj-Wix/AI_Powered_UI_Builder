import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { HiSun, HiMoon } from 'react-icons/hi';
import { RiSettings3Fill } from 'react-icons/ri';

const Navbar = () => {

  // DARK MODE STATE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  // Toggle Theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    const newTheme = !darkMode ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  // Load theme on first render
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <>
      <div className="nav flex items-center justify-between px-[100px] h-[90px] 
        border-b border-gray-800 bg-white dark:bg-[#141319] dark:text-white transition-all">

        {/* Logo */}
        <div className="logo">
         <h3 className='text-[25px] font-[700] sp-text'>GenUI</h3>
        </div>

        {/* Icons */}
        <div className="icons flex items-center gap-[20px] text-[22px]">

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="icon w-10 h-10 rounded-full border border-gray-400 
            flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#1f1f25] transition-all"
          >
            {darkMode ? <HiSun /> : <HiMoon />}
          </button>

          {/* Profile Icon */}
          <div className="icon w-10 h-10 rounded-full border border-gray-400 
            flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#1f1f25] transition-all cursor-pointer"
          >
            <FaUser />
          </div>

          {/* Settings Icon */}
          <div className="icon w-10 h-10 rounded-full border border-gray-400 
            flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#1f1f25] transition-all cursor-pointer"
          >
            <RiSettings3Fill />
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;
