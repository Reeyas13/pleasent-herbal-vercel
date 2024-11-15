import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/auth-slice';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    // const { mutateAsync: loginUser } = useMutation({
    //     mutationFn: async (data) => {
    //         const response = await api.post('/api/user/login', data);
    //         return response.data;
    //     },
    //     onSuccess: (data) => {
    //         toast.success('Logged in successfully!');
    //         navigate('/products'); 
    //     },
    //     onError: (error) => {
    //         toast.error(`Login failed: ${error.response?.data.message || error.message}`);
    //     },
    // });
const dispatch = useDispatch()
    const onSubmit = async (data) => {
        dispatch(loginUser(data)).then((data) => {
           
            if (data?.payload?.success) {
                toast.success(data.payload.message || 'verify login with otp!');
                navigate('/verify-login');
            } else {
                toast.error(`${data?.payload?.message}`  );
            }
        });
       
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don’t have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
