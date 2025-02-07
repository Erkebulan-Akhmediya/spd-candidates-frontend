/// <reference types="vite/client" />
import { AxiosInstance } from 'axios'
import { VueI18n, TranslateFunction } from 'vue-i18n'
import { RouteLocationNormalized, Router } from 'vue-router'
import type FileService from '@/services/FileService.ts'
import type { HttpService } from '@/services/HttpService.ts'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    axios: AxiosInstance
    $route: RouteLocationNormalized
    $router: Router
    $i18n: VueI18n
    $t: TranslateFunction
    $file: FileService
    $http: HttpService
  }
}
