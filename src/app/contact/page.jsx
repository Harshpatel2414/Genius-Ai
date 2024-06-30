"use client"
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const metadata = {
    title: 'Contact GeniusAI',
    description: 'Get in touch with the GeniusAI team for any inquiries or support.'
};

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [msgError, setMsgError] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.message.length > 10) {
            setMsgError(false)
            setLoading(true);
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (response.ok) {
                    toast.success(result.message);
                    setFormData({ name: '', email: '', message: '' });
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error('Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setMsgError(true)
        }
    };

    return (
        <div className="h-full flex flex-col items-center  bg-white overflow-y-scroll px-5 py-10 hide-scrollbar animate-fadeIn">
            <div className="max-w-4xl h-fit w-full lg:w-3/4 bg-white rounded-lg px-0 py-8 md:p-8 relative lg:text-justify">
                <Link href={'/'} className='top-4 right-4 absolute underline text-blue-500'>Back</Link>
                <h1 className="text-3xl font-bold text-blue-500 mb-6 text-center">Contact Us</h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Welcome to <span className="font-semibold text-blue-500">Genius<span className="text-zinc-700">AI</span></span>. If you have any questions, suggestions, or need further assistance, please fill out the form below and we'll get back to you as soon as possible.
                </p>
                <div className="max-w-lg h-fit w-full lg:w-full bg-white shadow-md rounded-lg p-5 relative lg:text-justify mx-auto mt-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                    required
                                    className="w-full pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    required
                                    className="w-full pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="relative">
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Your message"
                                    required
                                    className="w-full pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows="6"
                                ></textarea>
                                {msgError ? <span className='text-red-400 text-sm'>Write more text inside message</span>:""}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md ${loading ? 'cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-full flex items-center justify-center">
                                    <span className="text-gray-100">Sending...</span>
                                </div>
                            ) : (
                                'Send Message'
                            )}
                        </button>
                    </form>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <h1 className="text-lg font-semibold tracking-wider text-blue-500">
                        Genius<span className="text-zinc-700">AI</span>
                    </h1>
                </div>
                <footer className="mt-2 text-center text-gray-600">
                    <p>&copy; {new Date().getFullYear()} GeniusAI. All rights reserved.</p>
                    <p>Designed and developed by the GeniusAI Team.</p>
                </footer>
            </div>
        </div>
    );
};

export default Contact;
