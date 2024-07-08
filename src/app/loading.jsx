import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-full bg-white">
            <div className='w-full flex items-center justify-center'>
                <FaSpinner className="animate-spin w-6 h-6 text-blue-500" />
            </div>
        </div>
    )
};

export default Loading;
