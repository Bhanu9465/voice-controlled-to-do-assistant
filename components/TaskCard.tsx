import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { Check, Trash2, Calendar, Tag, Flag } from 'lucide-react';
import { CATEGORY_ICONS, PRIORITY_COLORS, PRIORITY_DOT_COLORS } from '../constants';
import { motion } from 'framer-motion';

interface TaskCardProps {
    task: Task;
}

// FIX: Removed React.FC to fix framer-motion prop type errors (e.g., for 'layout').
export const TaskCard = ({ task }: TaskCardProps) => {
    const { toggleTask, deleteTask, editTask } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleTask(task.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteTask(task.id);
    };

    const handleTitleClick = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTitleBlur = () => {
        if (title.trim() === '') {
            setTitle(task.title); // Reset if empty
        } else if (title.trim() !== task.title) {
            editTask({ ...task, title: title.trim() });
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTitleBlur();
        } else if (e.key === 'Escape') {
            setTitle(task.title);
            setIsEditing(false);
        }
    };
    
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    
    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("taskId", task.id);
        e.currentTarget.style.opacity = '0.5';
    };

    const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
         e.currentTarget.style.opacity = '1';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            draggable="true"
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`p-4 rounded-lg border flex items-start gap-4 transition-all duration-200 cursor-grab active:cursor-grabbing bg-card/60 backdrop-blur-sm ${task.completed ? 'opacity-60' : 'hover:shadow-md'} ${PRIORITY_COLORS[task.priority]}`}
        >
            <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${PRIORITY_DOT_COLORS[task.priority]}`}></div>
            <div className="flex-1">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent p-0 m-0 border-b border-primary outline-none font-medium"
                    />
                ) : (
                    <p onClick={handleTitleClick} className={`font-medium cursor-text ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                )}
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                       <Tag className="w-3 h-3" /> {CATEGORY_ICONS[task.category]} {task.category}
                    </div>
                     <div className="flex items-center gap-1">
                       <Flag className="w-3 h-3" /> {task.priority}
                    </div>
                    {task.dueDate && (
                         <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-semibold' : ''}`}>
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
                 <button 
                    onClick={handleToggle}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-colors ${task.completed ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-muted/50 hover:bg-primary/10'}`}
                    aria-label={task.completed ? 'Mark as not completed' : 'Mark as completed'}
                >
                    <Check className="w-4 h-4" />
                </button>
                <button 
                    onClick={handleDelete}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    aria-label="Delete task"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};