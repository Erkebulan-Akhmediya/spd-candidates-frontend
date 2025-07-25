import { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'

interface Response<Type> {
  message: string
  data: Type
}

export class HttpService {

  private static instance: HttpService;

  private constructor(private readonly axios: AxiosInstance) {
  }

  public static getInstance(axios: AxiosInstance): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService(axios)
    }
    return HttpService.instance;
  }

  public async get<Type>(url: string, config?: AxiosRequestConfig): Promise<Type> {
    try {
      const {data} = await this.axios.get<Response<Type>>(url, config)
      return data.data
    } catch (e) {
      console.error('axios:', e)
      throw `ошибка сети ${(e as AxiosError)?.code ?? ''}`
    }
  }

  public async post<Type>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ): Promise<Type> {
    try {
      const {data} = await this.axios.post<Response<Type>>(url, payload, config)
      return data.data
    } catch (e) {
      console.error('axios:', e)
      throw `ошибка сети ${(e as AxiosError)?.code ?? ''}`
    }
  }

  public async put<Type>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ): Promise<Type> {
    try {
      const {data} = await this.axios.put<Response<Type>>(url, payload, config)
      return data.data
    } catch (e) {
      console.error('axios:', e)
      throw `ошибка сети ${(e as AxiosError)?.code ?? ''}`
    }
  }

  public async delete<Type>(url: string, config?: AxiosRequestConfig): Promise<Type> {
    try {
      const {data} = await this.axios.delete<Response<Type>>(url, config)
      return data.data
    } catch (e) {
      console.error('axios:', e)
      throw `ошибка сети ${(e as AxiosError)?.code ?? ''}`
    }
  }

}
