import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    resource: 0
  },
  getters: {
    resource(state) { return state.resource; },
  },
  mutations: {
    initstore(state) {
      // Check if the ID exists
      if (localStorage.getItem('igame-v1')) {
        // Replace the state object with the stored item
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('igame-v1')))
        );
      }
    },
    updateresource(state, payload) {
      state.resource = payload.value;
    }

  },
  actions: {
    updateresource({commit}, payload) {
      commit('updateresource', payload);
    }
  }
})
