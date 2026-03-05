import React from 'react';
import { Code2 } from 'lucide-react';

const Header = ({ onLogin, onSignUp }) => {
    return (
        <header className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
            <div className="flex items-center space-x-2 text-white">
                <Code2 size={24} className="text-primary" />
                <span className="font-bold text-xl tracking-wide">CollabRoom</span>
            </div>

            <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-400">
                <a href="#features" className="hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                <a href="#docs" className="hover:text-white transition-colors">Docs</a>
            </nav>

            <div className="flex items-center space-x-6 text-sm font-medium">
                <button
                    onClick={onLogin}
                    className="text-gray-300 hover:text-white transition-colors"
                >
                    Log In
                </button>
                <button
                    onClick={onSignUp}
                    className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-full transition-colors font-semibold shadow-lg shadow-blue-500/20"
                >
                    Sign Up
                </button>
            </div>
        </header>
    );
};

export default Header;
