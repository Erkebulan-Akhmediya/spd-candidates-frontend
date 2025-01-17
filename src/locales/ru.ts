import { ru } from 'vuetify/locale'

export default {
  $vuetify: { // default vuetify translations
    ...ru,
  },
  sideBarItems: {
    main: 'Главная страница',
    employees: 'Сотрудники',
    candidates: 'Кандидаты',
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
