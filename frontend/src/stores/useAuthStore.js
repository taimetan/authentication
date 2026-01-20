import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3107/api/v1/auth" : "/api/v1/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,
    isPendingVerification: false,

    signup: async (firstName, lastName, email, password) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axios.post(`${API_URL}/register`, { firstName, lastName, email, password });
            set({ user: response.data.user, isAuthenticated: true, isPendingVerification: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },
    login: async (email, password) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        try {
            set({ isLoading: true, error: null });
            await axios.post(`${API_URL}/logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },
    verifyEmail: async (code) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },
    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true, error: null });
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },
    forgotPassword: async (email) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error sending reset password email",
            });
            throw error;
        }
    },
    resetPassword: async (token, newPassword, confirmPassword) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { newPassword, confirmPassword });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error resetting password",
            });
            throw error;
        }
    },
}));