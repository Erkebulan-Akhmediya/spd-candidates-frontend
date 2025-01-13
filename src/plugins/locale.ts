import { createI18n } from 'vue-i18n'
import ru from '@/locales/ru.ts'
import kz from '@/locales/kz.ts'

const DEFAULT_LOCALE: string = 'ru';

export function getLocale(): string {
  return sessionStorage.getItem('locale') || DEFAULT_LOCALE;
}

export default createI18n({
  legacy: false,
  locale: getLocale(),
  messages: { ru, kz },
});
