const page = {
  state: {
    currentPage: 1,
    pageSize: 10
  },
  mutations: {
    updateCurrentPage: (state, currentPage) => {
      state.currentPage = currentPage
    },
    updateCurrentPageSize: (state, pageSize) => {
      state.pageSize = pageSize
    }
  },
  actions: {
    changeCurrentPage: ({ commit }, currentPage) => {
      commit('updateCurrentPage', currentPage)
    },
    changeCurrentPageSize: ({ commit }, pageSize) => {
      commit('updateCurrentPageSize', pageSize)
    }
  }
}

export default page
