// src/components/common/footer/Footer.tsx
import { FaPhone, FaMapMarkerAlt, FaFacebook, FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { FaLeaf } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
function Footer() {
    const { t } = useTranslation()
    return (
        <footer className='bg-gray-50 border-t border-gray-100'>
            <div className='max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>

                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className='flex items-center gap-2 mb-4'>
                            <FaLeaf className='text-orange-500' size={20} />
                            <span className='font-bold text-lg text-gray-900'>Laban Al-Laban</span>
                        </div>
                        <p className='text-gray-500 text-sm leading-7'>
                            {t('farmDesc')}
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className='font-bold mb-4 text-gray-900'>Quick Links</p>
                        <div className='flex flex-col gap-3'>
                            {[t('aboutUs', 'About Us'), t('ourProducts', 'Our Products'), t('damiettaPickles', 'Damietta Pickles'), t('exclusiveOffers', 'Exclusive Offers')].map(l => (
                                <a key={l} href="#" className='text-gray-500 text-sm hover:text-orange-600 transition-colors'>{l}</a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Support */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className='font-bold mb-4 text-gray-900'>Support</p>
                        <div className='flex flex-col gap-3'>
                            {['FAQ', 'Shipping & Delivery', 'Return Policy', 'Contact Us'].map(l => (
                                <a key={l} href="#" className='text-gray-500 text-sm hover:text-orange-600 transition-colors'>{l}</a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <p className='font-bold mb-4 text-gray-900'>Contact Us</p>
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center gap-3 text-gray-500 text-sm'>
                                <FaPhone className='text-orange-500' size={14} />
                                <a href='tel:01065689196'>01065689196</a>
                            </div>
                            <div className='flex items-center gap-3 text-gray-500 text-sm'>
                                <MdEmail className='text-orange-500' size={16} />
                                <a href='mailto:jdnejssikemd@gmail.com' className='hover:text-orange-600 transition-colors'>
                                    jdnejssikemd@gmail.com
                                </a>
                            </div>
                            <div className='flex items-center gap-3 text-gray-500 text-sm'>
                                <FaMapMarkerAlt className='text-orange-500' size={14} />
                                <span>ALRODA,Damietta, Egypt</span>
                            </div>
                            <div className='flex gap-3 mt-2'>
                                <a href="https://www.facebook.com/share/1DtkVppLtB/?mibextid=wwXIfr"
                                    target="_blank" rel="noopener"
                                    className='w-10 h-10 rounded-full bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white flex items-center justify-center transition-all duration-300'>
                                    <FaFacebook size={16} />
                                </a>
                                <a href="https://wa.me/201095592832"
                                    target="_blank" rel="noopener"
                                    className='w-10 h-10 rounded-full bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white flex items-center justify-center transition-all duration-300'>
                                    <FaWhatsapp size={16} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className='border-t border-gray-200 text-center py-5 text-gray-400 text-xs'>
                © 2026 Laban Al-Laban. All rights reserved. Made with ❤️ in Damietta &nbsp;|&nbsp;
                Designed by{' '}
                <a href="https://wa.me/201095592832" target="_blank" className='hover:text-orange-600 transition-colors'>
                    MoazReyad
                </a>
            </div>
        </footer>
    )
}

export default Footer
