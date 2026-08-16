import { apiClient } from '@/services/apiClient';
import { RawJsonPlaceholderPost } from '../types';

const DATA_URL = import.meta.env.VITE_DATA_API_URL || 'https://jsonplaceholder.typicode.com';

export const notificationApi = {
  async fetchLatestPosts(): Promise<RawJsonPlaceholderPost[]> {
    return apiClient.get<RawJsonPlaceholderPost[]>(`${DATA_URL}/posts?_limit=5`);
  },
};
