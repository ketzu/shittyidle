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
    upgrades: {}
  },
  getters: {
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
    softreset(state) {
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
      if(building.title === "The same")
        return ;
      state.resource -= upgrades[building.name][level].upgcost;

      // enter upgrade into list
      if (state.upgrades[building.name] === undefined)
        Vue.set(state.upgrades, building.name, {});
      Vue.set(state.upgrades[building.name], level, true);

      applyupgrade(building.name, level, state, root);
    }
  },
  actions: {
    buybuilding({dispatch, state, commit, rootState}, {building, count}) {
      const level = state.levels[building.name];
      if(state.levels[building.name] === undefined)
        commit('innitBuilding',building.name);

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
      const newupgrades = upgradesReached(building.name, level, level + count);

      if (newupgrades.length > 0) {
        // if autobuy try to buy all available upgrades
        if (rootState.achievements['upgrades'] === true) {
          // autobuy upgrades
          for (let upgradelevel in newupgrades) {
            dispatch('buyupgrade', {building, upgradelevel});
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
        commit('buyupgrade', {building, level});
      }
    }
  }
};