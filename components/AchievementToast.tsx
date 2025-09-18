import React, { useEffect } from 'react';
// FIX: Replaced useTaskStore with useAppContext to use React Context for state management.
import { useAppContext } from '../hooks/useAppContext';

export const AchievementToast: React.FC = () => {
    const { achievement, hideAchievement } = useAppContext();

    useEffect(() => {
        if (achievement) {
            const timer = setTimeout(() => {
                hideAchievement();
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [achievement, hideAchievement]);

    if (!achievement) return null;

    return (
        <div className="fixed top-20 right-5 border border-primary/50 shadow-lg rounded-lg p-4 max-w-sm w-full animate-accordion-down z-[100] backdrop-blur-sm bg-card/60">
            <div className="flex items-start space-x-3">
                 <div className="text-2xl pt-1">🏆</div>
                <div>
                    <h4 className="font-bold text-primary">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
            </div>
        </div>
    );
};
