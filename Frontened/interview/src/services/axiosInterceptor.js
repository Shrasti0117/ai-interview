import axios from "axios";

let interceptorAttached = false;

export const setupAxiosInterceptors = () => {
  if (interceptorAttached) return;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("sessionId");

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }

      return Promise.reject(error);
    }
  );

  interceptorAttached = true;
};
