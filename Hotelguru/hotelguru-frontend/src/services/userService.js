import apiService from './apiService';

const userService = {
  getAllUsers: async () => {
    return await apiService.get('/Felhasznalo');
  },
  
  getUserById: async (id) => {
    return await apiService.get(`/Felhasznalo/${id}`);
  },
  
  updateUser: async (id, userData) => {
    return await apiService.put(`/Felhasznalo/${id}`, userData);
  },
  
  deleteUser: async (id) => {
    return await apiService.delete(`/Felhasznalo/${id}`);
  }
};

export default userService;