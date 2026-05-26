import axios from "axios";


// ================= API INSTANCE =================
const API = axios.create({

  baseURL:
    "https://doubthub-ai-backend.onrender.com/api",

  withCredentials: false,
});


// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(

  (config) => {

    try {

      // ================= GET USER =================
      const userData = JSON.parse(
        localStorage.getItem("user")
      );

      console.log(
        "LOCAL USER:",
        userData
      );

      // ================= TOKEN FIX =================
      const token =
        userData?.user?.token;

      // ================= SEND TOKEN =================
      if (token) {

        config.headers.Authorization =
          `Bearer ${token}`;

        console.log(
          "TOKEN SENT:",
          token
        );
      }

      config.headers["Content-Type"] =
        "application/json";

      return config;

    } catch (error) {

      console.log(
        "INTERCEPTOR ERROR:",
        error
      );

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

    console.log(
      "API ERROR:",
      error.response?.data ||
      error.message
    );

    return Promise.reject(error);
  }
);

export default API;
