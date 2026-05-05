import Hero from '../../assets/hero.png'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
}

const fadeUpItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
}

const fadeInScale = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
}

function HeroBanner() {
    const { t } = useTranslation()

    return (
        <div className='flex flex-col sm:flex-row border h-72 sm:h-96 md:h-112.5 lg:h-150'>
            {/* Left Text */}
            <motion.div
                className='sm:w-1/2 w-full flex justify-center items-center py-10 sm:py-12 md:py-0 px-4 sm:px-6'
                variants={containerVariants}
                initial='hidden'
                animate='visible'
            >
                <div className='flex flex-col gap-2 sm:gap-3'>
                    <motion.div className='flex flex-row items-center gap-2 sm:gap-3' variants={fadeUpItem}>
                        <span className='w-10 sm:w-14 md:w-16 h-0.5 bg-black'></span>
                        <p className='font-bold text-xs sm:text-sm'>{t('bestSellers')}</p>
                    </motion.div>
                    <motion.h1
                        className='prata-regular text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight sm:leading-relaxed'
                        variants={fadeUpItem}
                    >
                        {t('newArrivals')}
                    </motion.h1>
                    <motion.div className='flex flex-row items-center gap-2 sm:gap-3' variants={fadeUpItem}>
                        <p className='font-bold text-xs sm:text-sm'>{t('shopNow')}</p>
                        <span className='w-10 sm:w-14 md:w-16 h-0.5 bg-black'></span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
                className='w-full sm:w-1/2 h-72 sm:h-full overflow-hidden '
                variants={fadeInScale}
                initial='hidden'
                animate='visible'
            >
                <img src={Hero} alt='' className='h-full w-full object-cover' />
            </motion.div>
        </div>
    )
}

export default HeroBanner