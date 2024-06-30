import Link from 'next/link';
import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="h-full flex flex-col items-center bg-white overflow-y-scroll px-5 py-10 hide-scrollbar animate-fadeIn">
            <div className="max-w-4xl h-fit w-full lg:w-3/4 bg-white  rounded-lg px-0 py-8 md:p-8 relative lg:text-justify">
                <Link href={'/about'} className='top-0 lg:top-4 right-4 absolute underline text-blue-500'>Back</Link>
                <h1 className="text-3xl font-bold text-blue-500 mb-6 text-center">Privacy Policy</h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Welcome to the Privacy Policy of <span className="font-semibold text-blue-500">Genius<span className="text-zinc-700">AI</span></span>. Your privacy is critically important to us. We are committed to protecting your personal information and your right to privacy.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    This Privacy Policy document contains types of information that is collected and recorded by GeniusAI and how we use it.
                </p>
                <h2 className="text-xl font-semibold text-blue-500 mb-4">Information We Collect</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    We collect several different types of information for various purposes to provide and improve our Service to you.
                </p>
                <h2 className="text-xl font-semibold text-blue-500 mb-4">How We Use Your Information</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    We use the collected data for various purposes: to provide and maintain our Service, to notify you about changes to our Service, and to provide customer support.
                </p>
                <h2 className="text-xl font-semibold text-blue-500 mb-4">Data Security</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    The security of your data is important to us. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
                </p>
                <footer className="mt-2 text-center text-gray-600">
                    <p>&copy; {new Date().getFullYear()} GeniusAI. All rights reserved.</p>
                    <p>Designed and developed by the GeniusAI Team.</p>
                    <p>
                        <Link href="/terms-and-conditions" className="text-blue-500">Terms and Conditions</Link> | 
                        <Link href="/about" className="text-blue-500"> About Us</Link>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
