import type { Region } from '@/interfaces/global.ts'
import sortByName from '@/utils/Sort.ts'
import type { HttpService } from '@/services/HttpService.ts'

export default class RegionService {
  private static instance: RegionService

  private constructor(private readonly http: HttpService) {}

  public static getInstance(http: HttpService): RegionService {
    if (!RegionService.instance) RegionService.instance = new RegionService(http)
    return RegionService.instance
  }

  public sort(regions: Region[]): Region[] {
    regions = regions.filter((region: Region): boolean => region.id !== -1)
    regions = sortByName<Region>(regions)
    regions.unshift({
      id: -1,
      nameRus: 'Все регионы',
      nameKaz: 'Барлық аумақтар',
    })
    return regions
  }

  public async fetch(): Promise<Region[]> {
    const regions: Region[] = await this.http.get<Region[]>('/region/all')
    return this.sort(regions)
  }
}
