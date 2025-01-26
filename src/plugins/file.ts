import type { App } from 'vue'
import FileService from '@/utils/FileService.ts'

export default {

  install(app: App): void {
    app.config.globalProperties.$file = new FileService(app.config.globalProperties.axios)
  }

}
