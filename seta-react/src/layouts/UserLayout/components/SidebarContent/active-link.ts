export enum ActiveLink {
  DASHBOARD,
  RSAKEYS,
  APPLICATIONS,
  PERMISSIONS,
  CLOSE,
  NONE
}

export const getActiveLink = (path: string): ActiveLink => {
  switch (path) {
    case '/profile':
      return ActiveLink.DASHBOARD

    case path.startsWith('/profile/permissions') ? path : '':
      return ActiveLink.PERMISSIONS

    case path.startsWith('/profile/rsa-keys') ? path : '':
      return ActiveLink.RSAKEYS

    case path.startsWith('/profile/applications') ? path : '':
      return ActiveLink.APPLICATIONS

    case path.startsWith('/profile/close-account') ? path : '':
      return ActiveLink.CLOSE

    default:
      return ActiveLink.NONE
  }
}
