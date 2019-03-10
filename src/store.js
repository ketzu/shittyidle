import Vue from 'vue'
import Vuex from 'vuex'
import {achievements, baseinfrastructure, research, storagename, zones} from './statics/statics.js'
import {
  affecting,
  allupgrades,
  basebuildings,
  bgain,
  maxreached,
  upgrade,
  upgradereached,
  upgrades
} from "./statics/buildings";
import settings from "@/store/settings";
import grid from "@/store/grid";
import eventBus from "@/eventBus";

Vue.use(Vuex);

const resourcegain = (state) => {
  // base generation
  let gain = 0.1;

  // base multiplier = 1 ; experience gives multiplicative bonus
  let multiplier = 1 + expmult(state) + achievementmult(state);
  for (let i = 0; i < root.store_buildings.length; i += 1) {
    const current = root.store_buildings[i];
    let level = state.buildings[current['name']];
    if (level === undefined)
      continue;
    gain += current.gain * level * affecting(current, state.infrastructure, root) * current.mult * (state.buildingboni[i] + 1);
  }
  return [gain, multiplier];
};

const updateresources = (state, gain) => {
  state.resource += gain;
  state.resetresource += gain;
  state.alltime += gain;
};

const resettable = (state) => {
  if (state.buildings['Casino'] >= 85)
    return true;
  return false;
};

const calcstuff = (z, sig, p, first) => {
  if (z === 0) return 0;
  return (1 - sig(z)) * first + sig(z - p) * (Math.exp(Math.log(z) / Math.log(Math.log(z))));
};
const expgain = (state) => {
  const sig = (x) => {
    if (x < 0) return 0;
    return x > 200000000000000000000 ? 1 : x / 200000000000000000000;
  };
  const precalc = state.resetresource / (2 * Math.pow(10, 9.6));
  return calcstuff(state.resetresource, sig, 2000000000000, Math.sqrt(precalc));
};
const expmult = (state) => {
  const sig = (x) => {
    if (x < 0) return 0;
    return x > 1000 ? 1 : x / 1000;
  };
  const effexp = state.experience - state.lockedexp;
  return calcstuff(effexp, sig, 0, 0.04 * effexp) * (state.expchange + 1);
};
const achievementmult = (state) => {
  let value = 0;

  for (let key in achievements) {
    // check if the property/key is defined in the object itself, not in parent
    if (achievements.hasOwnProperty(key)) {
      if (state.achievements[key] === true) {
        value += achievements[key].mult;
      }
    }
  }
  return value;
};

const citynames = [
  "village",
  "city",
  "large city",
  "metropolis"
];

const cityupgradeable = (state) => {
  if (state.citylevel === 0 && state.experience + expgain(state) >= 1000) {
    return true;
  }
  if (state.citylevel === 1 && state.experience + expgain(state) >= 100000) {
    return true;
  }
  /*  if (state.citylevel === 2 && state.experience + expgain(state) >= 100000000) {
      return true;
    }*/
  return false;
};

const buyupgrade = (state, building, level) => {
  if (state.resource >= upgrades[building.name][level].upgcost) {
    state.resource -= upgrades[building.name][level].upgcost;

    if (state.upgrades[building.name] === undefined)
      Vue.set(state.upgrades, building.name, {});
    Vue.set(state.upgrades[building.name], level, true);

    // applies upgrade
    if (building.title !== "The same")
      upgrade(building.name, level, state, root);
  }
};

let mainloop = undefined;
const startsim = (state) => {
  clearInterval(mainloop);
  mainloop = setInterval(() => {
    const gain = resourcegain(state).reduce((a, b) => a * b);
    updateresources(state, gain);
  }, state.tickrate);
};

const stopsim = () => {
  clearInterval(mainloop);
};

let visible = true;
let lastActive = undefined;
let root;

const version = "1.0";

