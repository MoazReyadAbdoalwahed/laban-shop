import { Outlet, useLocation } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import Header from '../components/common/header/Header'
import Banner from '../components/eCommerce/Banner'
import Footer from '../components/common/footer/Footer'
function Mainlayout() {
    const location = useLocation()
    const isHome = location.pathname === '/'


    return (
        <div className="relative">
            {isHome && <Banner />}
            <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
                <Header />
                <Outlet />
            </div>
            <Footer />

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/201065689196"
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: 'fixed', bottom: '24px', right: '16px', zIndex: 9999 }}
                className="bg-green-500 hover:bg-green-600 text-white 
                           rounded-full w-14 h-14 shadow-lg 
                           transition-all duration-300 
                           flex items-center justify-center"
                aria-label="Contact us on WhatsApp"
            >
                <FaWhatsapp size={28} />
            </a>
        </div>
    )
}

export default Mainlayout
