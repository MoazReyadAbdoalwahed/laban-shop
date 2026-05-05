import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Login = ({ setToken }) => {
    const { t, i18n } = useTranslation();

    // 1. Initialize React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // 2. Axios Login Function
    const onSubmit = async (data) => {
        try {
            // Replace with your actual API URL
            const response = await axios.post(`${import.meta.env.VITE_API_URL}users/admin/login`, data);
            console.log("Login Response:", response.data);
            if (response.data.status === "success") {
                const token = response.data.data.token;
                setToken(token);
                localStorage.setItem('token', token);
            } else {
                alert(response.data.message || t('loginFailed'));
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert(error.response?.data?.message || t('somethingWentWrong'));
        }
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('adminLanguage', newLang);
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='absolute top-4 right-4'>
                <button
                    onClick={toggleLanguage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    {i18n.language === 'en' ? 'العربية' : 'English'}
                </button>
            </div>
            <div className='bg-white shadow-md rounded-lg px-8 py-10 max-w-md w-full border border-gray-100'>
                <h1 className='text-2xl font-bold mb-6 text-gray-800'>{t('adminPanel')}</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Email Field */}
                    <div className='mb-4'>
                        <p className='text-sm font-semibold text-gray-600 mb-2'>{t('email')}</p>
                        <input
                            {...register("email", { required: t('emailRequired') })}
                            className={`rounded-md w-full px-3 py-2 border outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                            type="email"
                            placeholder='your@email.com'
                        />
                        {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className='mb-6'>
                        <p className='text-sm font-semibold text-gray-600 mb-2'>{t('password')}</p>
                        <input
                            {...register("password", {
                                required: t('passwordRequired'),
                                minLength: { value: 6, message: t('passwordMinLength') }
                            })}
                            className={`rounded-md w-full px-3 py-2 border outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                            type="password"
                            placeholder={t('password')}
                        />
                        {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className='bg-blue-600 text-white w-full py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors'
                    >
                        {t('signIn')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;