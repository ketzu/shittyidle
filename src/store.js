import Vue from 'vue'
import Vuex from 'vuex'
import {basebuildings, baseinfrastructure, bgain, research, storagename, upgrades, zones} from './statics.js'
import {bcost} from "./statics";

Vue.use(Vuex);

export const eventBus = new Vue();

const getPlusNeighbors = (grid, x, y) => {
  let neighbors = [];
  if (x !== 0) {
    neighbors.push(grid[x - 1][y]);
  }
  if (x !== 4) {
    neighbors.push(grid[x + 1][y]);
  }
  if (y !== 0) {
    neighbors.push(grid[x][y - 1]);
  }
  if (y !== 4) {
    neighbors.push(grid[x][y + 1]);
  }
  return neighbors;
};
const getXNeighbors = (grid, x, y) => {
  let neighbors = [];
  if (x !== 0 && y !== 0) {
    neighbors.push(grid[x - 1][y - 1]);
  }
  if (x !== 4 && y !== 4) {
    neighbors.push(grid[x + 1][y + 1]);
  }
  if (x !== 4 && y !== 0) {
    neighbors.push(grid[x + 1][y - 1]);
  }
  if (x !== 0 && y !== 4) {
    neighbors.push(grid[x - 1][y + 1]);
  }
  return neighbors;
};

const commercialEffect = (grid, x, y) => {
  let effect = 1.1;
  let rescounter = 0;
  let indcounter = 0;
  let comcounter = 0;
  for (let pn of getPlusNeighbors(grid, x, y)) {
    if (pn === 3){
      indcounter+=1;
      if(indcounter<4)
        effect *=1.8;
      else
        effect *= 0.6;
    }
    if (pn === 2) {
      rescounter += 1;
      if (rescounter < 4)
        effect *= 2.2;
      else
        effect *= 3.5;
    }
    if (pn === 1) {
      comcounter += 1;
      if (comcounter < 3)
        effect *= 2;
      else
        effect *= 0.75;
    }
  }
  for (let xn of getXNeighbors(grid, x, y)) {
    if (xn === 2) {
      rescounter += 1;
      if (rescounter < 3)
        effect *= 1.5;
      else
        effect *= 1.2;
    }
    if (xn === 1) {
      comcounter += 1;
      if (comcounter < 3)
        effect *= 2.5;
    }
  }
  return effect;
};
const residentialEffect = (grid, x, y) => {
  let effect = 1.1;
  let rescounter = 0;
  let comcounter = 0;
  for (let pn of getPlusNeighbors(grid, x, y)) {
    if (pn === 3)
      effect /= 2;
    if (pn === 2) {
      rescounter += 1;
      if (rescounter < 4)
        effect *= 2.3;
      else
        effect *= 1.5;
    }
    if (pn === 1) {
      comcounter += 1;
      if (comcounter < 3)
        effect *= 3;
      else
        effect *= 0.8;
    }
  }
  for (let xn of getXNeighbors(grid, x, y)) {
    if (xn === 2) {
      rescounter += 1;
      if (rescounter < 3)
        effect *= 2.2;
      else
        effect *= 1.4;
    }
    if (xn === 1) {
      comcounter += 1;
      if (comcounter < 3)
        effect *= 2.3;
      else
        effect *= 0.9;
    }
  }
  return effect;
};
const industrialEffect = (grid, x, y) => {
  let effect = 1.1;
  let rescounter = 0;
  let comcounter = 0;
  for (let pn of [...getPlusNeighbors(grid, x, y),...getXNeighbors(grid, x, y)]) {
    if (pn === 3) {
      effect *= 1.3;
    }
    if (pn === 2) {
      rescounter += 1;
      if (rescounter < 3)
        effect *= 4;
      else
        effect *= 1.9;
    }
    if (pn === 1) {
      comcounter += 1;
      if (comcounter < 3)
        effect *= 3;
      else
        effect *= 0.7;
    }
  }
  return effect;
};

export const evalGrid = (grid) => {
  let values = [1,1,1];
  for(let x=0;x<5;x+=1) {
    for(let y=0;y<5;y+=1) {
      switch(grid[x][y]){
        case 1: values[0] *= commercialEffect(grid,x,y); break;
        case 2: values[1] *= residentialEffect(grid,x,y); break;
        case 3: values[2] *= industrialEffect(grid,x,y); break;
      }
    }
  }
  return values;
};

