import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { setToken, setUser } from '../store/auth/AuthSlice'

const OAuthCallback = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        const userRaw = params.get('user')

        if (token && userRaw) {
            const user = JSON.parse(userRaw)
            dispatch(setToken(token))
            dispatch(setUser(user))
            localStorage.setItem('token', token)
            localStorage.setItem('user', userRaw)
            navigate('/')  // ✅ redirect to Store home
        } else {
            navigate('/login')
        }
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <svg className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-gray-500 text-sm">Signing you in...</p>
            </div>
        </div>
    )
}

export default OAuthCallback