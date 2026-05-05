import { useTranslation } from 'react-i18next'

function Banner() {
    const { t, } = useTranslation()
    const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'

    const text = t('bannerText')
    // Duplicate text for a seamless infinite marquee loop
    const items = Array(4).fill(text)

    return (
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
    )
}

export default Banner
