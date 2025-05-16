import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from "../../assets/logo.png";
import LogoLight from "../../assets/logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/auth-slice';
import { FaShoppingCart } from 'react-icons/fa';

const Nav = ({ toggleCart }) => {
    const { isAuthenticated } = useSelector(state => state.auth);
    console.log(isAuthenticated)
    const [navbarOpen, setNavbarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
    };

    // Handle navigation after logout
    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         navigate('/login'); // Redirect to login after logout
    //     }
    // }, [isAuthenticated, navigate]);

    return (
        <header className="flex w-full items-center bg-white dark:bg-dark bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="container mx-auto">
                <div className="relative mx-4 flex items-center justify-between">
                    <div className="w-60 max-w-full px-4">
                        <Link to="/" className="block w-full py-5">
                            <img
                                src={LogoLight}
                                alt="logo"
                                className="dark:hidden ml-8 w-12"
                            />
                            <img
                                src={LogoDark}
                                alt="logo"
                                className="hidden dark:block ml-8 w-20"
                            />
                        </Link>
                    </div>
                    <div className="flex w-full items-center justify-between px-4">
                        <div>
                            <button
                                onClick={() => setNavbarOpen(!navbarOpen)}
                                className={`absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden ${navbarOpen ? 'navbarTogglerActive' : ''
                                    }`}
                            >
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                            </button>
                            <nav
                                className={`absolute right-4 top-full w-full max-w-[250px] text-white rounded-lg bg-white px-6 py-5 shadow lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none dark:bg-dark-2 lg:dark:bg-transparent ${navbarOpen ? '' : 'hidden'
                                    }`}
                            >
                                <ul className="block lg:flex">
                                    <li>
                                        <Link
                                            to="/"
                                            className="flex py-2 text-base font-medium text-body-color hover:text-gray-600 lg:ml-12 lg:inline-flex dark:text-dark-6 dark:hover:text-white"
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/products"
                                            className="flex py-2 text-base font-medium text-body-color hover:text-dark lg:ml-12 lg:inline-flex dark:text-dark-6 dark:hover:text-white"
                                        >
                                            Products
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/features"
                                            className="flex py-2 text-base font-medium text-body-color hover:text-dark lg:ml-12 lg:inline-flex dark:text-dark-6 dark:hover:text-white"
                                        >
                                            Features
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="hidden justify-end pr-16 sm:flex lg:pr-0 ">
                            {
  isAuthenticated ? (
    <div className="flex items-center gap-4 text-white">
      <button onClick={toggleCart} className="relative">
        <FaShoppingCart className="h-6 w-6" />
      </button>
      <div className="relative group">
        <Link to={"/profile"} className="text-sm font-medium hover:underline">
          Profile
        </Link>
       
      </div>
    </div>
  ) : (
    <>
      <Link
        to="/login"
        className="px-7 py-3 text-base font-medium text-dark hover:text-primary dark:text-white"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="rounded-md bg-primary px-7 py-3 text-base font-medium text-white hover:bg-primary/90"
      >
        Register
      </Link>
    </>
  )
}
                        </div>
                    </div>
                </div>
            </div >
        </header >
    );
};

export default Nav;
