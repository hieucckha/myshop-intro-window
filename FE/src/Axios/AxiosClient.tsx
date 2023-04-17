import { logOut } from "@/components/Auth/AuthSlice";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router";
// import { logout, refreshToken } from "../apps/Redux/authSlice/authSlice";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: false,
});

export const setupInterceptors = (store: any) => {
  axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (err: any) => {
      const originalConfig = err.config;
      // console.log("resfetching token");

      if (originalConfig.url !== "/auth/login" && err.response) {
        // Access Token was expired
        // console.log("refreshToken");
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const localToken = sessionStorage.getItem("token");

            const data = { token: localToken };
            // console.log("newToken:", { data });
            const rs = await axiosClient.post(
              `/auth/refresh-token?tokenExpried=${localToken}`,
              null
            );
            console.log("::::::", rs);
            // store.dispatch(refreshToken(rs.data));

            return axiosClient(originalConfig);
          } catch (_error) {
            store.dispatch(logOut(""));
            window.location.href = "/login";
            return Promise.reject(_error);
          }
        }
      }
      // console.log("end refresh");
      console.log("ERROR RESPONSE:", err.response);
      const { data, status } = err.response;

      const errorMessage = data.desc || "";
      // console.log(errorMessage);
      if (status === 403) {
        return Promise.reject({ errorMessage, status });
      }
      return Promise.reject(errorMessage);
    }
  );
};

axiosClient.interceptors.request.use(
  (config: any) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    // console.log({ config });
    return config;
  },
  (error) => {
    console.log("ERROR RESPONSE:", error.response);
    return Promise.reject(error);
  }
);

export default axiosClient;