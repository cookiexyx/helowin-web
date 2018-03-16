// const env = 'local'
const env = 'public'

const services = {
  local: {
    login: '../static/data/login.json', // 登陆
    logout: '../static/data/logout.json', // 登出
    roleList: '../static/data/systemset/roleList.json', // 查询所有角色
    usermanger: '../static/data/systemset/usermanger.json',
    rolesandauthority: '../static/data/systemset/rolesandauthority.json',
    roleBoardAuthority: '../static/data/systemset/roleBoardAuthority.json',
    roleCockpitAuthority: '../static/data/systemset/roleCockpitAuthority.json',
    rolesAuthorityChecked:
      '../static/data/systemset/rolesAuthorityChecked.json', // 角色权限是否选中
    menuPermissionsList: '../static/data/systemset/menuPermissionsList.json', // 查询菜单权限
    areaManager: '../static/data/systemset/areaManager.json', // 查询所有区域
    tablesDetail: '../static/data/dataset/tablesDetail.json',
    directoriesList: '../static/data/dataset/directoriesList.json',
    tablesList: '../static/data/dataset/tablesList.json',
    dataDomainsList: '../static/data/dataset/dataDomainsList.json', // 查询所有数据字典
    addDomain: '../static/data/dataset/addDomain.json', // 添加数据字典
    updateDomain: '../static/data/dataset/updateDomain.json', // 更新数据字典
    noData: ''
  },

  public: {
    login: '/visualize/user/login', // 登陆
    logout: '/visualize/user/login_out', // 登出
    roleList: '/visualize/role/list_roles_by_name',
    // 用户管理
    usermanger: '/visualize/user/list_users', // 查询所有用户
    deleteUser: '/visualize/user/delete_user', // 删除用户
    searchUser: '/visualize/user/list_users_by_username', // 根据姓名模糊查询
    // 角色权限管理
    rolesandauthority: '/visualize/role_permission/list_menu_permissions_by_role', // 获取角色菜单权限
    roleBoardAuthority: '/visualize/role_permission/list_dashboard_permissions_by_role', // 获取角色仪表盘权限
    roleCockpitAuthority: '/visualize/role_permission/list_cockpit_permissions_by_role', // 获取角色驾驶舱权限
    updateAuthority: '/visualize/role_permission/update_menu_permissions_by_role', // 修改角色菜单权限
    updateBoardAuthority: '/visualize/role_permission/update_dashboard_permissions_by_role', // 修改角色仪表盘权限
    updateCockpitAuthority: '/visualize/role_permission/update_cockpit_permissions_by_role', // 修改角色驾驶舱权限
    // 菜单管理
    menuPermissionsList: '/visualize/permission/list_permissions', // 获取菜单列表
    addPermission: '/visualize/permission/add_permission', // 增加菜单
    updatePermission: '/visualize/permission/update_permission', // 修改菜单
    deletePermission: '/visualize/permission/delete_permission', // 删除菜单
    sortPermission: '/visualize/permission/update_permission_rank', // 菜单排序
    // 机构管理
    orgsList: '/visualize/org/list_orgs', // 查询所有机构
    areaManager: '/visualize/region/list_regions', // 查询所有区域
    organizaManger: '/visualize/org/list_orgs', // 查询所有机构
    // 数据表管理
    directoriesList: '/visualize/table/list_directories', // 查询所有文件夹
    tablesList: '/visualize/table/list_tables', // 查询文件夹下面所有数据表
    tablesDetail: '/visualize/table/query_table', // 查询数据表数据
    // 数据字典管理
    dataDomainsList: '/visualize/domain/list_domains', // 查询所有数据字典
    addDomain: '/visualize/domain/add_domain', // 添加数据字典
    updateDomain: '/visualize/domain/update_domain', // 更新数据字典
    byDomainIdentification: '/visualize/domain/list_domains_by_identification', // 数据字典标识模糊查询
    byDomainName: '/visualize/domain/list_domains_by_name', // 数据字典名称模糊查询
    deleteDomain: '/visualize/domain/delete_empty_domain', // 删除数据字典
    noData: ''
  }
}

export const API_CONFIG = Object.assign(services[env])

