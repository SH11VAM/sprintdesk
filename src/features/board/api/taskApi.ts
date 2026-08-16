import { apiClient } from '@/services/apiClient';
import { RawJsonPlaceholderTodo, Task } from '../types';
import { adaptJsonPlaceholderTasks } from '../utils/taskAdapter';

const DATA_URL = import.meta.env.VITE_DATA_API_URL || 'https://jsonplaceholder.typicode.com';

export const taskApi = {
  async fetchInitialTasks(): Promise<Task[]> {
    const rawTodos = await apiClient.get<RawJsonPlaceholderTodo[]>(`${DATA_URL}/todos?_limit=30`);
    return adaptJsonPlaceholderTasks(rawTodos);
  },
};
