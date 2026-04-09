import axiosInstance from './axiosInstance';

export const getProperties = (params) =>
  axiosInstance.get('/properties', { params });

export const getProperty = (id) =>
  axiosInstance.get(`/properties/${id}`);

export const createProperty = (formData) =>
  axiosInstance.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProperty = (id, formData) =>
  axiosInstance.put(`/properties/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProperty = (id) =>
  axiosInstance.delete(`/properties/${id}`);

export const getMyProperties = () =>
  axiosInstance.get('/properties/my');
