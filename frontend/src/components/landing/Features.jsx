import React from 'react';
import { TerminalSquare, ListTodo, MessageSquare } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <TerminalSquare className="text-primary" size={24} />,
            title: "Real-time IDE",
            description: "Edit code simultaneously with ultra low-latency syncing, intelligent syntax highlighting, and shared IntelliSense."
        },
        {
            icon: <ListTodo className="text-primary" size={24} />,
            title: "Task Management",
            description: "Keep track of sprints, issues, and pull requests without ever leaving your shared development environment."
        },
        {
            icon: <MessageSquare className="text-primary" size={24} />,
            title: "Integrated Chat",
            description: "Communicate with your team via high-fidelity spatial voice channels and persistent rich-text chat threads."
        }
    ];

    return (
        <section id="features" className="py-24 px-4 max-w-7xl mx-auto w-full">
            <div className="mb-16 max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Powerful Features for<br />Seamless Collaboration
                </h2>
                <p className="text-gray-400 text-lg">
                    Everything you need to build great software together in one place.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-surface p-8 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
