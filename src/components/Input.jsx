import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Input = ({ handleSendMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const {currentUser} = useAuth()
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const sendMessage = () => {
        if (inputValue.trim().length > 6 && currentUser) {
            handleSendMessage(inputValue.trim());
            setInputValue('');
        }else{
            setInputValue("")
            toast.error("Login is needed!")
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="flex items-center gap-4 mt-4 drop-shadow-smooth">
            <input
                type="text"
                placeholder="Ask your query"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 p-2 sm:p-1 md:p-2 lg:p-3 border rounded-lg outline-none"
            />
            <button
                onClick={sendMessage}
                className={`p-2 rounded-lg ${inputValue.trim().length > 6 && currentUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={inputValue.trim().length <= 6 }
            >
                Send
            </button>
        </div>
    );
};

export default Input;
