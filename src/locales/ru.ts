import { ru } from 'vuetify/locale'

export default {
  $vuetify: { // default vuetify translations
    ...ru,
  },
  sideBarItems: {
    employees: 'Сотрудники',
    candidates: 'Кандидаты',
    tests: 'Тесты',
    exit: 'Выход',
  },
  login: {
    title: 'Вход',
    username: 'Имя пользователя',
    password: 'Пароль',
    button: 'Войти',
  },
  allCandidates: {
    tabs: {
      new: 'Новые',
      onRevision: 'На проверке ВБ',
      onApproval: 'На согласовании',
      approved: 'Согласованные',
      rejected: 'Отказанные',
    },
  },
}
