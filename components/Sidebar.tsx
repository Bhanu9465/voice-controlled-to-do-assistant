import React from 'react';
import { LayoutDashboard, Settings, LifeBuoy, LogOut, PlusCircle, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { Category, Priority, Task } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

// FIX: Removed React.FC to fix framer-motion prop type errors (e.g., for 'initial').
const NavItem = ({ icon, label, count, active, isSidebarOpen }: { icon: React.ReactNode; label: string; count?: number; active?: boolean; isSidebarOpen: boolean;}) => (
    <a href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm ${active ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}>
        {icon}
        <AnimatePresence>
            {isSidebarOpen && <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2}} className="whitespace-nowrap flex-1">{label}</motion.span>}
        </AnimatePresence>
        {isSidebarOpen && count !== undefined && (
             <span className="ml-auto text-xs font-mono bg-muted-foreground/20 rounded-full px-2 py-0.5">
                {count}
            </span>
        )}
    </a>
);


// FIX: Removed React.FC to fix framer-motion prop type errors (e.g., for 'variants').
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
    const { tasks, addTask } = useAppContext();
    const categories = Object.values(Category);

    const handleAddTask = () => {
        const newTask: Omit<Task, 'id' | 'createdAt' | 'completed'> = {
            title: 'New Task',
            priority: Priority.None,
            category: Category.Other,
            status: 'Todo',
        };
        addTask(newTask);
    };

    const sidebarVariants = {
        open: { width: 288, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { width: 80, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };
    
    const mobileSidebarVariants = {
        open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };


    const SidebarContent = () => (
        <>
            <div className="h-16 flex items-center px-6 border-b border-border flex-shrink-0 justify-between">
                <div className={`flex items-center gap-2 overflow-hidden ${isSidebarOpen ? '' : 'w-0'}`}>
                    <svg className="w-6 h-6 text-primary flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    <AnimatePresence>
                        {isSidebarOpen && <motion.h1 initial={{ opacity:0 }} animate={{opacity: 1}} exit={{opacity: 0}} className="text-lg font-bold whitespace-nowrap">Bolt AI</motion.h1>}
                    </AnimatePresence>
                </div>
                 <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-muted hidden md:block">
                   {isSidebarOpen ? <ChevronsLeft className="w-5 h-5" /> : <ChevronsRight className="w-5 h-5" />}
                </button>
                 <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-muted md:hidden">
                   <X className="w-5 h-5" />
                </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
                 <div>
                    <h2 className={`px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ${isSidebarOpen ? '' : 'text-center'}`}>{isSidebarOpen ? 'Main' : '...'}</h2>
                     <NavItem icon={<LayoutDashboard className="w-5 h-5 flex-shrink-0" />} label="Dashboard" active={true} isSidebarOpen={isSidebarOpen} />
                 </div>
                 <div>
                    <h2 className={`px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ${isSidebarOpen ? '' : 'text-center'}`}>{isSidebarOpen ? 'Categories' : '...'}</h2>
                    {categories.map(category => (
                         <NavItem 
                            key={category} 
                            icon={<span className="text-lg">{CATEGORY_ICONS[category]}</span>} 
                            label={category} 
                            count={tasks.filter(t => t.category === category).length}
                            isSidebarOpen={isSidebarOpen}
                        />
                    ))}
                </div>
            </nav>
            <div className="mt-auto p-4 border-t border-border flex-shrink-0">
                <button 
                    onClick={handleAddTask}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors bg-primary text-primary-foreground hover:bg-primary/90 ${isSidebarOpen ? '' : 'justify-center'}`}
                >
                    <PlusCircle className="w-5 h-5 flex-shrink-0"/>
                    {isSidebarOpen && <span className="whitespace-nowrap">Add New Task</span>}
                </button>
                 <div className="mt-4 space-y-1">
                    <NavItem icon={<Settings className="w-5 h-5 flex-shrink-0" />} label="Settings" isSidebarOpen={isSidebarOpen} />
                    <NavItem icon={<LifeBuoy className="w-5 h-5 flex-shrink-0" />} label="Help & Support" isSidebarOpen={isSidebarOpen} />
                    <NavItem icon={<LogOut className="w-5 h-5 flex-shrink-0" />} label="Logout" isSidebarOpen={isSidebarOpen} />
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <AnimatePresence>
            {isSidebarOpen && (
                 <motion.div
                    key="mobile-sidebar"
                    variants={mobileSidebarVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="fixed inset-y-0 left-0 w-72 border-r border-border bg-card/80 backdrop-blur-lg flex flex-col z-50 md:hidden"
                >
                    <SidebarContent />
                </motion.div>
            )}
            </AnimatePresence>
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden" />}

            {/* Desktop Sidebar */}
            <motion.aside
                key="desktop-sidebar"
                variants={sidebarVariants}
                animate={isSidebarOpen ? "open" : "closed"}
                className="hidden md:flex flex-shrink-0 bg-card/50 backdrop-blur-sm flex-col z-30"
            >
                <SidebarContent />
            </motion.aside>
        </>
    );
};

export default Sidebar;