const maxreached = (building, level) => {
  for (var key in upgrades[building]) {
    // check if the property/key is defined in the object itself, not in parent
    if (upgrades[building].hasOwnProperty(key)) {
      if (level < key) {
        return false;
      }
    }
  }
  return true;
};

const upgrade = (buildingid, level) => {
  if (upgrades[buildingid] === undefined)
    return false;
  if (upgrades[buildingid][level] === undefined)
    return false;
  let index = root._buildings.findIndex(element => element.name === buildingid);
  if (index === undefined)
    return false;
  let tempgain = root._buildings[index].gain * upgrades[buildingid][level].gain;
  Vue.set(root._buildings, index, {...root._buildings[index], ...upgrades[buildingid][level], gain: tempgain});
  if (maxreached(buildingid, level)) {
    eventBus.$emit('maxupgrade', {building: buildingid, upgrade: upgrades[buildingid][level]});
  } else {
    eventBus.$emit('upgrade', {building: buildingid, upgrade: upgrades[buildingid][level]});
  }
  return true;
};

const allupgrades = (buildingid, level) => {
  for (let i = 0; i <= level; i++) {
    upgrade(buildingid, i);
  }
};

const affecting = (building, inflevels) => {
  let mult = 1;
  for (let infra of root._infrastructure.filter(inf => inf.affected.includes(building.name))) {
    if (inflevels[infra.name] !== undefined)
      mult *= Math.pow(infra.basemult, inflevels[infra.name]);
  }
  return mult;
};

const resourcegain = (state) => {
  // base generation
  let gain = 0.1;

  let grideffects = evalGrid(state.citygrid);

  // base multiplier = 1 ; experience gives multiplicative bonus
  let multiplier = 1 + expmult(state);
  for (let current of root._buildings) {
    let level = state.buildings[current['name']];
    if (level === undefined)
      continue;
    gain += current.gain * level * affecting(current, state.infrastructure) * current.mult;
  }
  return [gain, multiplier];
};

const updateresources = (state, gain) => {
  state.resource += gain;
  state.resetresource += gain;
  state.alltime += gain;
};

const resettable = (state) => {
  if (state.buildings['Casino'] >= 100)
    return true;
  return false;
};

