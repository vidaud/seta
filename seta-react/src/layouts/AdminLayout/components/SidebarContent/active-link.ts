export enum ActiveLink {
  DASHBOARD,
  USERS,
  ANNOTATIONS,
  DATA_SOURCES,
  NONE
}

export const getActiveLink = (path: string): ActiveLink => {
  switch (path) {
    case '/admin':
      return ActiveLink.USERS

    case path.startsWith('/admin/users') ? path : '':
      return ActiveLink.USERS

    case '/admin/data-sources':
      return ActiveLink.DATA_SOURCES

    case '/admin/annotations':
      return ActiveLink.ANNOTATIONS

    default:
      return ActiveLink.NONE
  }
}
