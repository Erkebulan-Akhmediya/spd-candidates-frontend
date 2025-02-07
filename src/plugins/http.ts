import type { App } from 'vue'
import { HttpService } from '@/services/HttpService.ts'
import type { AxiosInstance } from 'axios'
import axios from 'axios'

export default {

  install(app: App): void {
    const axiosInstance: AxiosInstance = axios.create({
      baseURL: `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    axiosInstance.interceptors.request.use(
      (config) => {
        const token: string | null = sessionStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );

    app.config.globalProperties.$http = HttpService.getInstance(axiosInstance)
  }

}
