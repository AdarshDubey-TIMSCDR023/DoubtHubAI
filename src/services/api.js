import axios from "axios";

// ================= API INSTANCE =================
// Remove /api from baseURL since your routes likely start with /api
const API = axios.create({
  baseURL: "https://doubthub-ai-backend.onrender.com",
  withCredentials: false,
  timeout: 30000, // 30 second timeout
});

// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(
  (config) => {
    try {
      // ================= GET USER =================
      const userDataString = localStorage.getItem("user");
      let token = null;
      
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        // Check different possible token locations
        token = userData?.token || userData?.user?.token;
        console.log("LOCAL USER:", userData?.name || userData?.user?.name);
      }

      // ================= SEND TOKEN =================
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("TOKEN SENT: Yes");
      } else {
        console.log("TOKEN SENT: No token found");
      }

      // ================= CONTENT TYPE =================
      config.headers["Content-Type"] = "application/json";

      return config;
    } catch (error) {
      console.log("INTERCEPTOR ERROR:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      console.log("API ERROR STATUS:", error.response.status);
      console.log("API ERROR DATA:", error.response.data);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        console.log("Authentication failed - clearing localStorage");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        // Optional: redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      
      // Handle 404 Not Found
      if (error.response.status === 404) {
        console.log("API endpoint not found. Check your route.");
      }
      
      // Handle 500 Server Error
      if (error.response.status === 500) {
        console.log("Server error occurred");
      }
    } else if (error.request) {
      // Request was made but no response received
      console.log("API ERROR: No response received from server");
      console.log("Please check if the backend server is running");
    } else {
      // Something else happened
      console.log("API ERROR:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
