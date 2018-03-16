const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  currentRole: state => state.user.currentRole,
  routers: state => state.user.routers,
  currentPage: state => state.page.currentPage,
  pageSize: state => state.page.pageSize
}
export default getters
