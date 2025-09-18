import React, { useState, useEffect } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useAppContext } from '../hooks/useAppContext';
import { speak } from '../utils/speech';
import { Category, ParsedCommand, Priority } from '../types';

const VoiceControlButton: React.FC = () => {
    const [statusMessage, setStatusMessage] = useState('Click to speak');
    const [isProcessing, setIsProcessing] = useState(false);
    const { tasks, addTask, toggleTask, deleteTask, updateTaskStatus } = useAppContext();

    const handleCommand = (command: ParsedCommand | null) => {
        setIsProcessing(true);
        setStatusMessage('Processing...');

        if (!command) {
            speak("Sorry, I had trouble understanding that. Please try again.");
            setTimeout(() => setIsProcessing(false), 1000);
            return;
        }

        switch (command.action) {
            case 'add':
                if (command.task?.title) {
                    addTask({
                        title: command.task.title,
                        priority: command.task.priority || Priority.None,
                        category: command.task.category || Category.Other,
                        status: 'Todo',
                        dueDate: command.task.dueDate,
                    });
                    speak(`Okay, I've added "${command.task.title}".`);
                } else {
                    speak("Sorry, I didn't catch the task name.");
                }
                break;
            case 'complete':
                if (command.targetTaskTitle) {
                    const taskToComplete = tasks.find(t => t.title.toLowerCase() === command.targetTaskTitle!.toLowerCase());
                     if (taskToComplete) {
                        if (!taskToComplete.completed) {
                            toggleTask(taskToComplete.id);
                        }
                        speak(`Great job! I've marked "${taskToComplete.title}" as complete.`);
                    } else {
                        speak(`Sorry, I couldn't find the task "${command.targetTaskTitle}".`);
                    }
                } else {
                    speak("Sorry, I couldn't find that task to complete.");
                }
                break;
            case 'delete':
                if (command.targetTaskTitle) {
                    const taskToDelete = tasks.find(t => t.title.toLowerCase() === command.targetTaskTitle!.toLowerCase());
                     if (taskToDelete) {
                        deleteTask(taskToDelete.id);
                        speak(`I've deleted "${taskToDelete.title}".`);
                    } else {
                        speak(`Sorry, I couldn't find the task "${command.targetTaskTitle}".`);
                    }
                } else {
                    speak("Sorry, I couldn't find that task to delete.");
                }
                break;
            case 'move':
                if (command.targetTaskTitle && command.targetStatus) {
                    const taskToMove = tasks.find(t => t.title.toLowerCase() === command.targetTaskTitle!.toLowerCase());
                     if (taskToMove) {
                        updateTaskStatus(taskToMove.id, command.targetStatus);
                        speak(`Okay, I moved "${taskToMove.title}" to ${command.targetStatus}.`);
                    } else {
                        speak(`Sorry, I couldn't find the task "${command.targetTaskTitle}".`);
                    }
                } else {
                    speak("I didn't get enough information to move the task.");
                }
                break;
            default:
                speak("I didn't quite catch that. Please try again.");
                break;
        }
        
        // Use a short timeout to allow the 'Processing' message to be visible
        setTimeout(() => setIsProcessing(false), 1000);
    };

    const { isListening, startListening, stopListening, error, isSupported, interimTranscript } = useVoiceAssistant({
        onCommand: handleCommand,
        tasks: tasks,
    });
    
    useEffect(() => {
        if (isListening) {
            setStatusMessage('Listening...');
        } else if (isProcessing) {
             setStatusMessage('Processing...');
        } else if (interimTranscript) {
             setStatusMessage(`"${interimTranscript}"`);
        } else {
            setStatusMessage('Click to speak');
        }
    }, [isListening, isProcessing, interimTranscript]);
    
    useEffect(() => {
        if (error) {
            setStatusMessage(error);
        }
    }, [error]);

    if (!isSupported) {
        return (
            <div className="items-center gap-3 hidden md:flex">
                <span className="text-sm text-destructive italic">Voice not supported</span>
            </div>
        );
    }
    
    const handleClick = () => {
        if (isListening) {
            stopListening();
        } else if (!isProcessing) {
            startListening();
        }
    };

    return (
        <div className="items-center gap-3 hidden md:flex">
             <span className="text-sm text-muted-foreground italic min-w-[120px] text-right transition-all duration-300">{statusMessage}</span>
            <button
                onClick={handleClick}
                disabled={isProcessing}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-white relative ${
                    isListening ? 'bg-red-500' : 'bg-primary hover:bg-primary/90'
                } ${isProcessing ? 'bg-muted-foreground cursor-not-allowed' : ''}`}
                aria-label={isListening ? 'Stop listening' : 'Start voice command'}
            >
                {isListening && <span className="animate-glow absolute inset-0 rounded-full" />}
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
            </button>
        </div>
    );
};

export default VoiceControlButton;
