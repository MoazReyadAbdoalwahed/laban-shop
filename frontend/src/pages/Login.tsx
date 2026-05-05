import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { thunkAuthLogin } from '../store/auth/thunk/ThunkGetAuth';
import { thunkAuthRegister } from '../store/auth/thunk/ThunkGetRegister';

const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeClosed = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

function Login() {
    const [currentState, setCurrentState] = useState("Login");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { token, user, loading, error } = useAppSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Show error toast when auth fails
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const onSubmitHandler = async (data: Record<string, string>) => {
        if (currentState === 'SignUp') {
            const nameParts = data.name?.trim().split(' ') || ['', ''];
            const registerData = {
                email: data.email,
                password: data.password,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
            };
            console.log('Registering with data:', registerData);
            const resultAction = await dispatch(thunkAuthRegister(registerData));
            if (thunkAuthRegister.fulfilled.match(resultAction)) {
                toast.success('Account created! Please sign in.');
                reset();
                // ── SignUp success → redirect to Login page ──
                setCurrentState('Login') // ✅ switch to Login tab
            }

        } else {
            const resultAction = await dispatch(thunkAuthLogin({
                email: data.email,
                password: data.password,
            }));

            if (thunkAuthLogin.fulfilled.match(resultAction)) {
                const { token: authToken, user } = resultAction.payload;

                if (rememberMe) {
                    localStorage.setItem('token', authToken);
                    localStorage.setItem('user', JSON.stringify(user));
                } else {
                    sessionStorage.setItem('token', authToken);
                    sessionStorage.setItem('user', JSON.stringify(user));
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }

                toast.success('Welcome back!');
                // ── Login success → redirect to Home page ──
                navigate('/');
            }
        }
    };

    // const handleGoogleLogin = () => toast.info("Google login coming soon!");
    // const handleFacebookLogin = () => toast.info("Facebook login coming soon!");

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}auth/google`
    }

    const handleFacebookLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}auth/facebook`
    }

    const toggleState = () => {
        setCurrentState(currentState === 'Login' ? 'SignUp' : 'Login');
        reset();
        setShowPassword(false)
    };

    const isLoading = loading === 'pending';

    // ── If already logged in, show profile card ───────────────
    if (token && user) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-10 text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-orange-500">
                            {user.firstName?.charAt(0).toUpperCase() ?? '?'}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 mb-8">{user.email}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-10"
            >
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {currentState === 'Login' ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {currentState === 'Login'
                            ? 'Sign in to your account to continue'
                            : 'Join us today — it only takes a minute'}
                    </p>
                </div>

                {/* Social Buttons */}
                <div className="flex gap-3 mb-6">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                        <GoogleIcon />
                        Google
                    </button>
                    <button
                        type="button"
                        onClick={handleFacebookLogin}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                        <FacebookIcon />
                        Facebook
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-4">

                    <AnimatePresence>
                        {currentState === 'SignUp' && (
                            <motion.div
                                key="name"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                            >
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    placeholder="John Doe"
                                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Email Address
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                            })}
                            placeholder="you@example.com"
                            className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "At least 6 characters" }
                                })}
                                placeholder="••••••••"
                                className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeClosed /> : <EyeOpen />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>
                        )}
                    </div>

                    {/* Remember Me + Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <div
                                onClick={() => setRememberMe(!rememberMe)}
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${rememberMe ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'}`}
                            >
                                {rememberMe && (
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm text-gray-600">Remember me</span>
                        </label>

                        {currentState === 'Login' && (
                            <button
                                type="button"
                                className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                            >
                                Forgot password?
                            </button>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm mt-2 hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                {currentState === 'SignUp' ? 'Creating account...' : 'Signing in...'}
                            </>
                        ) : (
                            currentState === 'SignUp' ? 'Create Account' : 'Sign In'
                        )}
                    </button>
                </form>

                {/* Toggle state */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    {currentState === 'Login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={toggleState}
                        className="text-black font-semibold hover:text-orange-500 transition-colors"
                    >
                        {currentState === 'Login' ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}

export default Login;
