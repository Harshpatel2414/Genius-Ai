import Link from 'next/link';
import React from 'react';

export const metadata = {
    title: 'About GeniusAI',
    description: 'Learn more about GeniusAI, our mission, and how we utilize advanced AI technology to provide personalized and accurate information.'
};

const About = () => {
    return (
        <div className="h-full flex flex-col items-center bg-white overflow-y-scroll px-5 py-10 hide-scrollbar animate-fadeIn">
            <div className="max-w-4xl h-fit w-full lg:w-3/4 bg-white  rounded-lg px-0 py-8 md:p-8 relative lg:text-justify">
                <Link href={'/'} className='top-4 right-4 absolute underline text-blue-500'>Back</Link>
                <h1 className="text-3xl font-bold text-blue-500 mb-6 text-center">About Us</h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Welcome to <span className="font-semibold text-blue-500">Genius<span className="text-zinc-700">AI</span></span>! We are dedicated to providing you with intelligent and efficient solutions to enhance your online experience. Whether you need product recommendations, answers to your queries, or assistance with finding the right products, GeniusAI is here to help.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Our mission is to utilize advanced artificial intelligence technology to deliver personalized and accurate information that meets your needs. With GeniusAI, you can expect a seamless and user-friendly experience tailored to your preferences.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Our team is constantly working to improve and expand our services to ensure that you have access to the latest and most relevant information. We value your feedback and are always open to suggestions on how we can better serve you.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Thank you for choosing GeniusAI. We look forward to assisting you and making your online journey more enjoyable and productive.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    If you have any questions or need further assistance, please feel free to <Link href="/contact" className="underline text-blue-500">contact us</Link>. We are here to help you with any inquiries or support you may need.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Please make sure to read our <Link href="/terms-and-conditions" className="underline text-blue-500">Terms and Conditions</Link> to understand the rules and guidelines for using our services.
                </p>
                <div className="flex items-center justify-center mt-6">
                    {/* <img
                        src="/images/genius-ai-logo.png" // Ensure you have a logo image in the public/images folder
                        alt="GeniusAI Logo"
                        className="h-32 w-auto"
                    /> */}
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

export default About;
