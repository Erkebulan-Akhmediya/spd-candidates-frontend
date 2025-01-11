/// <reference types="vite/client" />
import { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    axios: AxiosInstance,
    $route: import('vue-router').RouteLocationNormalized,
    $router: import('vue-router').Router,
  }
}
