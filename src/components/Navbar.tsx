"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Info } from 'lucide-react';

export default function Navbar() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <nav className="w-full bg-gray-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Home
        </Link>
        
        <div className="relative">
          <button 
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-500 transition-colors"
            onClick={() => setShowTooltip(!showTooltip)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="API Information"
          >
            <Info className="w-5 h-5" />
          </button>
          
          {showTooltip && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 p-3 rounded-md shadow-lg z-10">
              <h3 className="font-bold text-blue-700 mb-1">What is an API?</h3>
              <p className="text-sm">
                An API (Application Programming Interface) is like a waiter in a restaurant. 
                It takes your request, delivers it to the system, and returns what you asked for. 
                APIs allow different software applications to communicate and share data with each other.
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 