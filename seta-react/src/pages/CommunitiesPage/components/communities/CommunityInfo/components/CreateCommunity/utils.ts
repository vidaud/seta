export const getCommunityID = function getCommunityID(user) {
  const username =
    user?.lastName.toLowerCase().slice(0, 4) + user?.firstName.toLowerCase().slice(0, 3)

  return user?.domain + '-' + username + '-' + Math.floor(100000 + Math.random() * 900000)
}
