
export enum Priority {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
    None = 'None',
}

export enum Category {
    Work = 'Work',
    Personal = 'Personal',
    Shopping = 'Shopping',
    Health = 'Health',
    Other = 'Other',
}

export type TaskStatus = 'Todo' | 'InProgress' | 'Done';

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: Priority;
    category: Category;
    status: TaskStatus;
    dueDate?: string; 
    createdAt: string;
}

export type TaskFilter = 'all' | 'today';

export type TaskAction =
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'EDIT_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; newStatus: TaskStatus } }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTER'; payload: TaskFilter };


export type Theme = 'light' | 'dark';

export interface Settings {
    theme: Theme;
    highContrast: boolean;
    fontSize: number;
}

// FIX: Added ParsedCommand interface for Gemini service response. This type was missing.
export interface ParsedCommand {
  action: 'add' | 'delete' | 'complete' | 'move';
  task?: {
    title: string;
    priority?: Priority;
    category?: Category;
    dueDate?: string;
  };
  targetTaskTitle?: string;
  targetStatus?: TaskStatus;
}

// Simplified local command type, replacing the complex AI-based one.
export interface LocalParsedCommand {
    action: 'add' | 'complete' | 'filter' | 'unknown';
    payload?: any;
}