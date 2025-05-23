import type { App } from 'vue'
import FileService from '@/services/FileService.ts'

export default {

  install(app: App): void {
    app.config.globalProperties.$file = FileService.getInstance(app.config.globalProperties.$http)
  }

}
