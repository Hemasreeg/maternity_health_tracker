import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

export const healthAPI = {
  assess: (symptoms) =>
    api.post('/health/assess', { symptoms }),
  getHistory: () =>
    api.get('/health/history'),
};

export const doctorAPI = {
  list: () =>
    api.get('/doctors'),
  getById: (id) =>
    api.get(`/doctors/${id}`),
};

export const appointmentAPI = {
  book: (doctor_id, date, time) => {
    // Combine date and time into appointment_date
    const appointmentDateTime = `${date}T${time}`;
    return api.post('/appointments/book', { doctor_id, appointment_date: appointmentDateTime, time });
  },
  list: () =>
    api.get('/appointments'),
  cancel: (id) =>
    api.delete(`/appointments/${id}`),
  markCompleted: (id) =>
    api.put(`/appointments/${id}/complete`, { status: 'completed' }),
  updateStatus: (id, status) =>
    api.put(`/appointments/${id}/status`, { status }),
};

export const nutritionAPI = {
  getRecommendations: (pregnancy_week) =>
    api.get(`/nutrition/recommendations?week=${pregnancy_week}`),
};

export default api;
