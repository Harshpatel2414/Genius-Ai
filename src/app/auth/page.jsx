"use client";
import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup ? '/api/signup' : '/api/login';
    const body = JSON.stringify({
      email,
      password,
      ...(isSignup && { confirmPassword }),
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md shadow-zinc-100 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">
          {isSignup ? 'Sign Up' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
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
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          {isSignup && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
