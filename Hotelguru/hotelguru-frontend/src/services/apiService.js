const API_URL = 'https://localhost:5079/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Automatikus kijelentkeztetés, ha a token érvénytelen
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    try {
      const error = await response.json();
      throw new Error(error.message || 'Valami hiba történt');
    } catch (e) {
      // Ha a response nem tartalmaz JSON-t
      throw new Error(`HTTP hiba: ${response.status}`);
    }
  }
  
  try {
    return await response.json();
  } catch (e) {
    // Üres válasz esetén
    return {};
  }
};

const apiService = {
  get: async (url) => {
    try {
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        // Credentials mode a CORS-hoz
        credentials: 'include'
      };
      
      const response = await fetch(`${API_URL}${url}`, requestOptions);
      return handleResponse(response);
    } catch (error) {
      console.error('API hívás hiba:', error);
      throw error;
    }
  },
  
  post: async (url, body) => {
    try {
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body),
        // Credentials mode a CORS-hoz
        credentials: 'include'
      };
      
      const response = await fetch(`${API_URL}${url}`, requestOptions);
      return handleResponse(response);
    } catch (error) {
      console.error('API hívás hiba:', error);
      throw error;
    }
  },
  
  put: async (url, body) => {
    try {
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
        // Credentials mode a CORS-hoz
        credentials: 'include'
      };
      
      const response = await fetch(`${API_URL}${url}`, requestOptions);
      return handleResponse(response);
    } catch (error) {
      console.error('API hívás hiba:', error);
      throw error;
    }
  },
  
  delete: async (url) => {
    try {
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Credentials mode a CORS-hoz
        credentials: 'include'
      };
      
      const response = await fetch(`${API_URL}${url}`, requestOptions);
      return handleResponse(response);
    } catch (error) {
      console.error('API hívás hiba:', error);
      throw error;
    }
  }
};

export default apiService;