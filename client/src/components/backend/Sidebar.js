import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/auth-slice";
const CustomDropDown = ({ defaultLink, name, subLinks }) => {
    const [isOpen, setIsOpen] = useState(false);
    // const { data: session, status } = useSession();

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>

            <div className={`px-4 py-2 cursor-pointer hover:bg-gray-200  ${window.location.href.includes(name.toLowerCase()) && "bg-gray-500 rounded-md"}`} onClick={toggleOpen}>
                {/* <Link href={defaultLink} className="block w-full"> */}
                {name}

                {/* </Link> */}
            </div>
            {isOpen && (
                <div className="pl-4">
                    {Array.isArray(subLinks) && subLinks.map((subLink, index) => (
                        <div key={index} className="px-4 py-2 cursor-pointer hover:bg-gray-200">
                            <Link to={subLink.href} className={`block w-full ${window.location.pathname === subLink.href ? "text-purple-500 " : ""}`}>
                                {subLink.name}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function Sidebar({ open, setOpen }) {
    const navigate = useNavigate();

    const links = [
        {
            href: "/admin/categories",
            name: "Categories",
            sub: [
                {
                    name: "Add Category",
                    href: "/admin/categories/add",
                },
                {
                    name: "All Categories",
                    href: "/admin/categories",
                },
            ],
        },
        {
            href: "/admin/products",
            name: "Products",
            sub: [
                {
                    name: "Add Product",
                    href: "/admin/products/add",
                },
                {
                    name: "All Products",
                    href: "/admin/products",
                },
            ],
        },
        {
            href: "/admin/orders",
            name: "Orders",
            sub: [
                {
                    name: "Order List",
                    href: "/admin/orders",
                },
            ],
        },
        {
            href: "admin/shoe-brand/add",
            name: "brands",
            sub:[

               { name:"brand controller",
                href:"admin/shoe-brand/add"}
            ]
        },
        {
            href: "admin/shoe-colors/add",
            name: "Colors",
            sub:[
                {
                    name: "Color controller",
                    href: "/admin/shoe-colors/add",
                },
                
            ]
        
        },
        {
            href: "admin/shoe-size/add",
            name: "Sizes",
            sub:[
                {
                    name: "Size controller",
                    href: "/admin/shoe-size/add",
                },
                
            ]
        },
        {
            href: "/admin/payments",
            name: "Payments",
            sub: [
                {
                    name: "Payment List",
                    href: "/admin/payments",
                },
            ],
        },
        {
            href: "/admin/cities",
            name: "City Management",
            sub: [
                {
                    name: "Manage Cities",
                    href: "/admin/cities",
                },
            ],
        },
    ];
    
    // const {post} = useForm();
    
    return (
        <div className={`fixed inset-0 z-50 ${open ? "block" : "hidden"}`}>
            <div className="fixed inset-0 bg-black opacity-50 overflow-auto" onClick={() => setOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md overflow-y-auto">
                <div className="flex justify-end p-2">
                    <button onClick={() => setOpen(false)} className="text-6xl">
                        &times; {/* Close icon */}
                    </button>
                </div>
                <div className="px-4 py-2">
                    <div className="flex justify-center mb-4">
                        <span>&#128736; {/* Dashboard icon */}</span>
                    </div>
                    <div className="text-center mb-4 font-semibold">Admin Dashboard</div>
                    <hr className="border-gray-300" />
                    <div className="mt-4">
                        {links.map((link, index) => (
                            <CustomDropDown key={index} defaultLink={link.href} name={link.name} subLinks={link.sub} />
                        ))}
                    </div>




                    <hr className="border-gray-300" />
                    <div className="mt-4">
                        <Link
                            href={'/'}
                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-violet-600 focus:outline-none focus:bg-red-600"
                        >
                            Home Page
                        </Link>
                    </div>
                    {/* logout */}
                    <hr className="border-gray-300" />
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                logout();
                                navigate("/")
                            }}
                            className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
