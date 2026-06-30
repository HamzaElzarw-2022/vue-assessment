import { apiClient } from '@/shared/api/axiosInstance'

export const usersApi = {
  getUser(id) {
    return apiClient.get('/users', { params: { size: 1000 } }).then(res => {
      const user = res.data.items.find(u => u.id === Number(id));
      if (!user) throw new Error('User not found');
      return { data: user };
    });
  },
  getUsers(params) {
    return apiClient.get('/users', { params })
  }
}
