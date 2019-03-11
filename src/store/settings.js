export default {
  state: {
    currency: "₡",
    numbersplitsymbol: " x10^",
    numberview: 1,
    cityname: "Shitty Idle",
    upgradeindicator: false,
    ignoreupgradebuy: false
  },
  getters: {
    currency(state) {
      return state.currency;
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
    }
  },
  actions: {
    setCurrency({state, commit, rootState}, value) {
      commit('setCurrency', value);
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
    }
  }
};