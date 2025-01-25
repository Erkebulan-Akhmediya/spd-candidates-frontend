import type { Translatable } from '@/interfaces/global.ts'
import i18n from '@/plugins/locale'

export function getTranslatedName(translatable: Translatable): string {
  if (i18n.global.locale.value === 'ru') return translatable.nameRus
  return translatable.nameKaz
}
