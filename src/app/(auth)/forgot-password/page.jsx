"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaLock, FaEnvelope, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP and New Password
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                setStep(2);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                router.push('/login');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = (e) => {
        e.preventDefault()
        setStep(1);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-md shadow-zinc-100 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">
                    {step === 1 ? 'Forgot Password' : 'Reset Password'}
                </h2>
                <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
                    {step === 1 ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md ${loading ? 'cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className='w-full flex items-center justify-center'>
                                        <FaSpinner className="animate-spin w-6 h-6 text-gray-100" />
                                    </div>
                                ) : 'Send OTP'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="otp">
                                    OTP
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="new-password">
                                    New Password
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        id="new-password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md ${loading ? 'cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className='w-full flex items-center justify-center'>
                                        <FaSpinner className="animate-spin w-6 h-6 text-gray-100" />
                                    </div>
                                ) : 'Reset Password'}
                            </button>
                            <button
                                className="w-full py-2 px-4 mt-4 bg-gray-500 text-white rounded-md"
                                onClick={handleBack}
                            >
                                Back
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
