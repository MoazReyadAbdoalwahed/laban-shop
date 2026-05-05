import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiMenu, HiX } from 'react-icons/hi';

function NavLink({ setToken, toggleSidebar, sidebarOpen }) {
    const { t, i18n } = useTranslation();

    const logout = () => {
        localStorage.removeItem('token');
        setToken('null');
    }

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('adminLanguage', newLang);
    }

    return (
        <nav className="flex items-center justify-between px-4 lg:px-[4%] py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
                <div className="flex flex-col items-start leading-tight">
                    <h1 className="text-xl lg:text-2xl font-bold tracking-tighter text-gray-800">
                        Moaz<span className="text-pink-400 text-2xl lg:text-3xl ml-0.5">.</span>
                    </h1>
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-pink-400 uppercase">
                        {t('adminPanel')}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleLanguage}
                    className="bg-blue-50 text-blue-600 px-3 lg:px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                    {i18n.language === 'en' ? 'العربية' : 'English'}
                </button>
                <button
                    onClick={logout}
                    className="bg-slate-700 text-white px-4 lg:px-8 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                    {t('logout')}
                </button>
            </div>
        </nav>
    );
}

export default NavLink;
