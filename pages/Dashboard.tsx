import React, { useState } from 'react';
import Progress from '../components/Progress';
import TaskChart from '../components/TaskChart';
import KanbanBoard from '../components/KanbanBoard';
import { Confetti } from '../components/Confetti';
import { useAppContext } from '../hooks/useAppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';
import { TaskList } from '../components/TaskList';
import { TodaysFocus } from '../components/TodaysFocus';
import { MiniCalendar } from '../components/ui/MiniCalendar';

type ViewMode = 'kanban' | 'list';

// FIX: Removed React.FC to fix framer-motion prop type errors (e.g., for 'initial').
const Dashboard = () => {
    const { tasks } = useAppContext();
    const [viewMode, setViewMode] = useState<ViewMode>('kanban');

    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 md:space-y-8"
        >
            {allTasksCompleted && <Confetti />}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <TodaysFocus />
                <Progress />
                <TaskChart />
                <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border col-span-2 md:col-span-1 flex items-center justify-center">
                    <MiniCalendar />
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">My Tasks</h2>
                    <div className="flex items-center gap-2 p-1 rounded-lg bg-muted/50 border border-border">
                        <button onClick={() => setViewMode('kanban')} className={`px-3 py-1 rounded-md text-sm transition-colors ${viewMode === 'kanban' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                           <LayoutGrid className="w-4 h-4" />
                        </button>
                         <button onClick={() => setViewMode('list')} className={`px-3 py-1 rounded-md text-sm transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                           <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewMode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {viewMode === 'kanban' ? <KanbanBoard /> : <TaskList />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Dashboard;