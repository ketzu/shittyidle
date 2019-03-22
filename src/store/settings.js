import Vue from "vue";

export default {
  state: {
    currency: "₡",
    numbersplitsymbol: " x10^",
    numberview: 1,
    cityname: "Shitty Idle",
    upgradeindicator: false,
    ignoreupgradebuy: false,
    densebuildingmenu: false,
    drawcity: true
  },
  getters: {
    currency(state) {
      return state.currency;
    },
    drawcity(state) {
      console.log(state.drawcity);
      return state.drawcity;
    },
    densebuildingmenu(state) {
      return state.densebuildingmenu;
    },
    numbersplitsymbol(state) {
      return state.numbersplitsymbol;
    },
    numberview(state) {
      return state.numberview;
    },
    cityname(state) {
      return state.cityname;
    },
    upgradeindicator(state) {
      return state.upgradeindicator;
    },
    ignoreupgradebuy(state) {
      return state.ignoreupgradebuy;
    }
  },
  mutations: {
    initstore(state, vm) {
      if(state.densebuildingmenu === undefined) {
        Vue.set(state, 'densebuildingmenu', false);
      }
      if(state.ignoreupgradebuy===undefined)
        state.ignoreupgradebuy = false;
      if(state.densebuildingmenu===undefined)
        state.densebuildingmenu = false;
      if(state.upgradeindicator===undefined)
        state.upgradeindicator = false;
      if(state.drawcity===undefined)
        state.drawcity = true;
    },
    setCurrency(state, value) {
      state.currency = value;
    },
    setNumberformat(state, {symbol, view}) {
      state.numbersplitsymbol = symbol;
      state.numberview = view;
    },
    setCityname(state, name) {
      state.cityname = name;
    },
    setUpgradeindicator(state, value) {
      state.upgradeindicator = value;
    },
    setIgnoreupgradebuy(state, value) {
      state.ignoreupgradebuy = value;
    },
    setDensebuildingmenu(state, value) {
      state.densebuildingmenu = value;
    },
    setDrawcity(state, value) {
      state.drawcity = value;
    }
  },
  actions: {
    setCurrency({state, commit, rootState}, value) {
      commit('setCurrency', value);
    },
    setDrawcity({state, commit, rootState}, value) {
      commit('setDrawcity', value);
    },
    setNumberformat({state, commit, rootState}, payload) {
      commit('setNumberformat', payload);
    },
    setCityname({state, commit, rootState}, value) {
      commit('setCityname', value);
    },
    setUpgradeindicator({state, commit, rootState}, value) {
      commit('setUpgradeindicator', value);
    },
    setIgnoreupgradebuy({state, commit, rootState}, value) {
      commit('setIgnoreupgradebuy', value);
    },
    setDensebuildingmenu({commit}, value) {
      commit('setDensebuildingmenu', value);
    }
  }
};
