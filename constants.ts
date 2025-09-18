import { Task, Priority, Category } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design the homepage UI',
    completed: false,
    priority: Priority.High,
    category: Category.Work,
    status: 'InProgress',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Buy groceries for the week',
    completed: true,
    priority: Priority.Medium,
    category: Category.Shopping,
    status: 'Done',
    dueDate: new Date().toISOString().split('T')[0], // Today
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Schedule a dentist appointment',
    completed: false,
    priority: Priority.Low,
    category: Category.Health,
    status: 'Todo',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
   {
    id: '4',
    title: 'Finish reading "The Pragmatic Programmer"',
    completed: false,
    priority: Priority.Medium,
    category: Category.Personal,
    status: 'Todo',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const PRIORITY_COLORS: Record<Priority, string> = {
    [Priority.High]: 'bg-red-500/20 text-red-400 border-red-500/30',
    [Priority.Medium]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    [Priority.Low]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [Priority.None]: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const PRIORITY_DOT_COLORS: Record<Priority, string> = {
    [Priority.High]: 'bg-red-500',
    [Priority.Medium]: 'bg-yellow-500',
    [Priority.Low]: 'bg-blue-500',
    [Priority.None]: 'bg-gray-500',
};


export const CATEGORY_ICONS: Record<Category, string> = {
    [Category.Work]: '💼',
    [Category.Personal]: '👤',
    [Category.Shopping]: '🛒',
    [Category.Health]: '❤️',
    [Category.Other]: '📁',
};

export const MOCK_ACHIEVEMENTS = {
    '5_COMPLETED': { title: 'Task Master!', description: 'You completed 5 tasks!' },
    '10_COMPLETED': { title: 'Productivity Pro!', description: '10 tasks down, keep it up!' },
    'STREAK_3': { title: 'On a Roll!', description: '3-day task completion streak!' },
};

export const KANBAN_COLUMNS = ['Todo', 'InProgress', 'Done'];
