// src/components/eCommerce/FarmToTable.tsx
import { motion } from 'framer-motion'
import { FaCheckCircle, FaTruck, FaUtensils } from 'react-icons/fa'
import FarmImg from '../../assets/Gemini_Generated_Image_a56kbta56kbta56k.png'
import { useTranslation } from 'react-i18next'
const features = [
    { icon: <FaCheckCircle />, textKey: 'healthMonitoring' },
    { icon: <FaTruck />, textKey: 'fastDelivery' },
    { icon: <FaUtensils />, textKey: 'varietyCheeses' },
]

function FarmToTable() {
    const { t } = useTranslation()
    return (
        <div className='py-12 sm:py-20 px-4 sm:px-8 lg:px-16 bg-linear-to-b from-gray-50 to-white'>
            <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-12'>
                {/* Image */}
                <motion.div
                    className='w-full sm:w-95 h-60 sm:h-80 rounded-lg sm:rounded-2xl overflow-hidden shadow-lg border border-gray-100 shrink-0'
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <img src={FarmImg} alt="Farm" className='w-full h-full object-cover' />
                </motion.div>

                {/* Content */}
                <motion.div
                    className='flex flex-col items-start sm:items-end text-left sm:text-right gap-4 sm:gap-5 flex-1'
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                >
                    <span className='bg-orange-50 text-orange-600 border border-orange-200 text-xs font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full'>
                        {t('freshDaily')}
                    </span>

                    <h2 className='prata-regular text-2xl sm:text-4xl lg:text-5xl text-gray-900 font-bold leading-snug'>
                        {t('fromFarmToTableTitle')}
                    </h2>

                    <p className='text-gray-500 text-xs sm:text-sm leading-relaxed max-w-md'>
                        {t('farmDesc')}
                    </p>

                    <div className='flex flex-col gap-2 sm:gap-3 w-full items-start sm:items-end'>
                        {features.map((f, i) => (
                            <div key={i} className='flex items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm'>
                                <span>{t(f.textKey)}</span>
                                <div className='w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-orange-600 transition-colors duration-300 shrink-0'>
                                    {f.icon}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className='mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg cursor-pointer text-sm'>
                        {t('exploreJourney')}
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

export default FarmToTable
