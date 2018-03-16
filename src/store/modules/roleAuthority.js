const state = {
  id: '0',
  type: '1'
}
const getters = {
  getType: state => state.type,
  getId: state => state.id
}

const actions = {
  changeTab: ({ commit }, type) => {
    commit('updateType', type)
  },
  changeRoleId: ({ commit }, id) => {
    commit('updateRoleId', id)
  }
}

const mutations = {
  updateType: (state, payload) => {
    state.type = payload
  },
  updateRoleId: (state, payload) => {
    state.id = payload
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
