import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectCartTotalPrice } from '../store/cart/selectors/Selectors'
import { clearCart } from '../store/cart/CartSlice'

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } }
}

interface AddressForm {
    fullName: string
    street: string
    city: string
    phone: string
}

const PlaceOrder = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { token } = useAppSelector((state) => state.auth)
    const { productFullinformation, items } = useAppSelector((state) => state.cart)
    const totalPrice = useAppSelector(selectCartTotalPrice)

    const [address, setAddress] = useState<AddressForm>({
        fullName: '',
        street: '',
        city: '',
        phone: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const itemCount = productFullinformation.reduce((count, product) => {
        return count + (items[String(product.id)] || 0)
    }, 0)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setAddress((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!token) {
            setError(t('loginRequired', 'Please log in to place an order'))
            return
        }

        if (productFullinformation.length === 0) {
            setError(t('emptyCart', 'Your cart is empty'))
            return
        }

        if (!address.fullName.trim() || !address.street.trim() || !address.city.trim() || !address.phone.trim()) {
            setError(t('fillAddress', 'Please fill in all address fields'))
            return
        }

        const products = productFullinformation.map((product) => ({
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: items[String(product.id)] || 1,
            img: product.img
        }))

        try {
            setLoading(true)
            await axios.post(
                `${import.meta.env.VITE_API_URL}orders/create`,
                {
                    products,
                    totalAmount: totalPrice,
                    address
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setSuccess(true)
            dispatch(clearCart())
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    err.response?.data?.msg ||
                    err.message ||
                    t('orderError', 'Failed to place order')
                )
            } else {
                setError(t('orderError', 'Failed to place order'))
            }
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className='bg-white text-gray-900 min-h-screen flex items-center justify-center px-4'>
                <motion.div
                    className='text-center max-w-md'
                    variants={fadeUp}
                    initial='hidden'
                    animate='visible'
                >
                    <div className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 mx-auto'>
                        <svg className='w-10 h-10 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                        </svg>
                    </div>
                    <h2 className='text-3xl font-bold mb-3' style={{ fontFamily: 'Playfair Display,serif' }}>
                        {t('orderPlaced', 'Order Placed!')}
                    </h2>
                    <p className='text-gray-500 mb-8'>
                        {t('orderPlacedDesc', 'Thank you for your purchase. We will process it shortly.')}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className='bg-[#0f1e35] hover:bg-[#1a3a5c] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:-translate-y-1'
                    >
                        {t('backHome', 'Back to Home')}
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className='bg-white text-gray-900 min-h-screen'>
            {/* Page Header */}
            <div className='bg-[#f0f4ff] text-center py-14 px-4'>
                <motion.div variants={fadeUp} initial='hidden' animate='visible'>
                    <h1 className='text-4xl sm:text-5xl font-bold mb-3' style={{ fontFamily: 'Playfair Display,serif' }}>
                        {t('placeOrder', 'Place Order')}
                    </h1>
                    <p className='text-gray-500 text-sm leading-relaxed max-w-md mx-auto'>
                        {t('placeOrderDesc', 'Review your items and provide your shipping details to complete the order.')}
                    </p>
                </motion.div>
            </div>

            {/* Content */}
            <div className='px-4 sm:px-8 lg:px-16 py-10 max-w-6xl mx-auto'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Order Summary */}
                    <motion.div
                        className='lg:col-span-2'
                        variants={fadeUp}
                        initial='hidden'
                        animate='visible'
                    >
                        <h2 className='text-xl font-bold mb-5 pl-3 border-l-4 border-orange-500' style={{ fontFamily: 'Playfair Display,serif' }}>
                            {t('orderSummary', 'Order Summary')}
                        </h2>

                        <div className='flex flex-col gap-4'>
                            {productFullinformation.map((product, index) => {
                                const qty = items[String(product.id)] || 1
                                const subtotal = Number(product.price) * qty
                                return (
                                    <motion.div
                                        key={product.id}
                                        className='flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm'
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                    >
                                        <img
                                            className='w-20 h-24 object-cover rounded-xl bg-gray-50 shrink-0'
                                            src={product.img}
                                            alt={product.title}
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-bold text-gray-900 truncate'>{product.title}</h3>
                                            <p className='text-gray-500 text-sm'>
                                                {product.price} EGP x {qty}
                                            </p>
                                        </div>
                                        <div className='text-right min-w-20'>
                                            <p className='text-orange-600 font-bold'>{subtotal.toFixed(2)} EGP</p>
                                        </div>
                                    </motion.div>
                                )
                            })}

                            {productFullinformation.length === 0 && (
                                <div className='text-center py-10 text-gray-400'>
                                    {t('emptyCart', 'Your cart is empty')}
                                </div>
                            )}
                        </div>

                        {/* Shipping Form */}
                        <div className='mt-8'>
                            <h2 className='text-xl font-bold mb-5 pl-3 border-l-4 border-orange-500' style={{ fontFamily: 'Playfair Display,serif' }}>
                                {t('shippingDetails', 'Shipping Details')}
                            </h2>
                            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                                {/* Full Name */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        {t('fullName', 'Full Name')}
                                    </label>
                                    <input
                                        type='text'
                                        name='fullName'
                                        value={address.fullName}
                                        onChange={handleChange}
                                        className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors'
                                        placeholder={t('fullNamePlaceholder', 'John Doe')}
                                    />
                                </div>

                                {/* Full Address */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        {t('fullAddress', 'Full Address')}
                                    </label>
                                    <textarea
                                        name='street'
                                        value={address.street}
                                        onChange={handleChange}
                                        rows={4}
                                        className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors resize-none'
                                        placeholder={t('fullAddressPlaceholder', 'Enter your full address details (building, floor, apartment, landmark...)')}
                                    />
                                </div>

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('city', 'City')}
                                        </label>
                                        <input
                                            type='text'
                                            name='city'
                                            value={address.city}
                                            onChange={handleChange}
                                            className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors'
                                            placeholder={t('cityPlaceholder', 'Cairo')}
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('phone', 'Phone Number')}
                                        </label>
                                        <input
                                            type='tel'
                                            name='phone'
                                            value={address.phone}
                                            onChange={handleChange}
                                            className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors'
                                            placeholder={t('phonePlaceholder', '01xxxxxxxxx')}
                                        />
                                    </div>
                                </div>


                                {/* when !token is true, it will show the login button to redirect the user to the login page */}
                                {error && (
                                    <div className='text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3'>
                                        {error}
                                        {!token && (
                                            <button
                                                type='button'
                                                onClick={() => navigate('/login')}
                                                className='block mt-2 w-full bg-[#0f1e35] hover:bg-[#1a3a5c] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-1'
                                            >
                                                {t('login', 'Login')}
                                            </button>
                                        )}
                                    </div>
                                )}

                                <button
                                    type='submit'
                                    disabled={loading || productFullinformation.length === 0}
                                    className='w-full bg-[#0f1e35] hover:bg-[#1a3a5c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all hover:-translate-y-1 mt-2'
                                >
                                    {loading ? t('placingOrder', 'Placing Order...') : t('placeOrderBtn', 'Place Order')}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Price Summary */}
                    <motion.div
                        className='lg:col-span-1'
                        variants={fadeUp}
                        initial='hidden'
                        animate='visible'
                        transition={{ delay: 0.1 }}
                    >
                        <div className='lg:sticky lg:top-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
                            <h3 className='font-bold text-lg mb-5 pl-3 border-l-4 border-orange-500' style={{ fontFamily: 'Playfair Display,serif' }}>
                                {t('priceDetails', 'Price Details')}
                            </h3>

                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between items-center text-sm'>
                                    <span className='text-gray-500'>
                                        {t('subtotal', 'Subtotal')} ({itemCount} {itemCount === 1 ? t('item', 'item') : t('items', 'items')})
                                    </span>
                                    <span className='font-semibold text-gray-900'>{totalPrice.toFixed(2)} EGP</span>
                                </div>

                                <div className='flex justify-between items-center text-sm'>
                                    <span className='text-gray-500'>{t('shipping', 'Shipping')}</span>
                                    <span className='font-semibold text-green-600'>{t('free', 'Free')}</span>
                                </div>

                                <div className='border-t border-gray-100 pt-4'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-lg font-bold text-gray-900'>{t('total', 'Total')}</span>
                                        <span className='text-xl font-bold text-orange-600'>{totalPrice.toFixed(2)} EGP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder