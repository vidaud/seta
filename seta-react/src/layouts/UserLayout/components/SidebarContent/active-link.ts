export enum ActiveLink {
  DASHBOARD,
  RSAKEYS,
  APPLICATIONS,
  PERMISSIONS,
  NONE
}

export const getActiveLink = (path: string): ActiveLink => {
  switch (path) {
    case '/profile':
      return ActiveLink.DASHBOARD

    case path.startsWith('/permissions') ? path : '':
      return ActiveLink.PERMISSIONS

    case path.startsWith('/rsa-keys') ? path : '':
      return ActiveLink.RSAKEYS

    case path.startsWith('/applications') ? path : '':
      return ActiveLink.APPLICATIONS

    default:
      return ActiveLink.NONE
  }
}
