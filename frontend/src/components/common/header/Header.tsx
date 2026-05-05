import { useState } from "react"
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from "../../../assets/logo.jpeg"
import { FaUser, FaShoppingCart, FaBars, FaArrowLeft, FaArrowRight, FaSun, FaMoon } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { getTotalQuantity } from '../../../store/cart/selectors/Selectors'
import { logout } from '../../../store/auth/AuthSlice'
import { toast } from 'react-toastify'

function Navbar() {
    const [visible, setVisible] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light'
    })
    const { t, i18n } = useTranslation()
    const totalQuantity = useAppSelector(getTotalQuantity)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
        setTheme(newTheme)
    }

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en'
        i18n.changeLanguage(newLang)
        localStorage.setItem('language', newLang)
    }

    const handleLogout = () => {
        dispatch(logout())
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        toast.success('Logged out successfully')
        navigate('/login')
    }

    return (
        <div className="flex justify-between items-center text-sm py-4 px-2 sm:px-5">
            <Link to="/" className="shrink-0">
                <img src={Logo} alt="logo" className="h-12 sm:h-16 w-auto" />
            </Link>

            <ul className="hidden sm:flex gap-2 sm:gap-5 text-gray-700">
                <NavLink to="/" className="flex flex-col items-center gap-1 hover:text-gray-900 transition-colors">
                    <p className="text-xs sm:text-sm">{t('home')}</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>

                <NavLink to="/categories" className="flex flex-col items-center gap-1 hover:text-gray-900 transition-colors">
                    <p className="text-xs sm:text-sm">{t('collection')}</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>

                <NavLink to="/about" className="flex flex-col items-center gap-1 hover:text-gray-900 transition-colors">
                    <p className="text-xs sm:text-sm">{t('about')}</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>

                <NavLink to="/Contact" className="flex flex-col items-center gap-1 hover:text-gray-900 transition-colors">
                    <p className="text-xs sm:text-sm">{t('contact')}</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>
            </ul>

            <div className="flex items-center gap-2 sm:gap-5">

                <div className="group relative">
                    <Link to="/login">
                        <FaUser className="w-4 sm:w-5 cursor-pointer hover:text-gray-900 transition-colors" />
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-40">
                        <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                            <Link to="/login">    <p className="cursor-pointer hover:text-black transition-colors">{t('myProfile')}</p></Link>
                            <p
                                onClick={handleLogout}
                                className="cursor-pointer hover:text-black transition-colors"
                            >
                                {t('logout')}
                            </p>
                        </div>
                    </div>
                </div>

                <Link to="/cart" className="relative">
                    <FaShoppingCart className="w-6 sm:w-6 cursor-pointer hover:text-amber-600 transition-colors" />
                    <p className="absolute -right-1.25 bottom-2 w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px] font-bold">{totalQuantity}</p>
                </Link>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
                >
                    {theme === 'light' ? <FaMoon className="w-4 h-4" /> : <FaSun className="w-4 h-4" />}
                </button>

                {/* Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors font-medium"
                >
                    {i18n.language === 'en' ? 'عربي' : 'EN'}
                </button>

                <FaBars className="w-5 cursor-pointer sm:hidden hover:text-gray-900 transition-colors" onClick={() => setVisible(true)} />
            </div>

            {/* Mobile Menu */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 ${visible ? 'w-full' : 'w-0'}`}>
                <div className="flex flex-col text-gray-600 h-full">
                    <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer border-b">
                        {i18n.language === 'en' ? <FaArrowLeft className="h-4" /> : <FaArrowRight className="h-4" />}
                        <p>{t('back')}</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-3 px-6 border-b transition-colors ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}`} to="/">{t('home')}</NavLink>
                    <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-3 px-6 border-b transition-colors ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}`} to="/categories">{t('collection')}</NavLink>
                    <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-3 px-6 border-b transition-colors ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}`} to="/about">{t('about')}</NavLink>
                    <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-3 px-6 border-b transition-colors ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}`} to="/Contact">{t('contact')}</NavLink>
                    <button
                        onClick={() => {
                            toggleLanguage()
                            setVisible(false)
                        }}
                        className="py-3 px-6 text-left hover:bg-gray-100 transition-colors font-medium"
                    >
                        {i18n.language === 'en' ? 'عربي' : 'English'}
                    </button>

                    {/* Theme Toggle in mobile menu */}
                    <button
                        onClick={() => {
                            toggleTheme()
                            setVisible(false)
                        }}
                        className="py-3 px-6 text-left hover:bg-gray-100 transition-colors font-medium flex items-center gap-2"
                    >
                        {theme === 'light' ? <FaMoon className="w-4 h-4" /> : <FaSun className="w-4 h-4" />}
                        {theme === 'light' ? t('darkMode') : t('lightMode')}
                    </button>

                    {/* Logout in mobile menu */}
                    <button
                        onClick={() => {
                            handleLogout()
                            setVisible(false)
                        }}
                        className="py-3 px-6 text-left hover:bg-gray-100 transition-colors text-red-500 font-medium"
                    >
                        {t('logout')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar