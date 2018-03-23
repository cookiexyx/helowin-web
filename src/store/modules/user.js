import { login, logout, getInfo } from '@/api/login'
import { constantRouterMap } from '@/router/index'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    routers: constantRouterMap,
    currentRole: {},
    roles: []
  },

  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.routers = routers
      // 保存到localStorage本地储存
      window.localStorage.setItem('routers', JSON.stringify(state.routers))
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CURRENTROLE: (state, currentRole) => {
      state.currentRole = currentRole
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const accountNumber = userInfo.accountNumber.trim()
      return new Promise((resolve, reject) => {
        // console.log(userInfo)
        login(accountNumber, userInfo.password)
          .then(response => {
            // console.log(response)
            // console.log(response.headers)
            setToken(response.headers.jwt_token)
            commit('SET_TOKEN', response.headers.jwt_token)
            commit('SET_ROLES', response.data.data.roleList)
            commit('SET_NAME', response.data.data.name)
            // commit('SET_AVATAR', response.data.avatar)
            resolve()
            // 设置路由
            // commit('SET_ROUTERS', response.data.data.roleList)
            // console.log(response.data.data.roleList[1].name)
            // this.$router.push({ path: '/dashboard' })
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(response => {
            const data = response.data
            commit('SET_ROLES', data.role)
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
