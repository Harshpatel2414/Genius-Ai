"use client";
import { useAuth } from "@/context/AuthContext";
import { LiaAtomSolid } from "react-icons/lia";
import React, { useState } from "react";

const Navbar = () => {
  const [selectedOption, setSelectedOption] = useState("All Products");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { store, setStore } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white px-4 py-2 flex justify-between items-center relative drop-shadow-smooth z-50">
      <div className="flex items-center gap-2">
      <LiaAtomSolid className="w-10 h-10 text-blue-500" />
      <h1 className="text-lg font-semibold tracking-wider text-blue-500">
        Genius<span className="text-zinc-700">AI</span>
      </h1>
      </div>
      <div className="relative">
        <div className="flex items-center space-x-4 z-20">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="border flex w-40 text-blue-500 justify-between border-gray-300 p-2 rounded focus:outline-none"
            >
              {selectedOption}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 ml-1 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <button
                    onClick={() => {
                      setSelectedOption("All Products");
                      setStore("Products");
                      toggleDropdown();
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 w-full text-left"
                    role="menuitem"
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOption("Cloths Store");
                      setStore("Cloth_Store");
                      toggleDropdown();
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 w-full text-left"
                    role="menuitem"
                  >
                    Clothing Store
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOption("Tech Store");
                      setStore("Tech_Store");
                      toggleDropdown();
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 w-full text-left"
                    role="menuitem"
                  >
                    Tech Store
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;