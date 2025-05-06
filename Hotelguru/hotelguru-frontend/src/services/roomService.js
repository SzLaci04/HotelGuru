import apiService from './apiService';

const roomService = {
  getAllRooms: async () => {
    return await apiService.get('/Szoba');
  },
  
  getRoomById: async (id) => {
    return await apiService.get(`/Szoba/${id}`);
  },
  
  createRoom: async (roomData) => {
    return await apiService.post('/Szoba', roomData);
  },
  
  updateRoom: async (id, roomData) => {
    return await apiService.put(`/Szoba/${id}`, roomData);
  },
  
  deleteRoom: async (id) => {
    return await apiService.delete(`/Szoba/${id}`);
  }
};

export default roomService;