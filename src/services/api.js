import axios from "axios";


// ================= API INSTANCE =================
const API = axios.create({

  baseURL:
    "https://doubthub-ai-backend.onrender.com/api",

  withCredentials: false,

  timeout: 30000,
});


// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(

  (config) => {

    try {

      // ================= GET USER =================
      const userDataString =
        localStorage.getItem("user");

      let token = null;

      if (userDataString) {

        const userData =
          JSON.parse(userDataString);

        console.log(
          "LOCAL USER:",
          userData
        );

        // ================= TOKEN =================
        token =
          userData?.token ||
          userData?.user?.token;
      }


      // ================= SEND TOKEN =================
      if (token) {

        config.headers.Authorization =
          `Bearer ${token}`;

        console.log(
          "TOKEN SENT"
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
