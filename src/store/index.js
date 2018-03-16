import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import roleAuthority from './modules/roleAuthority'
import page from './modules/page'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    roleAuthority,
    page,
    permission
  },
  getters
})

export default store
