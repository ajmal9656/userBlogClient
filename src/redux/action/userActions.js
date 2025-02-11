import axiosUrl from '../../utils/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// User Login Action
export const login = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axiosUrl.post('/login', { email, password });
            console.log("Login responsez:", response.data);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            console.log("Login Error:", errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);
export const updateProfile = createAsyncThunk(
    'user/edit-profile',
    async (userDetails, { rejectWithValue }) => {
        try {
            const response = await axiosUrl.put('/edit-profile', userDetails);
            console.log("updated responsez:", response.data);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            console.log("updating Error:", errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// User Logout Action
export const logoutUser = createAsyncThunk(
    'user/logout',
    async (userId, { rejectWithValue }) => { // Accept userId as argument
      try {
        // Pass userId in your request body if needed
        const response = await axiosUrl.post('/logout', { userId }, { withCredentials: true });
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Logout failed';
        console.error('Logout error:', errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  );
  
