import axios from "axios";


// ================= API INSTANCE =================
const API = axios.create({

  // IMPORTANT
  // NO /api HERE
  baseURL:
    "https://doubthub-ai-backend.onrender.com",

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


      // ================= CONTENT TYPE =================
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

    // ================= RESPONSE ERROR =================
    if (error.response) {

      console.log(
        "API ERROR STATUS:",
        error.response.status
      );

      console.log(
        "API ERROR DATA:",
        error.response.data
      );


      // ================= UNAUTHORIZED =================
      if (
        error.response.status === 401
      ) {

        console.log(
          "Unauthorized"
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "token"
        );
      }


      // ================= NOT FOUND =================
      if (
        error.response.status === 404
      ) {

        console.log(
          "Route not found"
        );
      }


      // ================= SERVER ERROR =================
      if (
        error.response.status === 500
      ) {

        console.log(
          "Server Error"
        );
      }

    } else if (error.request) {

      // ================= NO RESPONSE =================
      console.log(
        "No response from server"
      );

    } else {

      console.log(
        "ERROR:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default API;
