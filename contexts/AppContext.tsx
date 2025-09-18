import React, { createContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { Task, Settings, Theme, TaskAction, TaskStatus, TaskFilter } from '../types';
import { INITIAL_TASKS } from '../constants';
import { loadTasksFromStorage, saveTasksToStorage, loadSettingsFromStorage, saveSettingsToStorage } from '../utils/localStorage';

interface AppState {
  tasks: Task[];
  settings: Settings;
  achievement: { title: string; description: string; } | null;
  searchTerm: string;
  filter: TaskFilter;
}

interface AppContextProps extends AppState {
  dispatch: React.Dispatch<TaskAction>;
  setTheme: (theme: Theme) => void;
  showAchievement: (achievement: { title: string; description: string; }) => void;
  hideAchievement: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  editTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  setSearchTerm: (term: string) => void;
  setFilter: (filter: TaskFilter) => void;
}

const defaultSettings: Settings = {
  theme: 'dark',
  highContrast: false,
  fontSize: 16,
};

const initialState: AppState = {
  tasks: [],
  settings: defaultSettings,
  achievement: null,
  searchTerm: '',
  filter: 'all',
};

const appReducer = (state: AppState, action: TaskAction): AppState => {
  switch (action.type) {
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'EDIT_TASK':
      return { ...state, tasks: state.tasks.map(task => (task.id === action.payload.id ? action.payload : task)) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'TOGGLE_TASK':
      return { ...state, tasks: state.tasks.map(task =>
        task.id === action.payload ? { ...task, completed: !task.completed, status: !task.completed ? 'Done' : 'Todo' } : task
      )};
    case 'UPDATE_TASK_STATUS':
      return { ...state, tasks: state.tasks.map(task =>
        task.id === action.payload.taskId ? { ...task, status: action.payload.newStatus } : task
      )};
    case 'SET_SEARCH_TERM':
        return { ...state, searchTerm: action.payload };
    case 'SET_FILTER':
        return { ...state, filter: action.payload };
    default:
      return state;
  }
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [settings, setSettings] = React.useState<Settings>(() => loadSettingsFromStorage() || defaultSettings);
  const [achievement, setAchievement] = React.useState<{title: string, description: string} | null>(null);

  useEffect(() => {
    const storedTasks = loadTasksFromStorage();
    dispatch({ type: 'LOAD_TASKS', payload: storedTasks || INITIAL_TASKS });
  }, []);

  useEffect(() => {
    if (state.tasks.length > 0) {
      saveTasksToStorage(state.tasks);
    }
  }, [state.tasks]);

  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  const setTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const showAchievement = (ach: { title: string; description: string; }) => {
    setAchievement(ach);
  };
  
  const hideAchievement = () => {
    setAchievement(null);
  };

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  }, []);

  const editTask = useCallback((task: Task) => {
    dispatch({ type: 'EDIT_TASK', payload: task });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  }, []);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, newStatus }});
  }, []);

  const setSearchTerm = useCallback((term: string) => {
      dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const setFilter = useCallback((filter: TaskFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  return (
    <AppContext.Provider value={{ ...state, settings, achievement, dispatch, setTheme, showAchievement, hideAchievement, addTask, editTask, deleteTask, toggleTask, updateTaskStatus, setSearchTerm, setFilter }}>
      {children}
    </AppContext.Provider>
  );
};