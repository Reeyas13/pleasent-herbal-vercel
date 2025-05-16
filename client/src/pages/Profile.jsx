import React, { useState } from 'react';
import FrontendLayout from '../layouts/FrontendLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [formData, setFormData] = useState({
        userId: "",
        addressLine1: "",
        addressLine2: "",
        city_id: "",
        state: "",
        phone: "",
    });
    const queryClient = useQueryClient();

    // Fetch profile data
    const { data: profile, isLoading, isError, error } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await api.get("/api/user/getmyInfo", { withCredentials: true });
            console.log({ usr: response.data.user })
            return response.data.user;
        },
    });

    const { data: cities, isLoading: cityLoading, isError: cityError } = useQuery({
        queryKey: ['cities'], // Unique key for the query
        queryFn: async () => {
            const response = await api.get('/api/city'); // API endpoint to fetch cities
            return response.data;
        },
    });
    const { data: addressData } = useQuery({
        queryKey: ["userAddress"],
        queryFn: async () => {
            const response = await api.get("/api/user-address/get/myaddress", { withCredentials: true });
            console.log(response.data)
            if (response.data.success) {
                setFormData({
                    userId: profile.id,
                    addressLine1: response.data.userAddress.addressLine1,
                    addressLine2: response.data.userAddress.addressLine2,
                    city_id: response.data.userAddress.city_id,
                    state: response.data.userAddress.state,
                    phone: response.data.userAddress.phone,
                });
            }
            return response.data.userAddress;
        },
        // enabled: !!profile && !profile.addresses, // Only fetch if profile exists and address is empty
        onSuccess: (data) => {
            if (data) {
                console.log({ data })
                setFormData({
                    userId: profile.id,
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2,
                    city_id: data.city_id,
                    state: data.state,
                    phone: data.phone,
                });
                console.log({ formData })
            }
        }
    });

    // Mutation to add/update the address
    const addressMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await api.post("/api/user-address", formData, { withCredentials: true });

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["profile"]);
            setShowAddressForm(false);
            toast.success("Address updated successfully!")
        },
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ formData })
        addressMutation.mutate(formData);
    };

    if (isLoading) return <div className="text-center"><Loader /></div>;
    if (isError) return <div className="text-center text-red-500">Error: {error.message}</div>;

    return (
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h1>

                {/* User Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">User Details</h2>
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Address:</strong> {` ${addressData?.City?.name} , ${addressData?.addressLine1} ` || "Not provided"}</p>
                        <p><strong>Phone:</strong> {addressData && addressData.phone}</p>
                    </div>
                    {profile.addresses ? (
                        <button
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="mt-4 text-blue-500 underline"
                        >
                            Update Address
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="mt-4 text-blue-500 underline"
                        >
                            Add Address
                        </button>
                    )}
                </div>

                {/* Address Form */}
                {showAddressForm && (
                    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                        <h2 className="text-xl font-medium text-gray-700 mb-4">Address Details</h2>
                        <div className="space-y-2">
                            <input type="hidden" name="userId" value={formData.userId} />
                            <div>
                                <label className="block text-gray-700">Address Line 1</label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Address Line 2</label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">City</label>

                                <select name="city_id" onChange={handleInputChange} value={formData.city_id}
                                    className="w-full border border-gray-300 rounded p-2"
                                    id="">
                                    {Array.isArray(cities) && cities.map((city) => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {profile.address ? "Update Address" : "Add Address"}
                            </button>
                        </div>
                    </form>
                )}

                {/* Order History Section */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Order History</h2>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Order ID</th>
                                <th className="py-2 px-4 border-b">Date</th>
                                <th className="py-2 px-4 border-b">Total</th>
                                <th className="py-2 px-4 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profile.orders?.map((order) => (
                                <tr key={order.id} className="text-center border-b">
                                    <td className="py-2 px-4">{order.id}</td>
                                    <td className="py-2 px-4">  {new Date(order.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}</td>
                                    <td className="py-2 px-4">{order.total}</td>
                                    <td className="py-2 px-4">
                                        <span className={`py-1 px-3 rounded-full text-sm ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                                            order.status === "SHIPPED" ? "bg-yellow-100 text-yellow-700" :
                                                "bg-blue-100 text-blue-700"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
                <Link to={"/overview"} className="w-full mt-12 bg-blue-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-600">Overview</Link>
            </div>
    );
};

export default Profile;
