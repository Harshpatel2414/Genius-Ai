"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaImage } from 'react-icons/fa';

const SignupForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        image: '',
    });
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                router.push('/');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-md shadow-zinc-100 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4 flex items-center w-full">
                        <label className="flex w-full justify-center items-center text-gray-700 mb-2" htmlFor="image">
                            <div className='flex flex-col justify-center w-full items-center'>
                                <Image height={64} width={64} src={imagePreview || "/user.jpeg"} alt="Profile" className="w-16 h-16 rounded-full object-cover object-center border-2 border-blue-500" />
                                <span className='capitalize mt-1 text-sm underline text-blue-500'>Select profile</span>
                            </div>
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full hidden pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <div className="relative">
                            <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder='Username'
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="relative">
                            <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder='Email'
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="relative">
                            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder='Password'
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="relative">
                            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder='Confirm Password'
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? <div className='w-full flex items-center justify-center'>
                            <FaSpinner className="animate-spin w-6 h-6 text-gray-100" />
                        </div> : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p>Already have an account? <Link href="/login" className="text-blue-500">Log In</Link></p>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default SignupForm;
