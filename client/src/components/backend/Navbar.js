"use client";
import {Link} from "react-router-dom";
import React, { useState } from "react";

const Navbar = ({ setOpen }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleProfileMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMobileMenuOpen = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };


    return (
        <div className="bg-primary">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button
                            className="text-gray-300 hover:text-white focus:outline-none text-4xl"
                            onClick={() => setOpen(true)}
                        >
                            &#9776; {/* Menu icon */}
                        </button>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <span className="text-white font-semibold">Admin Dashboard</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                      
                    </div>
                    <div className="hidden md:flex items-center space-x-4 relative">
                      
                        <button
                            className="text-gray-300 hover:text-white focus:outline-none"
                            onClick={handleProfileMenuOpen}
                        >
                            {/* Profile icon */}
                            <span className="ml-2">Profile</span>
                        </button>
                    <div className="flex md:hidden absolute">
                    <Link
                            className="block text-gray-300 hover:text-white focus:outline-none"
                            to={'/admin/dashboard'}
                        >
                            {/* &#9786; Profile icon */}
                       
                            <span className="ml-2">Profile</span>
                        </Link>
                    </div>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            className="block text-gray-300 hover:text-white focus:outline-none"
                            href={'/admin/dashboard'}
                        >
                            &#9786; {/* Profile icon */}
                            <span className="ml-2">Profile</span>
                        </Link>
                    </div>
                </div>
            )}

            {isMenuOpen && (
                <div className="absolute right-52 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        My account
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
