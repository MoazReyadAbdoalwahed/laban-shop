import { useTranslation } from 'react-i18next'
import { FaMapMarkerAlt, FaLeaf } from 'react-icons/fa'
import { FaRegClock } from 'react-icons/fa'
import { motion } from 'framer-motion'

const cardContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
}

const cardItem = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
}

function WhyChooseUs() {
    const { t } = useTranslation()

    const features = [
        {
            id: 'quality',
            icon: <FaMapMarkerAlt size={28} color='#000' />,
            titleKey: 'qualityTitle',
            descKey: 'qualityDesc',
        },
        {
            id: 'fresh',
            icon: <FaRegClock size={28} color='#000' />,
            titleKey: 'freshTitle',
            descKey: 'freshDesc',
        },
        {
            id: 'natural',
            icon: <FaLeaf size={28} color='#000' />,
            titleKey: 'naturalTitle',
            descKey: 'naturalDesc',
        },
    ]

    return (
        <div className='py-12 sm:py-20 px-4 sm:px-8 lg:px-16'>
            {/* Section Title */}
            <motion.div
                className='text-center mb-10 sm:mb-14'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
            >
                <h2 className='prata-regular text-2xl sm:text-3xl lg:text-4xl text-gray-900'>{t('whyChooseUs')}</h2>
                <div className='w-16 sm:w-20 h-0.5 sm:h-1 bg-black mx-auto mt-3 sm:mt-4 rounded-full'></div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
                className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8'
                variants={cardContainer}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, margin: '-80px' }}
            >
                {features.map((feature) => (
                    <motion.div
                        key={feature.id}
                        className='group flex flex-col items-center text-center gap-5 p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300'
                        variants={cardItem}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className='p-5 rounded-full bg-gray-50 border-2 border-gray-200 group-hover:border-black group-hover:bg-white transition-colors duration-300'>
                            {feature.icon}
                        </div>
                        <h3 className='font-bold text-xl text-gray-900'>{t(feature.titleKey)}</h3>
                        <p className='text-gray-500 leading-relaxed'>{t(feature.descKey)}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default WhyChooseUs