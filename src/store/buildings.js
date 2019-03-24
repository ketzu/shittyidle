import Vue from "vue";
import {
  applyallupgrades,
  buildingCostOf,
  maxcount,
  maxReached,
  applyupgrade,
  upgrades,
  upgradesReached, basebuildings
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
      if(state.boni===undefined)
        state.boni = [0, 0, 0, 0, 0, 0, 0, 0];
      if(state.autoupgrade===undefined)
        state.autoupgrade = false;
      if(state.upgrades===undefined)
        state.upgrades = {};
      if(state.levels===undefined)
        state.levels = {};
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
    },
    updatebuilding(state) {
      // update buildings reaction?
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
      if(count<=0)
        return;
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

      // Did we reach any upgrades?
      const newupgrades = upgradesReached(building.name, 0, level + count);

      if (newupgrades.length > 0) {
        // check for achievement upgrades2
        if (maxReached(building.name, state.levels[building.name]) && rootState.achievements['upgrades2'] === undefined) {
          commit('achievement', 'upgrades2');
        }

        // if autobuy try to buy all available upgrades
        if (state.autoupgrade) {
          // autobuy upgrades
          for (let upgradelevel of newupgrades) {
            dispatch('buyupgrade', {building, level: upgradelevel});
          }

        } else {
          // notification that upgrades are available
          if (maxReached(building.name, state.levels[building.name]) && !maxReached(building.name, state.levels[building.name]-count)) {
            eventBus.$emit('maxupgrade', {
              building: building.name
            });
          }
        }
      }
      commit('updatebuilding');
    },
    buyallupgrades({state, dispatch}) {
      // for all buildings
      for(const building of basebuildings) {
        // get level
        const level = state.levels[building.name];
        // stop if the building is not bought yet
        if(level === undefined) continue;

        // get list of all upgrades available for this building at this level
        const newupgrades = upgradesReached(building.name, 0, level);

        if (newupgrades.length > 0) {
          // if there are any upgrades, buy them
          for (let upgradelevel of newupgrades) {
            dispatch('buyupgrade', {building, level: upgradelevel});
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