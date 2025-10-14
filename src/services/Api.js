import axios from "axios";
import {
  ConsumptionBaseUrls,
  LLMBaseUrls,
  TabularBaseUrls,
} from "./environment-url";

// Get environment with fallback to development
const environment = import.meta.env.VITE_NODE_ENV || 'development';

console.log('Environment configuration:', {
  VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
  environment: environment,
  ApiUrl: TabularBaseUrls[environment],
  LLMApiUrl: LLMBaseUrls[environment],
  ConsumptionUrl: ConsumptionBaseUrls[environment]
});

export const ApiUrl = TabularBaseUrls[environment];
export const LLMApiUrl = LLMBaseUrls[environment];

const API = axios.create({
  baseURL: ApiUrl,
});

export const LLMAPI = axios.create({
  baseURL: LLMApiUrl,
});

export const ConsumptionURL = axios.create({
  baseURL: ConsumptionBaseUrls[environment],
});

function logoutUser() {
  console.log("🔴 Logging out user");
  sessionStorage.clear();
  window.location.href = "/login";
}

const refreshToken = async () => {
  try {
    const refreshToken = sessionStorage.getItem("refresh_token");
    const sessionToken = sessionStorage.getItem("session_token");
    
    console.log("🔄 Attempting token refresh...");
    
    const response = await fetch(`${TabularBaseUrls[environment]}/auth/refresh_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        session_token: sessionToken
      })
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Token refreshed successfully");
    return data;
  } catch (error) {
    console.error("❌ Token refresh error:", error);
    throw error;
  }
};

// API interceptor
API.interceptors.request.use(
  (config) => {
    const id_token = sessionStorage.getItem("id_token");
    const session_token = sessionStorage.getItem("session_token");
    if (id_token) {
      config.headers.Authorization = `Bearer ${id_token}`;
      config.headers["session-token"] = session_token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const data = await refreshToken();
        
        if (data && data.token_response && data.token_response.id_token) {
          // Update tokens
          sessionStorage.setItem("id_token", data.token_response.id_token);
          sessionStorage.setItem("access_token", data.token_response.access_token);
          sessionStorage.setItem("refresh_token", data.token_response.refresh_token);
          sessionStorage.setItem("session_token", data.session_token);
          sessionStorage.setItem("token", data.token_response.id_token);
          
          // Update headers
          API.defaults.headers.common["Authorization"] = `Bearer ${data.token_response.id_token}`;
          originalRequest.headers.Authorization = `Bearer ${data.token_response.id_token}`;
          originalRequest.headers["session-token"] = data.session_token;
          
          return API.request(originalRequest);
        } else {
          console.error("❌ Invalid refresh response");
          logoutUser();
        }
      } catch (refreshError) {
        console.error("❌ Error refreshing token:", refreshError);
        logoutUser();
      }
    }
    return Promise.reject(error);
  }
);

// ConsumptionURL interceptor
ConsumptionURL.interceptors.request.use(
  (config) => {
    const id_token = sessionStorage.getItem("id_token");
    if (id_token) {
      config.headers.Authorization = `Bearer ${id_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ConsumptionURL.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const data = await refreshToken();
        
        if (data && data.token_response && data.token_response.id_token) {
          sessionStorage.setItem("id_token", data.token_response.id_token);
          sessionStorage.setItem("access_token", data.token_response.access_token);
          sessionStorage.setItem("session_token", data.session_token);
          sessionStorage.setItem("token", data.token_response.id_token);
          
          ConsumptionURL.defaults.headers.common["Authorization"] = `Bearer ${data.token_response.id_token}`;
          originalRequest.headers.Authorization = `Bearer ${data.token_response.id_token}`;
          
          return ConsumptionURL.request(originalRequest);
        } else {
          logoutUser();
        }
      } catch (refreshError) {
        console.error("❌ Error refreshing token:", refreshError);
        logoutUser();
      }
    }
    return Promise.reject(error);
  }
);

// LLMAPI interceptor
LLMAPI.interceptors.request.use(
  (config) => {
    const id_token = sessionStorage.getItem("id_token");
    const session_token = sessionStorage.getItem("session_token");
    
    console.log("🔵 LLMAPI Request:", config.url);
    console.log("🔵 Using id_token:", id_token?.substring(0, 30) + "...");
    
    if (id_token) {
      config.headers.Authorization = `Bearer ${id_token}`;
      config.headers["session-token"] = session_token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

LLMAPI.interceptors.response.use(
  (response) => {
    console.log("✅ LLMAPI Response:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error("❌ LLMAPI Error:", error.config?.url, error.response?.status);
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("🔄 LLMAPI got 401, attempting refresh...");
      
      try {
        const data = await refreshToken();
        
        if (data && data.token_response && data.token_response.id_token) {
          sessionStorage.setItem("id_token", data.token_response.id_token);
          sessionStorage.setItem("access_token", data.token_response.access_token);
          sessionStorage.setItem("refresh_token", data.token_response.refresh_token);
          sessionStorage.setItem("session_token", data.session_token);
          sessionStorage.setItem("token", data.token_response.id_token);
          
          LLMAPI.defaults.headers.common["Authorization"] = `Bearer ${data.token_response.id_token}`;
          originalRequest.headers.Authorization = `Bearer ${data.token_response.id_token}`;
          originalRequest.headers["session-token"] = data.session_token;
          
          console.log("✅ Retrying LLMAPI request with new token");
          return LLMAPI.request(originalRequest);
        } else {
          console.error("❌ Invalid refresh response");
          logoutUser();
        }
      } catch (refreshError) {
        console.error("❌ Error refreshing token:", refreshError);
        logoutUser();
      }
    }
    return Promise.reject(error);
  }
);

export default API;