export default new Vuex.Store({
  state: {
    achievements: {},
    buycount: 1,
    buytoupgrade: false,
    startofgamedialog: true,
    starttime: Date.now(),
    resettime: Date.now(),
    version: version,
    resets: 0,
    resetresource: 0,
    experience: 0,
    lockedexp: 0,
    expchange: 0,
    resource: 0,
    alltime: 0,
    tickrate: 100,
    title: "mayor",
    citylevel: 0,
    buildings: {},
    buildingboni: [0, 0, 0, 0, 0, 0, 0, 0],
    upgrades: {},
    infrastructure: {},
    research: {}
  },
  getters: {
    buildingboni(state) {
      return state.buildingboni;
    },
    achievementmult(state) {
      return achievementmult(state);
    },
    boughtupgrades(state) {
      return state.upgrades;
    },
    buycount(state) {
      return state.buycount;
    },
    buytoupgrade(state) {
      return state.buytoupgrade;
    },
    achievements(state) {
      return state.achievements;
    },
    version(state) {
      return version;
    },
    oldversion(state) {
      return state.version;
    },
    timeall(state) {
      return state.starttime;
    },
    timereset(state) {
      return state.resettime;
    },
    upgrades(state) {
      return upgrades;
    },
    zones(state) {
      return zones;
    },
    research(state) {
      return research.filter(obj => obj.citylevel <= state.citylevel);
    },
    researchselection(state) {
      return state.research;
    },
    startofgamedialog(state) {
      return state.startofgamedialog;
    },
    resource(state) {
      return state.resource;
    },
    basegain(state) {
      return bgain;
    },
    expgain(state) {
      return expgain(state);
    },
    expmult(state) {
      return expmult(state);
    },
    alltime(state) {
      return state.alltime;
    },
    resetresource(state) {
      return state.resetresource;
    },
    experience(state) {
      return state.experience - state.lockedexp;
    },
    resets(state) {
      return state.resets;
    },
    infrastructurelevels(state) {
      return state.infrastructure;
    },
    buildinglevels(state) {
      return state.buildings;
    },
    tickrate(state) {
      return state.tickrate;
    },
    towntype(state) {
      return citynames[state.citylevel];
    },
    nexttowntype(state) {
      return citynames[state.citylevel + 1];
    },
    cityupgradeable(state) {
      return cityupgradeable(state);
    },
    citylevel(state) {
      return state.citylevel;
    },
    resettable(state) {
      return resettable(state);
    },
    title(state) {
      return state.title;
    },
    multiplier(state) {
      return resourcegain(state)[1];
    },
    resourcegain(state) {
      return resourcegain(state).reduce((a, b) => a * b);
    }
  },
  mutations: {
    initstore(state, vm) {
      root = vm;

      // Check if the ID exists
      if (localStorage.getItem(storagename)) {
        let deserialize = JSON.parse(localStorage.getItem(storagename));
        // Replace the state object with the stored item
        this.replaceState(
          Object.assign(state, deserialize)
        );
      }
    },
    startgame(state) {
      // reapply upgrades
      for (let [key, value] of Object.entries(state.buildings)) {
        if (state.buildings.hasOwnProperty(key)) {
          allupgrades(key, value, state, root);
        }
      }

      // reapply researches
      for (let [key, value] of Object.entries(state.research)) {
        if (state.research.hasOwnProperty(key) && value !== undefined) {
          research[key].options[value].modification(state, root);
        }
      }

      // offline ticks
      if (state.time !== undefined) {
        // at most 25920000 ticks = 30 Days worth of offline time
        const now = Date.now();
        let ticks = Math.min((now - state.time) / state.tickrate, 25920000);
        const gain = resourcegain(state).reduce((a, b) => a * b);
        updateresources(state, ticks * gain);
        setTimeout(() => {
          eventBus.$emit('offlineincome', {gain: (ticks * gain), time: state.time, now: now})
        }, 2500);
      }

      startsim(state);
      // handle being put in the background
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopsim();
          visible = false;
          lastActive = (new Date()).getTime();
        } else {
          if (visible == false) {
            visible = true;
            let timePassed = (new Date()).getTime() - lastActive;

            let ticks = Math.min(timePassed / state.tickrate, 25920000);
            const gain = resourcegain(state).reduce((a, b) => a * b);
            updateresources(state, ticks * gain);
            startsim(state);
          }
        }
      }, false);
    },
    updateresource(state, payload) {
      state.resource = payload.value;
    },
    spendresource(state, payload) {
      state.resource -= payload.value;
    },
    settownspecs(state, {title, towntype}) {
      state.towntype = towntype;
      state.title = title;
    },
    softreset(state, {upgrade}) {
      state.resets += 1;
      state.experience += expgain(state);

      if (upgrade && cityupgradeable(state)) {
        state.experience = 0;
        state.citylevel += 1;
      }

      state.resettime = Date.now();

      // Reset run specific stats
      state.buildingboni = [0, 0, 0, 0, 0, 0, 0, 0];
      state.buildings = {};
      state.infrastructure = {};
      state.research = {};
      state.upgrades = {};

      state.lockedexp = 0;
      state.resource = 0;
      state.resetresource = 0;
      state.expchange = 0;

      // Reset buildings array
      root.store_buildings = JSON.parse(JSON.stringify(basebuildings));
      root.store_infrastructure = JSON.parse(JSON.stringify(baseinfrastructure));
    },
    buybuilding(state, {building, count}) {
      if (state.buildings[building.name] === undefined)
        Vue.set(state.buildings, building.name, 0);
      for (let i = 0; i < count; i++) {
        if (state.buildings[building.name] >= 7000)
          return;
        const cost = building.cost.base * Math.pow(building.cost.rate, state.buildings[building.name]);
        if (cost < state.resource) {
          state.resource -= cost;
          state.buildings[building.name] += 1;
        }
        if (upgradereached(building.name, state.buildings[building.name])) {
          if (state.achievements['upgrades'] !== undefined) {
            buyupgrade(state, building, state.buildings[building.name]);
          } else {
            if (maxreached(building.name, state.buildings[building.name])) {
              eventBus.$emit('maxupgrade', {
                building: building.name,
                upgrade: upgrades[building.name][state.buildings[building.name]]
              });
            } else {
              eventBus.$emit('upgrade', {
                building: building.name,
                upgrade: upgrades[building.name][state.buildings[building.name]]
              });
            }
          }
        }
      }
    },
    buyinfrastrucutre(state, {building, count}) {
      if (state.infrastructure[building.name] === undefined)
        Vue.set(state.infrastructure, building.name, 0);
      for (let i = 0; i < count; i++) {
        const cost = building.cost.base * Math.pow(building.cost.rate, state.infrastructure[building.name]);
        if (cost < state.resource) {
          state.resource -= cost;
          state.infrastructure[building.name] += 1;
        }
      }
    },
    selectresearch(state, {level, selection}) {
      if (state.experience - state.lockedexp < research[level].cost)
        return;
      if (state.research[level] === undefined)
        Vue.set(state.research, level, selection);
      else {
        if (state.research[level] > 3 || state.research[level] < 0)
          state.research[level] = selection;
        else
          return;
      }
      state.lockedexp += research[level].cost;
      research[level].options[selection].modification(state, root);
    },
    hardreset(state) {
      // Hard Reset: Delete State
      localStorage.removeItem(storagename);
      // Reload page
      location.reload();
    },
    startGame(state) {
      state.startofgamedialog = false;
    },
    restartsim(state) {
      startsim(state);
    },
    setbuycount(state, value) {
      state.buycount = value;
    },
    setbuytoupg(state, value) {
      state.buytoupgrade = value;
    },
    buyupgrade(state, {building, level}) {
      buyupgrade(state, building, level);
    },
    achievement(state, name) {
      if (state.achievements[name] === undefined) {
        eventBus.$emit('achievement', achievements[name]);
      }
      Vue.set(state.achievements, name, true);
    }
  },
  actions: {
    spendresource({commit}, payload) {
      commit('spendresource', payload);
    },
    settownspecs({commit}, payload) {
      commit('settownspecs', payload);
    },
    buybuilding({commit}, payload) {
      commit('buybuilding', payload);
    },
    buyinfrastructure({commit}, payload) {
      commit('buyinfrastrucutre', payload);
    },
    selectresearch({commit}, payload) {
      commit('selectresearch', payload);
    },
    softreset({state, commit}, payload) {
      if (resettable(state)) {
        // evaluate achivements time
        if (state.resets >= 1) {
          commit('achievement','beginner');
        }
        if (state.buildings['Inn'] === undefined
          && state.buildings['Store'] === undefined
          && state.buildings['Bank'] === undefined
          && state.buildings['Datacenter'] === undefined
          && state.buildings['Factory'] === undefined
          && state.buildings['Energy'] === undefined) {
          commit('achievement','workfun');
        }
        if (Object.keys(state.upgrades).length === 0) {
          commit('achievement','upgrades');
        }
        commit('softreset', payload);
      }
      if (state.citylevel >= 1)
        commit('achievement','advancer');
      if (state.citylevel >= 2)
        commit('achievement','prof');
    },
    changecityname({commit}, name) {
      commit('changecityname', name);
    },
    startGame({commit}) {
      commit('startGame');
    },
    restartsim({commit}) {
      commit('restartsim');
    },
    setbuycount({commit}, payload) {
      commit('setbuycount', payload);
    },
    setbuytoupg({commit}, payload) {
      commit('setbuytoupg', payload);
    },
    buyupgrade({commit}, payload) {
      commit('buyupgrade', payload);
    }
  },
  modules: {
    settings,
    grid
  }
})