import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const { t } = useTranslation();
    const linkStyle = "block py-3 px-4 text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100";
    const activeStyle = "bg-blue-50 text-blue-600 border-r-4 border-r-blue-600";

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-[70%] sm:w-[60%] md:w-[45%] lg:w-[18%] 
                h-screen border-r border-gray-300 bg-white flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className='flex flex-col pt-5'>
                    <NavLink
                        to='/Adding'
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}
                    >
                        {t('addProduct')}
                    </NavLink>

                    <NavLink
                        to='/List'
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}
                    >
                        {t('listItems')}
                    </NavLink>

                    <NavLink
                        to='/Orders'
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}
                    >
                        {t('orders')}
                    </NavLink>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
