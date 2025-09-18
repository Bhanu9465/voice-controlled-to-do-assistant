import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Priority } from '../types';
import { TaskCard } from './TaskCard';
import { Star } from 'lucide-react';

export const TodaysFocus: React.FC = () => {
    const { tasks } = useAppContext();
    
    const today = new Date().toISOString().split('T')[0];
    
    const focusTasks = tasks.filter(task => 
        !task.completed && (task.dueDate === today || task.priority === Priority.High)
    ).slice(0, 3); // Show up to 3 focus tasks

    return (
        <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border col-span-2">
            <div className="flex items-center gap-2 mb-4">
                 <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold">Today's Focus</h3>
            </div>
            {focusTasks.length > 0 ? (
                <div className="space-y-3">
                    {focusTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg border-border h-full flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No urgent tasks. Relax!</p>
                </div>
            )}
        </div>
    );
};