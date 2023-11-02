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

    case path.startsWith('/profile/permissions') ? path : '':
      return ActiveLink.PERMISSIONS

    case path.startsWith('/profile/rsa-keys') ? path : '':
      return ActiveLink.RSAKEYS

    case path.startsWith('/profile/applications') ? path : '':
      return ActiveLink.APPLICATIONS

    default:
      return ActiveLink.NONE
  }
}
