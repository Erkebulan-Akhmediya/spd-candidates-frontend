import axios, { type AxiosInstance } from 'axios'
import type { App } from 'vue'

export default {

  install(app: App): void {

    const axiosInstance: AxiosInstance = axios.create({
      baseURL: 'http://localhost:2109',
    });

    axiosInstance.interceptors.request.use(
      (config) => {
        const token: string | null = sessionStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );

    app.config.globalProperties.axios = axiosInstance;

  },

}
