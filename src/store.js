import Vue from 'vue'
import Vuex from 'vuex'
import {achievements, baseinfrastructure, research, storagename} from './statics/statics.js'
import {affecting, basebuildings, bgain, buildingGain} from "./statics/buildings";
import settings from "@/store/settings";
import grid from "@/store/grid";
import buildings, {submitBuildingStats} from "@/store/buildings";
import eventBus from "@/eventBus";

Vue.use(Vuex);

const resourcegain = (state) => {
  // base generation
  let gain = 0.1;

  // base multiplier = 1 ; experience gives multiplicative bonus
  let multiplier = 1 + expmult(state) + achievementmult(state);
  for (let i = 0; i < root.store_buildings.length; i += 1) {
    const current = root.store_buildings[i];
    let level = state.buildings.levels[current['name']];
    if (level === undefined)
      continue;
    gain += buildingGain(level, current.gain, current.mult, state.buildings.boni[i], affecting(current, state.infrastructure, root));
  }
  return [gain, multiplier];
};

const updateresources = (state, gain) => {
  state.resource += gain;
  state.resetresource += gain;
  state.alltime += gain;
};

const resettable = (state) => {
  if (state.buildings.levels['Casino'] >= 85)
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

const version = "0.11.3";

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
    infrastructure: {},
    research: {}
  },
  getters: {
    achievements(state) {
      return state.achievements;
    },
    achievementmult(state) {
      return achievementmult(state);
    },
    buycount(state) {
      return state.buycount;
    },
    buytoupgrade(state) {
      return state.buytoupgrade;
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
        
        // check if substore changes can be apllied
        // grid
        if(deserialize.grid === undefined ||deserialize.grid.grid === undefined) {
          deserialize.grid = { grid: deserialize.citygrid, configs: deserialize.gridconfigs};
        }
        //buildings
        if(deserialize.buildings.levels === undefined) {
          deserialize.buildings = {"levels":deserialize.buildings,
              "boni": deserialize.buildingboni,
              "upgrades":deserialize.upgrades,
              "autoupgrade":false};
        }

        // Replace the state object with the stored item
        this.replaceState(
          Object.assign(state, deserialize)
        );
      }
      if (state.citylevel === 0 && state.experience === 0) {
        state.experience = 20;
      }
      if(state.buycount <= 0)
        state.buycount = 1;
    },
    startgame(state) {

      // reapply researches
      for (let [key, value] of Object.entries(state.research)) {
        if (state.research.hasOwnProperty(key) && value !== undefined) {
          research[key].options[value].modification(state, root);
        }
      }
    },
    updateresource(state, payload) {
      state.resource = payload.value;
    },
    spendresource(state, cost) {
      state.resource -= cost;
    },
    settownspecs(state, {title, towntype}) {
      state.towntype = towntype;
      state.title = title;
    },
    gainexp(state) {
      state.resets += 1;
      state.experience += expgain(state);
    },
    upgradeCitylevel(state) {
      state.experience = 0;
      state.citylevel += 1;
    },
    resetstate(state) {
      state.resettime = Date.now();

      // Reset run specific stats
      state.infrastructure = {};
      state.research = {};

      state.lockedexp = 0;
      state.resource = 0;
      state.resetresource = 0;
      state.expchange = 0;

      // Reset buildings array
      root.store_buildings = JSON.parse(JSON.stringify(basebuildings));
      root.store_infrastructure = JSON.parse(JSON.stringify(baseinfrastructure));
    },
    buyinfrastrucutre(state, {building, count}) {
      if (state.infrastructure[building.name] === undefined)
        Vue.set(state.infrastructure, building.name, 0);
      for (let i = 0; i < count && state.infrastructure[building.name] < 700; i++) {
        const cost = building.cost.base * Math.pow(building.cost.rate, state.infrastructure[building.name]);
        if (cost < state.resource) {
          state.resource -= cost;
          state.infrastructure[building.name] += 1;
        }
      }
      submitBuildingStats(state);
    },
    selectresearch(state, {level, selection}) {
      if (state.experience < research[level].cost)
        return;
      if (state.research[level] === undefined)
        Vue.set(state.research, level, selection);
      else {
        if (state.research[level] > 3 || state.research[level] < 0)
          state.research[level] = selection;
        else
          return;
      }
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
    achievement(state, name) {
      if (state.achievements[name] === undefined) {
        eventBus.$emit('achievement', achievements[name]);
      }
      Vue.set(state.achievements, name, true);
    },
    updateinfrastructure(state) {
      // infrastructure update reaction possibly
    }
  },
  actions: {
    initstore({commit}, payload) {
      commit('initstore', payload);
    },
    startgame({commit, state}) {
      commit('startgame');

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
    spendresource({commit}, cost) {
      commit('spendresource', cost);
    },
    settownspecs({commit}, payload) {
      commit('settownspecs', payload);
    },
    buyinfrastructure({commit}, payload) {
      commit('buyinfrastrucutre', payload);
      commit('updateinfrastructure');
    },
    selectresearch({commit}, payload) {
      commit('selectresearch', payload);
    },
    softreset({state, commit}, {upgrade}) {
      if (resettable(state)) {
        // evaluate achivements time
        if (state.resets >= 1) {
          commit('achievement', 'beginner');
        }
        if (state.buildings.levels['Inn'] === undefined
          && state.buildings.levels['Store'] === undefined
          && state.buildings.levels['Bank'] === undefined
          && state.buildings.levels['Datacenter'] === undefined
          && state.buildings.levels['Factory'] === undefined
          && state.buildings.levels['Energy'] === undefined) {
          commit('achievement', 'workfun');
        }

        if (upgrade && cityupgradeable(state)) {
          commit('upgradeCitylevel');
        }
        commit('gainexp');
        commit('resetstate');
        root.kongapi.stats.submit("Resets", state.resets);
      }
      if (state.citylevel >= 1)
        commit('achievement', 'advancer');
      if (state.citylevel >= 2)
        commit('achievement', 'prof');
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
    }
  },
  modules: {
    settings,
    grid,
    buildings
  }
})