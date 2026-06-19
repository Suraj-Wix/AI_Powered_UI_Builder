import React from "react";
import { Link } from "react-router-dom";

const NoPage = () => {
  return (
    <div className="min-h-screen bg-[#141319] text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-[80px] font-bold">404</h1>
      <p className="text-[20px] text-gray-400 mt-2">Oops! Page not found.</p>

      <div className="mt-5">
        <Link
          to="/"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-all text-white font-semibold"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NoPage;
