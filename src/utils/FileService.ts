import { v5 } from 'uuid'
import type { HttpService } from '@/utils/HttpService.ts'

export default class FileService {

  public constructor(private readonly http: HttpService) {
  }

  public async upload(file: File): Promise<string> {
    const formData: FormData = new FormData()
    const fileName: string = await this.generateUniqueName(file)
    formData.append('file', file, fileName)
    await this.http.post('/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return fileName
  }

  private async generateUniqueName(file: File): Promise<string> {
    const arrayBuffer: ArrayBuffer = await file.arrayBuffer()
    const byteArray: Uint8Array = new Uint8Array(arrayBuffer)
    const uuid: string = v5(byteArray, v5.URL)
    const fileExtension: string | undefined = file.name.split('.').pop()
    if (fileExtension === undefined) throw 'Отсутствует расширение файла'
    return `${uuid}.${fileExtension}`
  }

}
