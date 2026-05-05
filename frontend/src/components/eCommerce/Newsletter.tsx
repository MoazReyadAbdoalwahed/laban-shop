import { MdEmail } from 'react-icons/md'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
function Newsletter() {
    const { t } = useTranslation()
    return (
        <div className='py-12 sm:py-20 px-4 sm:px-8 lg:px-16 bg-white'>
            <motion.div
                className='max-w-3xl mx-auto bg-orange-50 rounded-2xl sm:rounded-3xl py-10 sm:py-14 px-4 sm:px-10 flex flex-col items-center text-center gap-4 sm:gap-5 border border-orange-100'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <div className='w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-orange-600 flex items-center justify-center shadow-md'>
                    <MdEmail size={20} color="#fff" />
                </div>
                <h3 className='prata-regular text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900'>
                    {t('joinFamily')}
                </h3>
                <p className='text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm'>
                    {t('newsletterDesc')}
                </p>
                <div className='flex flex-col sm:flex-row w-full max-w-md border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm focus-within:shadow-md focus-within:border-orange-300 transition-all duration-300'>
                    <input
                        type="email"
                        placeholder="Your email address"
                        className='flex-1 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm outline-none text-gray-700 bg-white'
                    />
                    <button className='bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap'>
                        {t('subscribeNow')}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
export default Newsletter