const expgain = (state) => {
  return Math.sqrt(state.resetresource / (2 * Math.pow(10, 10)));
};
const expmult = (state) => {
  return 0.04 * (state.experience - state.lockedexp);
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

const updateGridResults = (state) => {
  const improvements = evalGrid(state.citygrid);
  if(improvements.reduce((a,b)=>a+b) === 3)
    return;
  // Farm -> 0, Inn -> 1, Store -> 2, Bank -> 3, Data -> 4, Factory -> 5, Energy -> 6, Casino -> 7
  const allweak = [0, 4];
  const comeffect = {strong: [2, 3], weak: [...[1, 6],...allweak]};
  const reseffect = {strong: [1, 7], weak: [...[5, 2],...allweak]};
  const indeffect = {strong: [5, 6], weak: [...[3, 7],...allweak]};
  const alleffects = [comeffect, reseffect, indeffect];

  const basecost =  basebuildings.map(building => building.cost.rate);

  const basereduction = 0.05; // base: 1.1 or 1.095
  let mult = [1,1,1,1,1,1,1,1];
  for(let i=0; i<3;i+=1) {
    const value = Math.log(improvements[i])+1;
    console.log(i+">"+value);
    for(let se of alleffects[i].strong){
      const effectstrength = (1-Math.pow(0.93,value));
      mult[se] *= effectstrength;
    }
    for(let we of alleffects[i].weak) {
      const effectstrength = (1-Math.pow(0.97,value));
      mult[we] *= effectstrength;
    }
  }
  for(let i=0;i<8;i+=1) {
    Vue.set(root._buildings,i, {...root._buildings[i], cost: {...root._buildings[i].cost, rate:basecost[i]-basereduction*mult[i]}});
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

const version = "0.9"

export default new Vuex.Store({
  state: {
    settings: {
      currency: "₡",
      numbersplitsymbol: " x10^",
      numberview: 1,
      cityname: "Shitty Idle"
    },
    startofgamedialog: true,
    starttime: Date.now(),
    resettime: Date.now(),
    version: version,
    resets: 0,
    resetresource: 0,
    experience: 0,
    lockedexp: 0,
    resource: 0,
    alltime: 0,
    tickrate: 100,
    title: "mayor",
    citylevel: 0,
    buildings: {},
    infrastructure: {},
    research: {},
    citygrid: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ],
  },
  getters: {
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
    citygrid(state) {
      return state.citygrid;
    },
    settings(state) {
      return state.settings;
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
    cityname(state) {
      return state.settings.cityname;
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
    currency(state) {
      return state.settings.currency;
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
      root._infrastructure = JSON.parse(JSON.stringify(baseinfrastructure));
      root._buildings = JSON.parse(JSON.stringify(basebuildings));

      // Check if the ID exists
      if (localStorage.getItem(storagename)) {
        let deserialize = JSON.parse(localStorage.getItem(storagename));
        // Replace the state object with the stored item
        this.replaceState(
          Object.assign(state, deserialize)
        );

        // reapply upgrades
        for (let [key, value] of Object.entries(state.buildings)) {
          if (state.buildings.hasOwnProperty(key)) {
            allupgrades(key, value);
          }
        }

        // reapply researches
        for (let [key, value] of Object.entries(state.research)) {
          if (state.research.hasOwnProperty(key) && value !== undefined) {
            research[key].options[value].modification(state);
          }
        }

        // reapply grid results
        updateGridResults(state);

        // offline ticks
        if (deserialize["time"] !== undefined) {
          // at most 25920000 ticks = 30 Days worth of offline time
          let ticks = Math.min(((new Date()).getTime() - deserialize["time"]) / state.tickrate, 25920000);
          const gain = resourcegain(state).reduce((a, b) => a * b);
          updateresources(state, ticks * gain);
          setTimeout(() => {
            eventBus.$emit('offlineincome', gain)
          }, 2500);
        }
      }
    },
    startgame(state) {
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
      if (resettable(state)) {
        state.resets += 1;
        state.experience += expgain(state);

        state.resettime = Date.now();

        // Reset run specific stats
        state.buildings = {};
        state.infrastructure = {};
        state.research = {};

        state.lockedexp = 0;
        state.resource = 0;
        state.resetresource = 0;
        state.citygrid = [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0]
        ];

        // Reset buildings array
        this.replaceState();
        root._buildings = JSON.parse(JSON.stringify(basebuildings));
        root._infrastructure = JSON.parse(JSON.stringify(baseinfrastructure));
      }
      if (upgrade && cityupgradeable(state)) {
        state.experience = 0;
        state.citylevel += 1;
      }
    },
    buybuilding(state, {building, count}) {
      if (state.buildings[building.name] === undefined)
        Vue.set(state.buildings, building.name, 0);
      for (let i = 0; i < count; i++) {
        const cost = building.cost.base * Math.pow(building.cost.rate, state.buildings[building.name]);
        if (cost < state.resource) {
          state.resource -= cost;
          state.buildings[building.name] += 1;
          upgrade(building.name, state.buildings[building.name]);
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
      state.lockedexp += research[level].cost;
      if (state.research[level] === undefined)
        Vue.set(state.research, level, selection);
      else {
        if (state.research[level] > 3 || state.research[level] < 0)
          state.research[level] = selection;
      }
      research[level].options[selection].modification(state);
    },
    hardreset(state) {
      // Hard Reset: Delete State
      localStorage.removeItem(storagename);
      // Reload page
      location.reload();
    },
    changecityname(state, name) {
      state.settings.cityname = name;
    },
    updatesettings(state, settings) {
      state.settings = settings;
    },
    startGame(state) {
      state.startofgamedialog = false;
    },
    restartsim(state) {
      startsim(state);
    },
    buildzone(state, {x, y, zone}) {
      Vue.set(state.citygrid[x], y, zone);
      updateGridResults(state);
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
    softreset({commit}, payload) {
      commit('softreset', payload);
    },
    changecityname({commit}, name) {
      commit('changecityname', name);
    },
    updatesettings({commit}, settings) {
      commit('updatesettings', settings);
    },
    startGame({commit}) {
      commit('startGame');
    },
    restartsim({commit}) {
      commit('restartsim');
    },
    buildzone({commit}, payload) {
      commit('buildzone', payload);
    }
  }
})
