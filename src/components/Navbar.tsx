
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="py-6 animate-fade-in">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <span className="text-2xl font-bold text-gray-800">emilist</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="btn btn-primary btn-round px-6 py-3 font-semibold transition-all duration-300 hover:shadow-md"
          >
            Join as an Expert
          </Link>
          <Link 
            to="/" 
            className="btn btn-outline px-4 py-2 rounded-md transition-all duration-300"
          >
            List New Job
          </Link>
          <div className="relative group">
            <button className="btn btn-outline px-4 py-2 rounded-md flex items-center space-x-1 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
              <span>Explore Emilist</span>
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300">
              <div className="py-1">
                <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground">Categories</Link>
                <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground">Find Experts</Link>
                <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground">Browse Jobs</Link>
              </div>
            </div>
          </div>
          <Link 
            to="/" 
            className="btn btn-outline px-4 py-2 rounded-md transition-all duration-300"
          >
            Log in
          </Link>
          <Link 
            to="/" 
            className="btn btn-outline px-4 py-2 rounded-md transition-all duration-300"
          >
            Sign up
          </Link>
        </div>
        
        <button className="md:hidden btn btn-outline p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
