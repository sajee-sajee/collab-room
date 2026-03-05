import React from 'react';
import { CheckCircle2, MessageSquare, AlertTriangle, UserPlus } from 'lucide-react';

const ActivityFeed = () => {
    const activities = [
        {
            type: 'completed',
            icon: <CheckCircle2 size={16} className="text-blue-400" />,
            bg: 'bg-blue-500/10',
            title: "Task Completed",
            description: "Alex merged PR #102 into Frontend...",
            time: "2 minutes ago"
        },
        {
            type: 'message',
            icon: <MessageSquare size={16} className="text-green-400" />,
            bg: 'bg-green-500/10',
            title: "New Message",
            description: 'Sarah: "The login bug is finally fixed!"',
            time: "15 minutes ago"
        },
        {
            type: 'alert',
            icon: <AlertTriangle size={16} className="text-orange-400" />,
            bg: 'bg-orange-500/10',
            title: "Deployment Failed",
            description: "Staging build failed for API Integration",
            time: "1 hour ago"
        },
        {
            type: 'user',
            icon: <UserPlus size={16} className="text-brand-purple" />,
            bg: 'bg-brand-purple/10',
            title: "New Member Joined",
            description: "Jordan joined the CollabRoom team",
            time: "3 hours ago"
        }
    ];

    return (
        <aside className="w-80 bg-background border-l border-gray-800 hidden xl:flex flex-col h-full shrink-0">
            <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-1">Recent Activity</h3>
                <p className="text-xs text-gray-500 font-medium mb-8">Latest updates across your workspace</p>

                <div className="space-y-6">
                    {activities.map((activity, idx) => (
                        <div key={idx} className="flex items-start space-x-4">
                            <div className={`w-8 h-8 rounded-full ${activity.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                {activity.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-200 mb-0.5">{activity.title}</h4>
                                <p className="text-xs text-gray-500 leading-snug mb-1">{activity.description}</p>
                                <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">{activity.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                    <button className="text-primary hover:text-blue-400 text-sm font-bold transition-colors">
                        View All Activity
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default ActivityFeed;
