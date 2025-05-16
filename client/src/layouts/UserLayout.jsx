import React, { Children, useState } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars, FaChartLine, FaCog, FaTachometerAlt, FaUserCircle } from "react-icons/fa";

const UserLayout = ({}) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

 return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-center h-16 bg-blue-600">
          <h1 className="text-white text-lg font-semibold">My Dashboard</h1>
        </div>
        <nav className="mt-10 px-4">
          <ul className="space-y-4">
            <li>
              {/* {console.log()}  */}
              <Link
                to="/profile"
                className={`flex items-center px-4 py-2 text-blue-700 hover:bg-blue-100 rounded-lg ${window.location.pathname === "/profile" ? "bg-blue-100" : ""}  `}
              >
                <FaTachometerAlt className="w-5 h-5 mr-3" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="overview"
                className={`flex items-center px-4 py-2 text-blue-700 hover:bg-blue-100 rounded-lg ${window.location.pathname === "/overview" ? "bg-blue-100" : ""}  `}
              >
                <FaChartLine className="w-5 h-5 mr-3" />
                <span>order overview</span>
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-blue-700 hover:bg-blue-100 rounded-lg"
              >
                <FaCog className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-blue-600">
          <div className="flex items-center">
            <button
              className="text-blue-600 focus:outline-none lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars className="w-6 h-6" />
            </button>
            <h2 className="ml-4 text-xl font-semibold text-gray-700 lg:ml-0">
              Dashboard
            </h2>
          </div>
          <div className="flex items-center">
            <button className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none">
              <FaUserCircle className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 p-6">
          {/* <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center p-4 bg-white rounded-lg shadow">
              <div className="p-3 mr-4 text-blue-600 bg-blue-100 rounded-full">
                <FaChartLine className="w-5 h-5" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">
                  Total Sales
                </p>
                <p className="text-lg font-semibold text-gray-700">$12,345</p>
              </div>
            </div>
          </div> */}

          {/* <section className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Reports</h3>
            <div className="mt-4 h-64 bg-gray-50 rounded-lg border-dashed border-2 border-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Chart Placeholder</span>
            </div> */}
          {/* </section> */}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
