
import { Task, Settings } from '../types';

const TASKS_KEY = 'bolt-ai-tasks';
const SETTINGS_KEY = 'bolt-ai-settings';

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to local storage', error);
  }
};

export const loadTasksFromStorage = (): Task[] | null => {
  try {
    const tasksJson = localStorage.getItem(TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : null;
  } catch (error) {
    console.error('Failed to load tasks from local storage', error);
    return null;
  }
};

export const saveSettingsToStorage = (settings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to local storage', error);
  }
};

export const loadSettingsFromStorage = (): Settings | null => {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    return settingsJson ? JSON.parse(settingsJson) : null;
  } catch (error) {
    console.error('Failed to load settings from local storage', error);
    return null;
  }
};
