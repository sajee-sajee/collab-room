import React, { useState } from 'react';
import { X, Github, Mail, Lock } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, defaultIsLogin = true }) => {
    const [isLogin, setIsLogin] = useState(defaultIsLogin);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {isLogin ? 'Welcome Back' : 'Create an Account'}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {isLogin ? 'Sign in to your collaborative workspace' : 'Join thousands of developers coding together'}
                        </p>
                    </div>

                    {/* Toggle */}
                    <div className="flex bg-gray-900 rounded-lg p-1 mb-8">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isLogin ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isLogin ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-4 pr-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600 text-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={16} className="text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600 text-sm"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">Password</label>
                                {isLogin && <a href="#" className="text-xs text-primary hover:text-blue-400">Forgot password?</a>}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={16} className="text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600 font-sans text-sm tracking-widest"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center space-x-2 pt-1">
                                <input type="checkbox" id="remember" className="rounded bg-gray-900 border-gray-700 text-primary focus:ring-primary/50 w-4 h-4 cursor-pointer" />
                                <label htmlFor="remember" className="text-xs text-gray-400 cursor-pointer">Stay logged in for 30 days</label>
                            </div>
                        )}

                        <button
                            type="button"
                            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all mt-6"
                            onClick={() => {
                                // Simulate login and redirect to dashboard
                                onClose();
                                window.location.href = '/dashboard';
                            }}
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-surface px-2 text-gray-500 uppercase tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center space-x-2 bg-gray-950 border border-gray-800 hover:bg-gray-800 text-white py-2.5 rounded-lg transition-colors text-sm font-medium">
                            <Github size={18} />
                            <span>GitHub</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 bg-gray-950 border border-gray-800 hover:bg-gray-800 text-white py-2.5 rounded-lg transition-colors text-sm font-medium">
                            {/* Simple Google G SVG */}
                            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Google</span>
                        </button>
                    </div>

                    <div className="mt-8 flex justify-center space-x-4 text-xs text-gray-500">
                        <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300">Terms of Service</a>
                        <a href="#" className="hover:text-gray-300">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
