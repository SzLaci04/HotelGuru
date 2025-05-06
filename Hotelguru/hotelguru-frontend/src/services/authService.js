import apiService from './apiService';

const authService = {
  login: async (email, jelszo) => {
    try {
      const response = await apiService.post('/Felhasznalo/bejelentkez', { email, jelszo });
      
      // JWT token és felhasználói adatok mentése
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          email: response.email,
          nev: response.nev,
          szerep: response.szerep
        }));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      return await apiService.post('/Felhasznalo/regisztral', userData);
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.szerep === 'admin';
  },
  
  isReceptionist: () => {
    const user = authService.getCurrentUser();
    return user && user.szerep === 'recepciós';
  }
};

export default authService;