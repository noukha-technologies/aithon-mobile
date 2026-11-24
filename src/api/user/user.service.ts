import api from '@api/interceptor';
import { User } from './user.types';
import { API_ENDPOINTS } from '@constants/api.enums';


const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get(API_ENDPOINTS.USERS);
    // Adjust mapping based on actual API response structure
    return response.data?.data || response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
  },
};

export default userService;
