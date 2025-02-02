import type { App } from 'vue'
import { HttpService } from '@/utils/HttpService.ts'

export default {

  install(app: App): void {
    app.config.globalProperties.$http = new HttpService(app.config.globalProperties.axios)
  }

}
