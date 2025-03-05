import type { Translatable } from '@/interfaces/global.ts'
import { getTranslatedName } from '@/utils/Translate.ts'

export default function sortByName<T extends Translatable>(arr: T[]): T[] {
  arr.sort((a: T, b: T): number => {
    const aName: string = getTranslatedName(a)
    const bName: string = getTranslatedName(b)
    if (aName < bName) return -1
    if (aName > bName) return 1
    return 0
  })
  return arr
}
