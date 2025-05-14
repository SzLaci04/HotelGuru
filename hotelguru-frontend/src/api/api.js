import axios from 'axios';

// Közvetlen URL a backendhez
const API_URL = 'http://localhost:5079';

// Axios alapkonfiguráció
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Timeout beállítása (10 másodperc)
  timeout: 10000
});

// Token hozzáadása minden kéréshez, ha létezik
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API metódusok
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/Felhasznalo/bejelentkez', credentials);
    return response.data;
  } catch (error) {
    console.error('Login hiba:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Sikertelen bejelentkezés');
  }
};

export const registerUser = async (userData) => {
  try {
    console.log('Regisztrációs adatok küldése:', userData);
    const response = await api.post('/api/Felhasznalo/regisztral', userData);
    return response.data;
  } catch (error) {
    console.error('Regisztrációs hiba:', error);
    if (error.response) {
      console.error('Szerver válasz:', error.response.data);
      console.error('Állapotkód:', error.response.status);
    }
    throw error.response ? error.response.data : new Error('Sikertelen regisztráció');
  }
};

export const getAllRooms = async () => {
  try {
    const response = await api.get('/api/Szoba');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Nem sikerült lekérni a szobákat');
  }
};

export const getAvailableRooms = async () => {
  try {
    const response = await api.get('/api/Szoba/available');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Nem sikerült lekérni az elérhető szobákat');
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/api/Foglalas', bookingData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Sikertelen foglalás');
  }
};

export const getAllBookings = async () => {
  try {
    const response = await api.get('/api/Foglalas');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Nem sikerült lekérni a foglalásokat');
  }
};

export const cancelBooking = async (id) => {
  try {
    const response = await api.delete(`/api/Foglalas/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Nem sikerült lemondani a foglalást');
  }
};

export const getPluszSzolgaltatasok = async () => {
  try {
    const response = await api.get('/api/Szoba/pluszszolg');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Nem sikerült lekérni a plusz szolgáltatásokat');
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/api/Szoba/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error(`Nem sikerült lekérni a szobát (ID: ${id})`);
  }
};

export const getMyBookings = async () => {
  try {
    const response = await api.get('/api/Foglalas/SajatFoglalas');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Nem sikerült lekérni a foglalásokat');
  }
};

export const getInvoices = async () => {
  try {
    const response = await api.get('/api/Felhasznalo/sajatSzamlak');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Nem sikerült lekérni a számlákat');
  }
};