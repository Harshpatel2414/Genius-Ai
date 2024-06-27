import { FaCircleNotch } from 'react-icons/fa';

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-full bg-white">
            <div className="flex flex-col items-center">
                <FaCircleNotch className="animate-spin text-blue-500 text-4xl" />
            </div>
        </div>
    )
};

export default Loading;
