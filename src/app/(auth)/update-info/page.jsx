"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const UpdateUserForm = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        userId: '',
        username: '',
        email: '',
        gender: 'male',
        agreeTerms: false,
        image: '',
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
    });
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [imgError, setImgError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                userId: currentUser._id,
                username: currentUser.username || '',
                email: currentUser.email || '',
                gender: currentUser.gender || 'male',
                agreeTerms: currentUser.agreeTerms || false,
                image: currentUser.image || '',
            });
            setImagePreview(currentUser.image || '/user.jpeg');
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file.size < 2 * 1024 * 1024) {
            setImgError(false)
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImgError(true)
        }
    };

    const updateUser = async () => {
        try {
            setLoading(true);
            console.log(formData);
            const response = await fetch('/api/update-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update user information');
            }

            const data = await response.json();
            setCurrentUser(data.user)
            toast.success(data.message);
            router.back()
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('An error occurred while updating user information');
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async () => {
        if (passwordData.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters');
            return;
        }
        try {
            setLoading(true);
            const passwordDataToSend = {
                userId: currentUser._id,
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            };
            console.log(passwordDataToSend);
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordDataToSend),
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message)
            } else {
                router.back()
                toast.success(data.message);
            }
        } catch (error) {
            toast.error('An error occurred while changing password');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (showPasswordFields) {
            await changePassword();
        } else {
            await updateUser();
        }
    };

    if (!currentUser) {
        router.push('/')
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-md shadow-zinc-100 w-full max-w-md relative">
                <Link href={'/'} className='top-4 left-4 absolute underline text-blue-500'>Back</Link>
                <h2 className="text-xl font-semibold text-center text-gray-500">User Information</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className={`transition-all duration-1000 ease-in-out ${!showPasswordFields ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        {!showPasswordFields && (
                            <>
                                <div className="mb-4 flex items-center w-full">
                                    <label className="flex w-full justify-center items-center text-gray-700 mb-2" htmlFor="image">
                                        <div className='flex flex-col justify-center w-full items-center'>
                                            <Image height={64} width={64} src={imagePreview || "/user.jpeg"} alt="Profile" className="w-16 h-16 rounded-full object-cover object-center border-2 border-blue-500" />
                                            {imgError ? <span className='text-red-400 text-sm'>Upload image less than 2mb</span> : <span className='capitalize mt-1 text-sm underline text-blue-500'>change profile</span>}
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full hidden pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <div className="relative">
                                        <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            placeholder="Username"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="relative">
                                        <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Email"
                                            disabled
                                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Gender :</label>
                                    <label className="inline-flex items-center">
                                        <span className="mr-2">Male</span>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === "male"}
                                            onChange={handleInputChange}
                                            className="form-radio"
                                        />
                                    </label>
                                    <label className="inline-flex items-center ml-6">
                                        <span className="mr-2">Female</span>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === "female"}
                                            onChange={handleInputChange}
                                            className="form-radio"
                                        />
                                    </label>
                                    <label className="inline-flex items-center ml-6">
                                        <span className="mr-2">Other</span>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="other"
                                            checked={formData.gender === "other"}
                                            onChange={handleInputChange}
                                            className="form-radio"
                                        />
                                    </label>
                                </div>
                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="agreeTerms"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        Agree to terms and conditions
                                    </label>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => setShowPasswordFields(!showPasswordFields)}
                            className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-md outline-none border"
                        >
                            {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
                        </button>
                    </div>
                    <div className={`transition-all duration-500 ease-in-out ${showPasswordFields ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        {showPasswordFields && (
                            <>
                                <div className="mb-4">
                                    <div className="relative">
                                        <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            id="password"
                                            name="oldPassword"
                                            value={passwordData.password}
                                            onChange={handlePasswordChange}
                                            placeholder="Old Password"
                                            required={showPasswordFields}
                                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="relative">
                                        <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="newPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="New Password"
                                            required={showPasswordFields}
                                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md ${loading ? 'cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? <div className='w-full flex items-center justify-center'>
                            <FaSpinner className="animate-spin w-6 h-6 text-gray-100" />
                        </div> : 'Update Info'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserForm;
