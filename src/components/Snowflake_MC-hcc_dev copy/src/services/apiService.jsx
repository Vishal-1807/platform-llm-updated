// services/apiService.js
import axios from "axios";

const API_BASE_URL = "https://dev-api.penguinai.co/ccocoding";
const MAX_RETRIES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

class ApiService {
  constructor() {
    this.accessToken = null;
    this.tokenType = "bearer";
    this.setupAxiosInterceptor();
  }

  // Set up axios interceptor for automatic token inclusion
  setupAxiosInterceptor() {
    axios.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.url.includes(API_BASE_URL)) {
          config.headers.Authorization = `${this.tokenType} ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Set token after successful login
  setToken(accessToken, tokenType = "bearer") {
    this.accessToken = accessToken;
    this.tokenType = tokenType;
  }

  // Clear token on logout
  clearToken() {
    this.accessToken = null;
    this.tokenType = "bearer";
  }

  // Authenticated fetch wrapper that automatically adds token
  async authenticatedFetch(url, options = {}) {
    const headers = {
      ...options.headers,
    };

    // Add Authorization header if token exists and URL is for our API
    if (this.accessToken && url.includes(API_BASE_URL)) {
      headers.Authorization = `${this.tokenType} ${this.accessToken}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }

  /**
   * Gets a presigned URL for S3 upload
   * @param {Object} fileInfo - File information
   * @param {string} fileInfo.filename - Name of the file
   * @param {string} [fileInfo.document_id] - Optional document ID
   * @returns {Promise<Object>} - Presigned URL response
   */
  async getPresignedUrl(fileInfo) {
    try {
      const url = new URL(`${API_BASE_URL}/generate-upload-url`);
      url.searchParams.append("file_name", fileInfo.filename);

      const response = await this.authenticatedFetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || "Failed to get presigned URL"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting presigned URL:", error);
      throw error;
    }
  }
  /**
   * Uploads file to S3 using presigned URL
   * @param {File} file - The file to upload
   * @param {Object} presignedData - Presigned URL data from backend
   * @returns {Promise<Object>} - Upload result
   */
  async uploadToS3(file, presignedData) {
    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    if (!presignedData || !presignedData.presigned_post) {
      return {
        success: false,
        error: "Invalid presigned URL data",
      };
    }

    try {
      const { presigned_post, document_id, filename } = presignedData;
      const { url, fields } = presigned_post;

      if (!url || !fields) {
        return {
          success: false,
          error: "Invalid presigned post structure",
        };
      }

      // Create FormData for the upload
      const formData = new FormData();

      // Append all required fields from the presigned post
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append the actual file (must be last)
      formData.append("file", file);

      // Upload to S3
      const response = await fetch(
        url.replace("s3.amazonaws.com", "s3.us-east-2.amazonaws.com"),
        {
          method: "POST",
          body: formData,
          // Don't set Content-Type header - let the browser set it with boundary
        }
      );

      if (response.status === 204) {
        return {
          success: true,
          document_id,
          filename,
          message: "File uploaded successfully",
        };
      } else {
        const errorText = await response.text();
        console.error("S3 upload failed:", response.status, errorText);
        return {
          success: false,
          error: `Upload failed with status ${response.status}`,
          details: errorText,
        };
      }
    } catch (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: "Error during file upload",
        details: error.message,
      };
    }
  }

  /**
   * Gets a presigned URL for S3 upload
   * @param {Object} fileInfo - File information
   * @param {string} fileInfo.filename - Name of the file
   * @param {string} [fileInfo.document_id] - Optional document ID
   * @returns {Promise<Object>} - Presigned URL response
   */
  async processUploadedFile(fileInfo) {
    try {
      const url = new URL(`${API_BASE_URL}/process-uploaded-file`);
      url.searchParams.append("file_name", fileInfo.filename);

      if (fileInfo.document_id) {
        url.searchParams.append("document_id", fileInfo.document_id);
      }

      const response = await this.authenticatedFetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || "Failed to get presigned URL"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting presigned URL:", error);
      throw error;
    }
  }

  // Authentication method (no interceptor needed for login)
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail ||
            errorData?.message ||
            `Authentication failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.access_token) {
        throw new Error("Invalid response: missing access token");
      }

      // Automatically set the token after successful login
      this.setToken(data.access_token, data.token_type || "bearer");

      return {
        access_token: data.access_token,
        token_type: data.token_type || "bearer",
      };
    } catch (error) {
      console.error("Login error:", error);
      if (error.message.includes("fetch")) {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }
      throw error;
    }
  }

  async fetchHistory() {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/history`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data.documents)) {
        throw new Error("Invalid response format");
      }

      return data.documents.map((doc) => ({
        id: doc.document_id,
        name: doc.file_name,
        date: doc.date,
        status: doc.status,
        url: `${API_BASE_URL}/documents/${doc.document_id}`,
      }));
    } catch (error) {
      console.error("Error fetching history:", error);
      throw error;
    }
  }

  async fetchResults(documentId) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/results/${documentId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.status}`);
      }

      const results = await response.json();
      if (!results || typeof results !== "object") {
        throw new Error("Invalid results format received");
      }

      return results;
    } catch (error) {
      console.error("Error fetching results:", error);
      throw error;
    }
  }

  async fetchDocument(url) {
    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/json",
        },
      });

      const uint8Array = new Uint8Array(response?.data);
      const binaryString = uint8Array.reduce(
        (acc, byte) => acc + String.fromCharCode(byte),
        ""
      );
      const base64String = btoa(binaryString);
      return `data:application/pdf;base64,${base64String}`;
    } catch (error) {
      console.error("Error fetching PDF:", error);
      throw error;
    }
  }

  async sendChatMessage(documentId, query) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document_id: documentId,
            query: query,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from chat");
      }

      return response;
    } catch (error) {
      console.error("Chat error:", error);
      throw error;
    }
  }

  // Legacy methods - keeping for backward compatibility
  async addFinalCptCode(documentId, code) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/documents/${documentId}/cpt-codes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add CPT code");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding CPT code:", error);
      throw error;
    }
  }

  async deleteFinalCptCode(documentId, code) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/documents/${documentId}/cpt-codes/${code}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete CPT code");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting CPT code:", error);
      throw error;
    }
  }

  // New enhanced API methods
  async searchCodes(searchString, type, key) {
    try {
      if (searchString.length < 3) {
        throw new Error("Search string must be at least 3 characters");
      }

      const params = new URLSearchParams({
        search_string: searchString,
        type: type, // 'cpt' or 'icd'
        key: key, // 'Code' or 'Description'
      });

      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/search?${params}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching codes:", error);
      throw error;
    }
  }

  async addorUpdateDos(documentId, addorUpdate, payload) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/dos/${documentId}/${addorUpdate}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add codes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding codes:", error);
      throw error;
    }
  }

  async deleteDos(documentId, payload) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/dos/${documentId}/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete codes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting codes:", error);
      throw error;
    }
  }

  async addCodes(documentId, codesData) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/icd/${documentId}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(codesData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add codes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding codes:", error);
      throw error;
    }
  }

  async deleteCodes(documentId, payload) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/icd/${documentId}/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete codes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting codes:", error);
      throw error;
    }
  }

  async approveOrRejectCode(documentId, payload) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/icd/${documentId}/approve-reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete codes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting codes:", error);
      throw error;
    }
  }

  async fetchComments(documentId, commentsType, payload) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/${commentsType.toLowerCase()}/${documentId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add codes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding codes:", error);
      throw error;
    }
  }

  async addComments(documentId, commentsType, payload) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/${commentsType.toLowerCase()}/${documentId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add codes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding codes:", error);
      throw error;
    }
  }

  // Add these methods to your existing service class

  async addModifiers(documentId, code, modifiers) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/add_modifiers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document_id: documentId,
            code: code,
            modifiers: modifiers, // Array of strings
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add modifiers");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding modifiers:", error);
      throw error;
    }
  }

  async removeModifiers(documentId, code, modifiers) {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/remove_modifiers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document_id: documentId,
            code: code,
            modifiers: modifiers, // Array of strings
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove modifiers");
      }

      return await response.json();
    } catch (error) {
      console.error("Error removing modifiers:", error);
      throw error;
    }
  }

  validateFile(file) {
    if (!file) {
      return { isValid: false, error: "No file selected" };
    }

    if (file.type !== "application/pdf") {
      return { isValid: false, error: "Please select a PDF file" };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds the limit of ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB`,
      };
    }

    return { isValid: true };
  }
}

export default new ApiService();
