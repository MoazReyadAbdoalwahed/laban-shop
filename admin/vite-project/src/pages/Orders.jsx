import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { toast } from 'react-toastify'

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    shipped: 'bg-purple-100 text-purple-700 border-purple-200',
    delivered: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
}

const Orders = ({ token }) => {
    const { t } = useTranslation()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [expandedOrders, setExpandedOrders] = useState(new Set())
    const [previousOrderCount, setPreviousOrderCount] = useState(0)

    // Play alarm sound for new orders
    const playAlarmSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // Set frequency and duration for notification sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
    }

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${import.meta.env.VITE_API_URL}orders/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const fetchedUsers = res.data.users || []
            const totalOrders = fetchedUsers.flatMap(u => u.orders || []).length

            // Check if new orders were added
            if (previousOrderCount > 0 && totalOrders > previousOrderCount) {
                const newOrderCount = totalOrders - previousOrderCount
                toast.success(`🔔 ${newOrderCount} ${t('newOrders')}!`, {
                    position: 'top-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                })
                playAlarmSound()
            }

            setPreviousOrderCount(totalOrders)
            setUsers(fetchedUsers)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message)
            } else {
                setError(t('failedToFetchOrders'))
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        (async () => {
            await fetchOrders()
        })()
    }, [token])

    const toggleExpand = (orderId) => {
        setExpandedOrders(prev => {
            const next = new Set(prev)
            next.has(orderId) ? next.delete(orderId) : next.add(orderId)
            return next
        })
    }

    const updateStatus = async (userId, orderId, status) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}orders/${orderId}/status`,
                { status, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            // Immediately refetch data to ensure consistency
            await fetchOrders()

            toast.success(`✓ ${t('orderStatus')} ${t(status)}`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
            })
        } catch (error) {
            console.error('Status update error:', error)
            const errorMessage = error?.response?.data?.message || error?.message || t('error')
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000,
            })
        }
    }

    // Flatten all orders from all users with user info attached
    const allOrders = users.flatMap(user =>
        (user.orders || []).map(order => ({ ...order, user }))
    )

    const filtered = allOrders.filter(order => {
        const q = search.toLowerCase()
        const matchSearch =
            search === '' ||
            order.user?.name?.toLowerCase().includes(q) ||
            order.user?.email?.toLowerCase().includes(q) ||
            (order._id && String(order._id).toLowerCase().includes(q)) ||
            (order.address?.city && order.address.city.toLowerCase().includes(q))

        const matchStatus = statusFilter === 'all' || order.status === statusFilter

        return matchSearch && matchStatus
    })

    const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.amount || o.totalAmount || 0), 0)
    const pendingCount = allOrders.filter(o => o.status === 'pending').length
    const deliveredCount = allOrders.filter(o => o.status === 'delivered').length

    if (loading) {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='w-8 h-8 border-4 border-[#0f1e35] border-t-transparent rounded-full animate-spin' />
            </div>
        )
    }

    if (error) {
        return (
            <div className='p-8 text-center text-red-500 bg-red-50 rounded-2xl m-6'>
                <p className='font-semibold'>{t('error')}</p>
                <p className='text-sm mt-1'>{error}</p>
                <button
                    onClick={fetchOrders}
                    className='mt-4 px-4 py-2 bg-[#0f1e35] text-white rounded-xl text-sm hover:bg-[#1a3a5c] transition-colors'
                >
                    {t('back')}
                </button>
            </div>
        )
    }

    return (
        <div className='p-6 max-w-7xl mx-auto'>

            {/* Header */}
            <div className='mb-8'>
                <h1 className='text-2xl font-bold text-gray-900' style={{ fontFamily: 'Playfair Display,serif' }}>
                    {t('orders')}
                </h1>
                <p className='text-gray-500 text-sm mt-1'>{t('orderDetails')}</p>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
                <div className='bg-white rounded-2xl border border-gray-200 p-5 shadow-sm'>
                    <p className='text-sm text-gray-500'>{t('orderId')}</p>
                    <p className='text-3xl font-bold text-gray-900 mt-1'>{allOrders.length}</p>
                </div>
                <div className='bg-white rounded-2xl border border-gray-200 p-5 shadow-sm'>
                    <p className='text-sm text-gray-500'>{t('totalAmount')}</p>
                    <p className='text-3xl font-bold text-orange-600 mt-1'>{totalRevenue.toFixed(2)} EGP</p>
                </div>
                <div className='bg-white rounded-2xl border border-gray-200 p-5 shadow-sm'>
                    <p className='text-sm text-gray-500'>{t('status')} / {t('delivered')}</p>
                    <p className='text-3xl font-bold text-gray-900 mt-1'>
                        <span className='text-yellow-600'>{pendingCount}</span>
                        <span className='text-gray-300 mx-2'>/</span>
                        <span className='text-green-600'>{deliveredCount}</span>
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className='flex flex-col sm:flex-row gap-3 mb-6'>
                <input
                    type='text'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t('searchProducts')}
                    className='flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors'
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className='border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors bg-white'
                >
                    <option value='all'>{t('all')}</option>
                    <option value='pending'>{t('pending')}</option>
                    <option value='processing'>{t('processing')}</option>
                    <option value='shipped'>{t('shipped')}</option>
                    <option value='delivered'>{t('delivered')}</option>
                    <option value='cancelled'>{t('cancelled')}</option>
                </select>
                <button
                    onClick={fetchOrders}
                    className='px-5 py-2.5 bg-[#0f1e35] text-white rounded-xl text-sm hover:bg-[#1a3a5c] transition-colors whitespace-nowrap'
                >
                    ↻ {t('refreshing')}
                </button>
            </div>

            {/* Orders Count */}
            <p className='text-sm text-gray-400 mb-4'>{filtered.length} {t('orders')} {filtered.length !== 1 ? t('items') : t('item')}</p>

            {/* Orders List */}
            {filtered.length === 0 ? (
                <div className='text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200'>
                    <p className='text-4xl mb-3'>📦</p>
                    <p className='font-medium'>{t('noOrdersFound')}</p>
                    <p className='text-sm mt-1'>{t('tryRemovingFilters')}</p>
                </div>
            ) : (
                <div className='flex flex-col gap-4'>
                    {filtered.map((order, idx) => {
                        const idKey = order._id || `${order.user?._id || order.user?.id}-${idx}`;
                        const isExpanded = expandedOrders.has(idKey)
                        const date = new Date(order.date || order.createdAt)
                        return (
                            <div
                                key={idKey}
                                className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'
                            >
                                {/* Order Header */}
                                <div
                                    className='flex flex-wrap items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors'
                                    onClick={() => toggleExpand(idKey)}
                                >
                                    {/* Order ID & Date */}
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-xs text-gray-400 font-mono truncate'>#{order._id || '—'}</p>
                                        <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                                            {order.user?.name || t('customerName')}
                                        </p>
                                        <p className='text-xs text-gray-400'>{order.user?.email}</p>
                                    </div>

                                    {/* Address */}
                                    <div className='hidden sm:block min-w-0'>
                                        <p className='text-xs text-gray-400'>{t('address')}</p>
                                        <p className='text-sm text-gray-700 truncate max-w-[160px]'>
                                            {order.address?.fullName && <span className='font-medium'>{order.address.fullName} — </span>}
                                            {order.address?.city || '—'}
                                        </p>
                                        <p className='text-xs text-gray-400 truncate max-w-[160px]'>{order.address?.phone || ''}</p>
                                    </div>

                                    {/* Items count */}
                                    <div className='text-center'>
                                        <p className='text-xs text-gray-400'>{t('itemsCount')}</p>
                                        <p className='text-sm font-semibold text-gray-900'>
                                            {order.products?.reduce((s, p) => s + (p.quantity || 1), 0) || 0}
                                        </p>
                                    </div>

                                    {/* Amount */}
                                    <div className='text-center'>
                                        <p className='text-xs text-gray-400'>{t('total')}</p>
                                        <p className='text-sm font-bold text-orange-600'>{Number(order.amount || order.totalAmount || 0).toFixed(2)} EGP</p>
                                    </div>

                                    {/* Date */}
                                    <div className='hidden md:block text-center'>
                                        <p className='text-xs text-gray-400'>{t('orderDate')}</p>
                                        <p className='text-sm text-gray-700'>{date.toLocaleDateString()}</p>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                        {t(order.status)}
                                    </span>

                                    {/* Expand Arrow */}
                                    <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className='border-t border-gray-100 px-5 py-4 bg-gray-50'>

                                        {/* Products */}
                                        <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>{t('productDetails')}</p>
                                        <div className='flex flex-col gap-3 mb-5'>
                                            {order.products?.map((product, i) => (
                                                <div key={i} className='flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100'>
                                                    {product.img && (
                                                        <img
                                                            src={product.img}
                                                            alt={product.title}
                                                            className='w-12 h-14 object-cover rounded-lg bg-gray-100 shrink-0'
                                                        />
                                                    )}
                                                    <div className='flex-1 min-w-0'>
                                                        <p className='text-sm font-semibold text-gray-900 truncate'>{product.title}</p>
                                                        <p className='text-xs text-gray-400'>
                                                            {product.price} EGP × {product.quantity || 1}
                                                        </p>
                                                    </div>
                                                    <p className='text-sm font-bold text-orange-600 shrink-0'>
                                                        {(Number(product.price) * (product.quantity || 1)).toFixed(2)} EGP
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Shipping Info */}
                                        <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>Shipping Info</p>
                                        <div className='bg-white rounded-xl border border-gray-100 p-4 text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5'>
                                            <p><span className='text-gray-400'>{t('customerName')}: </span>{order.address?.fullName || '—'}</p>
                                            <p><span className='text-gray-400'>{t('phone')}: </span>{order.address?.phone || '—'}</p>
                                            <p><span className='text-gray-400'>{t('address')}: </span>{order.address?.city || '—'}</p>
                                            <p className='sm:col-span-2'><span className='text-gray-400'>{t('address')}: </span>{order.address?.street || '—'}</p>
                                        </div>

                                        {/* Status Update */}
                                        <div className='flex flex-wrap items-center gap-3'>
                                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>{t('orderStatus')}:</p>
                                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => {
                                                        if (!order._id) {
                                                            toast.error(t('orderIdMissing'))
                                                            console.error('Attempted to update order without _id', order)
                                                            return
                                                        }
                                                        updateStatus(order.user._id, order._id, s)
                                                    }}
                                                    className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${order.status === s
                                                        ? statusColors[s]
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {t(s)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Orders