export enum ActiveLink {
  DASHBOARD,
  USERS,
  COMMUNITY_REQUESTS,
  RESOURCE_REQUESTS,
  ORPHANED_COMMUNITIES,
  ORPHANED_RESOURCES,
  ANNOTATIONS,
  NONE
}

export const getActiveLink = (path: string): ActiveLink => {
  switch (path) {
    case '/admin':
      return ActiveLink.DASHBOARD

    case path.startsWith('/admin/users') ? path : '':
      return ActiveLink.USERS

    case '/admin/community-requests':
      return ActiveLink.COMMUNITY_REQUESTS

    case '/admin/resource-requests':
      return ActiveLink.RESOURCE_REQUESTS

    case '/admin/orphaned-communities':
      return ActiveLink.ORPHANED_COMMUNITIES

    case '/admin/orphaned-resources':
      return ActiveLink.ORPHANED_RESOURCES

    case '/admin/annotations':
      return ActiveLink.ANNOTATIONS

    default:
      return ActiveLink.NONE
  }
}
