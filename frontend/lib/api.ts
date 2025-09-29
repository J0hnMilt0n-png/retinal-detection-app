import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  timeout: 30000, // 30 second timeout for image uploads
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem("access_token", access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const auth = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post("/auth/login/", credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile/");
    return response.data;
  },
};

// Patient API functions
export const patients = {
  list: async (params?: any) => {
    const response = await api.get("/patients/", { params });
    return response.data;
  },

  create: async (patientData: any) => {
    const response = await api.post("/patients/", patientData);
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/patients/${id}/`);
    return response.data;
  },

  update: async (id: string, patientData: any) => {
    const response = await api.put(`/patients/${id}/`, patientData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/patients/${id}/`);
    return response.data;
  },
};

// Retinal Images API functions
export const retinalImages = {
  list: async (params?: any) => {
    const response = await api.get("/retinal-images/", { params });
    return response.data;
  },

  create: async (imageData: FormData) => {
    const response = await api.post("/retinal-images/", imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/retinal-images/${id}/`);
    return response.data;
  },
};

// Analysis API functions
export const analysis = {
  analyzeImage: async (imageData: FormData) => {
    const response = await api.post("/analyze/", imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get("/dashboard/stats/");
    return response.data;
  },
};

// Predictions API functions
export const predictions = {
  list: async (params?: any) => {
    const response = await api.get("/predictions/", { params });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/predictions/${id}/`);
    return response.data;
  },

  confirm: async (id: string) => {
    const response = await api.post(`/predictions/${id}/confirm/`);
    return response.data;
  },
};

// Diseases API functions
export const diseases = {
  list: async () => {
    const response = await api.get("/diseases/");
    return response.data;
  },
};

// Medical History API functions
export const medicalHistory = {
  list: async (params?: any) => {
    const response = await api.get("/medical-history/", { params });
    return response.data;
  },

  create: async (historyData: any) => {
    const response = await api.post("/medical-history/", historyData);
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/medical-history/${id}/`);
    return response.data;
  },

  update: async (id: string, historyData: any) => {
    const response = await api.put(`/medical-history/${id}/`, historyData);
    return response.data;
  },
};

export default api;
