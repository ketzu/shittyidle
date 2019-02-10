import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const resourcegain = (state) => {
  // base generation
  let gain = 1;

  return gain;
};

export default new Vuex.Store({
  state: {
    resource: 0,
    tickrate: 100
  },
  getters: {
    resource(state) { return state.resource; },
    tickrate(state) { return state.tickrate; },
    resourcegain(state) {
      return resourcegain(state);
    }
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
    startgame(state) {
      setInterval(() => {
        state.resource += resourcegain(state);
      }, state.tickrate);
    },
    updateresource(state, payload) {
      state.resource = payload.value;
    },
    spendresource(state, payload) {
      state.resource -= payload.value;
    }
  },
  actions: {
    updateresource({commit}, payload) {
      commit('updateresource', payload);
    },
    spendresource({commit}, payload) {
      commit('spendresource', payload);
    }
  }
})
