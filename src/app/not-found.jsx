import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-white">
            <div className="p-6  rounded-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Sorry, the page you are looking for does not exist.
                </p>
                <Link href="/" className="inline-block px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Go to Homepage</Link>
            </div>
        </div>
    );
}
