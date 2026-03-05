import React from 'react';

const CTA = ({ onCreateRoom }) => {
    return (
        <section className="py-24 px-4 w-full">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary to-brand-purple rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                    Ready to start collaborating?
                </h2>
                <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                    Join over 50,000 developers coding together. No setup required, just your browser and your team.
                </p>
                <button
                    onClick={onCreateRoom}
                    className="bg-white text-primary hover:bg-gray-50 px-8 py-3.5 rounded-lg font-bold transition-colors relative z-10 shadow-xl"
                >
                    Create Your First Room
                </button>
            </div>

            <footer className="mt-20 max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <span className="font-bold text-gray-300">CollabRoom</span>
                </div>
                <div>
                    © 2026 CollabRoom Inc. All rights reserved. Built with passion for developers.
                </div>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-gray-300">Twitter</a>
                    <a href="#" className="hover:text-gray-300">GitHub</a>
                </div>
            </footer>
        </section>
    );
};

export default CTA;
