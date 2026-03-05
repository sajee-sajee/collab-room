import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
    const tiers = [
        {
            name: "Hobby",
            price: "$0",
            description: "/ month",
            features: ["Unlimited Public Rooms", "Basic Collaborative IDE", "Community Support"],
            buttonText: "Get Started",
            isPopular: false
        },
        {
            name: "Pro",
            price: "$15",
            description: "/ month",
            features: ["Everything in Hobby", "Private Rooms (Up to 10)", "Shared Terminals & Debugging", "Priority Support"],
            buttonText: "Go Pro",
            isPopular: true
        },
        {
            name: "Enterprise",
            price: "$49",
            description: "/ month",
            features: ["SSO Authentication", "Advanced Security Logs", "Custom Onboarding", "Dedicated Account Manager"],
            buttonText: "Contact Sales",
            isPopular: false
        }
    ];

    return (
        <section id="pricing" className="py-24 px-4 max-w-7xl mx-auto w-full">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                <p className="text-gray-400">Scale from solo projects to enterprise teams.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {tiers.map((tier, index) => (
                    <div
                        key={index}
                        className={`bg-surface relative p-8 rounded-2xl border ${tier.isPopular ? 'border-primary ring-1 ring-primary/50' : 'border-gray-800'} flex flex-col`}
                    >
                        {tier.isPopular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                MOST POPULAR
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-300 mb-2">{tier.name}</h3>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-4xl font-bold text-white">{tier.price}</span>
                                <span className="text-gray-500 text-sm">{tier.description}</span>
                            </div>
                        </div>

                        <button
                            className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors mb-8 ${tier.isPopular ? 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-blue-500/20' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                        >
                            {tier.buttonText}
                        </button>

                        <div className="space-y-4 flex-1">
                            {tier.features.map((feature, fIndex) => (
                                <div key={fIndex} className="flex items-start space-x-3 text-sm text-gray-400">
                                    <Check size={18} className="text-primary shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Pricing;
