import Link from 'next/link';
import React from 'react';

export const metadata = {
    title: 'Terms and Conditions | GeniusAI',
    description: 'Read the terms and conditions for using GeniusAI, our services, and how we handle your data.'
};

const TermsAndConditions = () => {
    return (
        <div className="h-full flex flex-col items-center bg-white overflow-y-scroll px-5 py-10 hide-scrollbar animate-fadeIn">
            <div className="max-w-4xl h-fit w-full lg:w-3/4 bg-white rounded-lg px-0 py-8 md:p-8 relative lg:text-justify">
                <Link href={'/about'} className='top-0 lg:top-4 right-4 absolute underline text-blue-500'>Back</Link>
                <h1 className="text-3xl text-left font-bold text-blue-500 mt-2 lg:mt-0 mb-6 lg:text-center">Terms and Conditions</h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Welcome to <span className="font-semibold text-blue-500">Genius<span className="text-zinc-700">AI</span></span>. By using our services, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.
                </p>
                <h2 className="text-xl font-semibold text-blue-500 mb-2 mt-3">1. Acceptance of Terms</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <h2 className="text-xl font-semibold text-blue-500 mb-2 mt-3">2. Privacy Policy</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Our privacy policy, which sets out how we will use your information, can be found at <Link href={'/privacy-policy'} className="underline text-blue-500">Privacy Policy</Link>. By using this website, you consent to the processing described therein and warrant that all data provided by you is accurate.
                </p>
                <h2 className="text-xl font-semibold text-blue-500 mb-2 mt-3">3. Intellectual Property</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    The content on the site, including without limitation, the text, software, scripts, graphics, photos, sounds, music, videos, and interactive features and the trademarks, service marks, and logos contained therein are owned by or licensed to GeniusAI, subject to copyright and other intellectual property rights under the law.
                </p>
                <h2 className="text-xl font-semibold text-blue-500 mb-2 mt-3">4. User Obligations</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Service in any way that could damage the Service, the servers, or the network connected to the Service.
                </p>
                <h2 className="text-xl font-semibold text-blue-500 mb-2 mt-3">5. Limitation of Liability</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    GeniusAI will not be liable for any damages of any kind arising out of or in connection with the use of this site. This is a comprehensive limitation of liability that applies to all damages of any kind.
                </p>
                <h2 className="text-xl font-semibold text-blue-500 mb-2 mt-3">6. Changes to the Terms</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    GeniusAI reserves the right, in its sole discretion, to modify or replace these Terms at any time. If the alterations constitute a material change to the Terms, we will notify you by posting an announcement on the Site. What constitutes a material change will be determined at our sole discretion.
                </p>
                <footer className="mt-6 text-center text-gray-600">
                    <p>&copy; {new Date().getFullYear()} GeniusAI. All rights reserved.</p>
                    <p>Designed and developed by the GeniusAI Team.</p>
                </footer>
            </div>
        </div>
    );
};

export default TermsAndConditions;
