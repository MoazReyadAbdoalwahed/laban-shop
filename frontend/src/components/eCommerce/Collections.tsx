import { useAppSelector } from '../../store/hooks'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FallbackImg } from '../../components/common/ImageUtils'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
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

function Collections() {
    const { t } = useTranslation()
    const { items } = useAppSelector((state) => state.products)

    return (
        <div className='py-20 px-4 sm:px-8 lg:px-16'>
            {/* Section Header */}
            <motion.div
                className='text-center mb-16'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
            >
                <p className='text-gray-600 text-sm tracking-widest mb-2 uppercase'>{t('latestText')}</p>
                <h2 className='prata-regular text-4xl sm:text-5xl text-gray-900 mb-6'>
                    {t('latestCollections')}
                </h2>
                <p className='text-gray-600 max-w-2xl mx-auto leading-relaxed'>
                    {t('collectionsDesc')}
                </p>
            </motion.div>

            {/* Products Grid */}
            <motion.div
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'
                variants={containerVariants}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, margin: '-80px' }}
            >
                {Array.isArray(items) && items.slice(0, 10).map((product) => (
                    <motion.div key={product.id} variants={cardItem} className='group'>
                        <Link to={`/product/${product.id}`}>
                            <div className='relative overflow-hidden bg-gray-100 rounded-lg mb-4 h-72 sm:h-80'>
                                <FallbackImg
                                    src={product.img}
                                    alt={product.title}
                                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <h3 className='text-sm sm:text-base font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors'>
                                    {product.title}
                                </h3>
                                <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                    {product.price} EGP
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default Collections
