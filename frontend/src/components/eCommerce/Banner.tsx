import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './Banner.css'

function Banner() {
    const { t, } = useTranslation()
    const [showBanner, setShowBanner] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'

    const text = t('bannerText')
    // Duplicate text for a seamless infinite marquee loop
    const items = Array(4).fill(text)

    // Scroll detection for banner visibility
    useEffect(() => {
        const controlBanner = () => {
            if (window.scrollY > lastScrollY) {
                // Scrolling down - show banner
                setShowBanner(true)
            } else {
                // Scrolling up - hide banner
                setShowBanner(false)
            }
            setLastScrollY(window.scrollY)
        }

        window.addEventListener('scroll', controlBanner)
        return () => {
            window.removeEventListener('scroll', controlBanner)
        }
    }, [lastScrollY])

    return (
        <div className={`banner-container ${showBanner ? 'banner-visible' : 'banner-hidden'}`}>
            <div className="w-full bg-orange-500 overflow-hidden py-3">
                <div
                    className={`whitespace-nowrap inline-flex ${isRtl ? 'animate-marquee-rtl' : 'animate-marquee'}`}
                    aria-label={text}
                >
                    {items.map((item, index) => (
                        <span
                            key={index}
                            className="text-white font-bold text-sm sm:text-base md:text-lg mx-8 shrink-0"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Banner
