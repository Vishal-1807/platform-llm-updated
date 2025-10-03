import axios from "axios";
import {
  ConsumptionBaseUrls,
  LLMBaseUrls,
  TabularBaseUrls,
} from "./environment-url";

// Get environment with fallback to development
const environment = import.meta.env.VITE_NODE_ENV || 'development';

// Debug logging to verify environment configuration
console.log('Environment configuration:', {
  VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
  environment: environment,
  ApiUrl: TabularBaseUrls[environment],
  LLMApiUrl: LLMBaseUrls[environment],
  ConsumptionUrl: ConsumptionBaseUrls[environment]
});

export const ApiUrl = TabularBaseUrls[environment];
export const LLMApiUrl = LLMBaseUrls[environment];

// // export const LLMApiUrl = "https://llmops-api.cibi.ai";
// export const LLMApiUrl = "https://llmops-api-dev.cibi.ai";

const API = axios.create({
  baseURL: ApiUrl,
});

export const LLMAPI = axios.create({
  baseURL: LLMApiUrl,
});

// export const NewLLMAPI = axios.create({
//   baseURL: NewLLMApiUrl,
// });

export const ConsumptionURL = axios.create({
  baseURL: ConsumptionBaseUrls[environment],
});

function logoutUser() {
  window.location.href = "/logout";
}

const refreshToken = async (token) => {
  try {
    const response = await axios.post(
      `${LLMApiUrl}/extend_token?old_token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

// Add a request interceptor to include the authentication token in the headers
API.interceptors.request.use(
  (config) => {
    const access_token = sessionStorage.getItem("token");
    const session_token = sessionStorage.getItem("session_token");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
      config.headers["session-token"] = `${session_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Add a response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      const token = sessionStorage.getItem("token");
      try {
        const resp = await refreshToken(token);
        if (resp.status === 200 && resp.data && resp.data.access_token) {
          sessionStorage.setItem("token", resp.data.access_token);
          API.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${resp.data.access_token}`;
          return API.request(originalRequest);
        } else {
          logoutUser();
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        logoutUser();
      }
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor to include the authentication token in the headers
ConsumptionURL.interceptors.request.use(
  (config) => {
    const access_token = sessionStorage.getItem("token");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Add a response interceptor
ConsumptionURL.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      const token = sessionStorage.getItem("token");
      try {
        const resp = await refreshToken(token);
        if (resp.status === 200 && resp.data && resp.data.access_token) {
          sessionStorage.setItem("token", resp.data.access_token);
          ConsumptionURL.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${resp.data.access_token}`;
          return ConsumptionURL.request(originalRequest);
        } else {
          logoutUser();
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        logoutUser();
      }
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor to include the authentication token in the headers
LLMAPI.interceptors.request.use(
  (config) => {
    const access_token = sessionStorage.getItem("token");
    const session_token = sessionStorage.getItem("session_token");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
      config.headers["session-token"] = `${session_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Add a response interceptor
LLMAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      const token = sessionStorage.getItem("token");
      try {
        const resp = await refreshToken(token);
        if (resp.status === 200 && resp.data && resp.data.access_token) {
          sessionStorage.setItem("token", resp.data.access_token);
          LLMAPI.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${resp.data.access_token}`;
          return LLMAPI.request(originalRequest);
        } else {
          logoutUser();
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        logoutUser();
      }
    }
    return Promise.reject(error);
  }
);

// // Add a request interceptor to include the authentication token in the headers
// NewLLMAPI.interceptors.request.use(
//   (config) => {
//     const access_token = sessionStorage.getItem("token");
//     if (access_token) {
//       config.headers.Authorization = `Bearer ${access_token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// //Add a response interceptor
// NewLLMAPI.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       window.location.href = "/logout";
//     }
//     return Promise.reject(error);
//   }
// );
export default API;
