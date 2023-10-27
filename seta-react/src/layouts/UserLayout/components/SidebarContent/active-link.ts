export enum ActiveLink {
  DASHBOARD,
  RSAKEYS,
  APPLICATIONS,
  LIBRARY,

  RESTRICTED_RESOURCES,
  NONE
}

export const getActiveLink = (path: string): ActiveLink => {
  switch (path) {
    case '/profile':
      return ActiveLink.DASHBOARD

    case path.startsWith('/rsa-keys') ? path : '':
      return ActiveLink.RSAKEYS

    case '/admin/community-requests':
      return ActiveLink.APPLICATIONS

    case '/admin/resource-requests':
      return ActiveLink.LIBRARY

    case '/admin/orphaned-communities':
      return ActiveLink.RESTRICTED_RESOURCES

    default:
      return ActiveLink.NONE
  }
}
