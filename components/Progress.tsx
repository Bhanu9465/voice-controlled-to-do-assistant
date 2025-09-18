import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { ProgressCircle } from './ui/ProgressCircle';
import { CheckCircle2 } from 'lucide-react';

const Progress: React.FC = () => {
    const { tasks } = useAppContext();
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="bg-card p-6 rounded-lg border border-border col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Today's Progress</h3>
                    <p className="text-sm text-muted-foreground">{completedTasks} of {totalTasks} tasks completed</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{progressPercentage}%</span>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
                <ProgressCircle progress={progressPercentage} />
                <div className="flex-1">
                    {tasks.length > 0 ? (
                        <p className="text-sm text-muted-foreground">
                            {progressPercentage === 100
                                ? "Great job! You've completed all your tasks."
                                : `You're on your way! Keep going.`}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Add some tasks to get started!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Progress;
