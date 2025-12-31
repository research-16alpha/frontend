import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../bag/contexts/AppContext';
import { loginWithGoogle } from '../api/auth';
import { useNavigation } from '../../../shared/contexts/NavigationContext';

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useApp();
  const { navigateToAccount } = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      setFormData({ name: '', email: '', password: '' });
      setIsAuthModalOpen(false);
      // Navigate to account page after successful login/register
      navigateToAccount();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setFormData({ name: '', email: '', password: '' });
    setShowPassword(false);
    setError(null);
    setIsLoading(false);
    setFocusedField(null);
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white shadow-2xl w-full max-w-md pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between py-2 sm:py-6 px-4 sm:px-6 border-b">
                <h2 className="text-2xl font-headline">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:opacity-70 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-8 h-8" strokeWidth={1} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-1 sm:space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-body">
                    {error}
                  </div>
                )}
                {!isLogin && (
                  <div className="relative">
                    <motion.label
                      htmlFor="name"
                      initial={false}
                      animate={{
                        y: focusedField === 'name' || formData.name ? 5 : 20,
                      }}
                      transition={{ duration: 0.2 }}
                      className={`absolute left-0 top-6 pointer-events-none font-body ${
                        focusedField === 'name' || formData.name
                          ? 'text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg'
                          : 'text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl'
                      }`}
                    >
                      Name
                    </motion.label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pt-6 pb-3 border-0 border-b border-black rounded-none focus:outline-none focus:border-black font-body bg-transparent"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="relative">
                  <motion.label
                    htmlFor="email"
                    initial={false}
                    animate={{
                      y: focusedField === 'email' || formData.email ? 5 : 20,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-0 top-6 pointer-events-none font-body ${
                      focusedField === 'email' || formData.email
                        ? 'text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg'
                        : 'text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl'
                    }`}
                  >
                    Email
                  </motion.label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pt-6 pb-3 border-0 border-b border-black rounded-none focus:outline-none focus:border-black font-body bg-transparent"
                    required
                  />
                </div>

                <div className="relative">
                  <motion.label
                    htmlFor="password"
                    initial={false}
                    animate={{
                      y: focusedField === 'password' || formData.password ? 5 : 20,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-0 top-6 pointer-events-none font-body ${
                      focusedField === 'password' || formData.password
                        ? 'text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg'
                        : 'text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl'
                    }`}
                  >
                    Password
                  </motion.label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pt-6 pb-3 pr-12 border-0 border-b border-black rounded-none focus:outline-none focus:border-black font-body bg-transparent"
                    required
                  />
                  {(focusedField === 'password' || formData.password) && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between text-xs sm:text-sm md:text-base lg:text-lg">
                    <label className="flex items-center gap-2 cursor-pointer font-body">
                      <input type="checkbox" className="rounded cursor-pointer appearance-none border border-gray-300 checked:bg-black checked:border-black" />
                      <span className="text-gray-600 font-body text-xs sm:text-sm md:text-base lg:text-lg">Remember Me</span>
                    </label>
                    <button
                      type="button"
                      className="text-gray-600 hover:text-black transition-colors font-body cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-2 sm:py-3 mt-4 sm:mt-6 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body"
                >
                  {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>

                {/* <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-body">Or continue with</span>
                  </div>
                </div> */}

                {/* Social Login */}
                {/* <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      loginWithGoogle();
                    }}
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-body"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-body"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                    </svg>
                    Facebook
                  </button>
                </div> */}

                {/* Toggle between Login and Register */}
                <div className="text-center text-sm text-gray-600 font-body">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-black hover:underline text-smfont-body"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
