import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    resource: 0,
    tickrate: 100,
    generators: {}
  },
  getters: {
    resource(state) { return state.resource; },
    tickrate(state) { return state.tickrate; },
    generators(state) { return state.generators; }
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
    },
    spendresource(state, payload) {
      state.resource -= payload.value;
    },
    build(state, {name}) {
      if(state.generators[name] === undefined)
        Vue.set(state.generators, name, 0);
      state.generators[name] += 1;
    }
  },
  actions: {
    updateresource({commit}, payload) {
      commit('updateresource', payload);
    },
    spendresource({commit}, payload) {
      commit('spendresource', payload);
    },
    build({commit}, payload) {
      commit('build', payload);
    }
  }
})
