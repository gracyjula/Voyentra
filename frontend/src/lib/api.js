import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('voyentra_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Destinations
export const getDestinations = (params) => api.get('/destinations', { params });
export const getDestination = (id) => api.get(`/destinations/${id}`);

// Hotels
export const getHotels = (params) => api.get('/hotels', { params });
export const getHotel = (id) => api.get(`/hotels/${id}`);

// Packages
export const getPackages = (params) => api.get('/packages', { params });
export const getPackage = (id) => api.get(`/packages/${id}`);

// Experiences
export const getExperiences = (params) => api.get('/experiences', { params });
export const getExperience = (id) => api.get(`/experiences/${id}`);

// Trips
export const getTrips = () => api.get('/trips');
export const getTrip = (id) => api.get(`/trips/${id}`);
export const createTrip = (data) => api.post('/trips', data);
export const updateTrip = (id, data) => api.put(`/trips/${id}`, data);
export const deleteTrip = (id) => api.delete(`/trips/${id}`);

// Itinerary Items
export const addItineraryItem = (tripId, data) => api.post(`/trips/${tripId}/items`, data);
export const updateItineraryItem = (tripId, itemId, data) => api.put(`/trips/${tripId}/items/${itemId}`, data);
export const deleteItineraryItem = (tripId, itemId) => api.delete(`/trips/${tripId}/items/${itemId}`);

// Favorites
export const getFavorites = () => api.get('/favorites');
export const addFavorite = (data) => api.post('/favorites', data);
export const removeFavoriteByTypeId = (data) => api.delete('/favorites', { data });
export const removeFavorite = (id) => api.delete(`/favorites/${id}`);

// Bookings
export const getBookings = () => api.get('/bookings');
export const createBooking = (data) => api.post('/bookings', data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export default api;
