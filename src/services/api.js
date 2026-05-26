import axios from "axios";


// ================= API INSTANCE =================
const API = axios.create({

  baseURL:
    "https://doubthub-ai-backend.onrender.com/api",
});


// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(

  (config) => {

    try {

      // Get User
      const userData = JSON.parse(
        localStorage.getItem("user")
      );

      console.log(
        "LOCAL USER:",
        userData
      );

      // ================= SEND TOKEN =================
      if (userData?.token) {

        config.headers.Authorization =
          `Bearer ${userData.token}`;

        console.log(
          "TOKEN SENT:",
          userData.token
        );
      }

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