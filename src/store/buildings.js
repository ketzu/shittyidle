import Vue from "vue";
import {
  applyallupgrades,
  buildingCostOf,
  maxcount,
  maxReached,
  applyupgrade,
  upgrades,
  upgradesReached
} from "../statics/buildings";
import eventBus from "@/eventBus";

let root;

export default {
  state: {
    levels: {},
    boni: [0, 0, 0, 0, 0, 0, 0, 0],
    upgrades: {},
    autoupgrade: false
  },
  getters: {
    autoupgrade(state) {
      return state.autoupgrade;
    },
    buildinglevels(state) {
      return state.levels;
    },
    upgrades(state) {
      return upgrades;
    },
    boughtupgrades(state) {
      return state.upgrades;
    },
    buildingboni(state) {
      return state.boni;
    }
  },
  mutations: {
    initstore(state, vm) {
      root = vm;
    },
    startgame(state) {
      // reapply upgrades
      for (let [key, value] of Object.entries(state.levels)) {
        if (state.levels.hasOwnProperty(key)) {
          applyallupgrades(key, value, state, root);
        }
      }
    },
    resetbuildings(state) {
      state.boni = [0, 0, 0, 0, 0, 0, 0, 0];
      state.levels = {};
      state.upgrades = {};
    },
    buybuilding(state, building) {
      state.levels[building.name] += 1;
    },
    innitBuilding(state, name) {
      if (state.levels[name] === undefined)
        Vue.set(state.levels, name, 0);
    },
    buyupgrade(state, {building, level}) {
      // enter upgrade into list
      if (state.upgrades[building.name] === undefined)
        Vue.set(state.upgrades, building.name, {});
      if(state.upgrades[building.name][level] === true)
        return;
      Vue.set(state.upgrades[building.name], level, true);

      applyupgrade(building.name, level, state, root);
    },
    setAutoupgrade(state, value) {
      state.autoupgrade = value;
    }
  },
  actions: {
    setAutoupgrade({dispatch, state, commit, rootState}, value) {
      if(rootState.achievements['upgrades'] === true)
        commit('setAutoupgrade', value);
    },
    softreset({dispatch, state, commit, rootState}, payload) {
      if (Object.keys(state.upgrades).length === 0) {
        commit('achievement','upgrades');
      }
      commit('resetbuildings');
    },
    buybuilding({dispatch, state, commit, rootState}, {building, count}) {
      if(state.levels[building.name] === undefined)
        commit('innitBuilding',building.name);
      const level = state.levels[building.name];

      for (let i = 0; i < count; i++) {
        // Do not allow buying more than maxcount buildings
        if (state.levels[building.name] >= maxcount)
          return;

        const cost = buildingCostOf(state.levels[building.name], 1, building.cost.base, building.cost.rate);
        if (cost < rootState.resource) {
          commit('buybuilding', building);
          dispatch('spendresource', cost);
        }
      }

      // Did we reach any *new* upgrades?
      const newupgrades = upgradesReached(building.name, 0, level + count);

      if (newupgrades.length > 0) {
        // if autobuy try to buy all available upgrades
        if (state.autoupgrade) {
          // autobuy upgrades
          for (let upgradelevel of newupgrades) {
            dispatch('buyupgrade', {building, level: upgradelevel});
          }

        } else {
          // notification that upgrades are available
          if (maxReached(building.name, state.levels[building.name])) {
            eventBus.$emit('maxupgrade', {
              building: building.name,
              upgrade: upgrades[building.name][state.levels[building.name]]
            });
          } else {
            eventBus.$emit('upgrade', {
              building: building.name,
              upgrade: upgrades[building.name][state.levels[building.name]]
            });
          }
        }
      }
    },
    buyupgrade({state, commit, rootState}, {building, level}) {
      if (rootState.resource >= upgrades[building.name][level].upgcost) {
        if(building.title === "The same")
          return ;
        rootState.resource -= upgrades[building.name][level].upgcost;
        commit('buyupgrade', {building, level});
      }
    }
  }
};