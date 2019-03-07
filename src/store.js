import Vue from 'vue'
import Vuex from 'vuex'
import {basebuildings, baseinfrastructure, bgain, research, storagename, upgrades, zones, achievements} from './statics.js'
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
        effect *=2.35;
      else
        effect *= 0.9;
    }
    if (pn === 2) {
      rescounter += 1;
      if (rescounter < 4)
        effect *= 2.3;
      else
        effect *= 3.75;
    }
    if (pn === 1) {
      comcounter += 1;
      if (comcounter < 3)
        effect *= 2.52;
      else
        effect *= 0.83;
    }
  }
  for (let xn of getXNeighbors(grid, x, y)) {
    if (xn === 2) {
      rescounter += 1;
      if (rescounter < 3)
        effect *= 1.8;
      else
        effect *= 1.2;
    }
    if (xn === 1) {
      comcounter += 1;
      if (comcounter < 3)
        effect *= 2.6;
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
        effect *= 2.4;
      else
        effect *= 1.6;
    }
    if (pn === 1) {
      comcounter += 1;
      if (comcounter < 3)
        effect *= 3.2;
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
        effect *= 3.3;
      else
        effect *= 1.5;
    }
    if (pn === 1) {
      comcounter += 1;
      if (comcounter < 3)
        effect *= 2.6;
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
        case 1: values[0] += commercialEffect(grid,x,y); break;
        case 2: values[1] += residentialEffect(grid,x,y); break;
        case 3: values[2] += industrialEffect(grid,x,y); break;
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

const upgradereached = (building, level) => {
  for (var key in upgrades[building]) {
    // check if the property/key is defined in the object itself, not in parent
    if (upgrades[building].hasOwnProperty(key)) {
      if (level == key) {
        return true;
      }
    }
  }
  return false;
};

const upgrade = (buildingid, level, state) => {
  if (state.upgrades[buildingid] === undefined)
    return false;
  if (state.upgrades[buildingid][level] === undefined)
    return false;
  let index = root.store_buildings.findIndex(element => element.name === buildingid);
  if (index === undefined)
    return false;
  let tempgain = root.store_buildings[index].gain * upgrades[buildingid][level].gain;
  Vue.set(root.store_buildings, index, {...root.store_buildings[index], ...upgrades[buildingid][level], gain: tempgain});
  return true;
};

const allupgrades = (buildingid, level, state) => {
  for (let i = 0; i <= level; i++) {
    upgrade(buildingid, i, state);
  }
};

const affecting = (building, inflevels) => {
  let mult = 1;
  for (let infra of root.store_infrastructure.filter(inf => inf.affected.includes(building.name))) {
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
  let multiplier = 1 + expmult(state) + achievementmult(state);
  for (let current of root.store_buildings) {
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
  if (state.buildings['Casino'] >= 85)
    return true;
  return false;
};

const expgain = (state) => {
  const z = state.resetresource;
  const sig = (x) => {
    if(x<0) return 0;
    return x>200000000000000000000?1:x/200000000000000000000;
  };
  const precalc = z/(2*Math.pow(10,10.3));
  const precalc2 = z/Math.pow(10,7.7);
  return (1-sig(z))*Math.sqrt(precalc)+sig(z-2000000000000)*(Math.sqrt(precalc2)/Math.log(z)+60000);
};
const expmult = (state) => {
  const effexp = state.experience - state.lockedexp;
  return 0.04 * (effexp);
};
const achievementmult = (state) => {
  let value = 0;

  for (let key in achievements) {
    // check if the property/key is defined in the object itself, not in parent
    if (achievements.hasOwnProperty(key)) {
      if (state.achievements[key] === true) {
        value+=achievements[key].mult;
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

const effectstrength = (value) => {
  if(value <3) return 0.05;
  if(value < 550) return 0.05+value/550*0.2;
  if(value<1500) return 0.25+value/1500*0.74;
  return 0.99+(0.01)*(1-(Math.pow(0.99,value)));
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
  let values = [1,1,1,1,1,1,1,1];
  for(let i=0; i<3;i+=1) {
    for(let se of alleffects[i].strong){
      values[se] += effectstrength(improvements[i]) * 2;
    }
    for(let we of alleffects[i].weak) {
      values[we] += effectstrength(improvements[i]);
    }
  }
  values = values.map(e=>e/3);
  for(let i=0;i<8;i+=1) {
    Vue.set(root.store_buildings,i, {...root.store_buildings[i], cost: {...root.store_buildings[i].cost, rate:basecost[i]-basereduction*values[i]}});
  }
};

const buyupgrade = (state, building, level) => {
  if(state.resource>=upgrades[building.name][level].upgcost){
    state.resource -= upgrades[building.name][level].upgcost;

    if(state.upgrades[building.name] === undefined)
      Vue.set(state.upgrades,building.name,{});
    Vue.set(state.upgrades[building.name], level, true);

    // applies upgrade
    upgrade(building.name, level, state);
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

const sameGrid = (grid1, grid2) => {
  for(let x=0;x<5;x+=1){
    for(let y=0;y<5;y+=1){
      if(grid1[x][y] !== grid2[x][y])
        return false;
    }
  }
  return true;
};

const stopsim = () => {
  clearInterval(mainloop);
};

let visible = true;
let lastActive = undefined;
let root;

const version = "0.9.6";

export default new Vuex.Store({
  state: {
    settings: {
      currency: "₡",
      numbersplitsymbol: " x10^",
      numberview: 1,
      cityname: "Shitty Idle",
      upgradeindicator: false
    },
    achievements: {

    },
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
    resource: 0,
    alltime: 0,
    tickrate: 100,
    title: "mayor",
    citylevel: 0,
    buildings: {},
    upgrades: {},
    infrastructure: {},
    research: {},
    citygrid: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    gridconfigs: []
  },
  getters: {
    gridconfigs(state) {
      return state.gridconfigs;
    },
    achievementmult(state) {
      return achievementmult(state);
    },
    upgradeindicator(state) {
      return state.settings.upgradeindicator;
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

      // Check if the ID exists
      if (localStorage.getItem(storagename)) {
        let deserialize = JSON.parse(localStorage.getItem(storagename));
        // Replace the state object with the stored item
        this.replaceState(
          Object.assign(state, deserialize)
        );
      }
      if(state.settings.upgradeindicator === undefined) {
        Vue.set(state.settings,"upgradeindicator",false);
      }
    },
    startgame(state) {
      // reapply upgrades
      for (let [key, value] of Object.entries(state.buildings)) {
        if (state.buildings.hasOwnProperty(key)) {
          allupgrades(key, value, state);
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
      if (state.time !== undefined) {
        // at most 25920000 ticks = 30 Days worth of offline time
        const now = Date.now();
        let ticks = Math.min((now - state.time) / state.tickrate, 25920000);
        const gain = resourcegain(state).reduce((a, b) => a * b);
        updateresources(state, ticks*gain);
        setTimeout(() => {
          eventBus.$emit('offlineincome', {gain:(ticks * gain),time: state.time, now: now})
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
      if (resettable(state)) {
        state.resets += 1;
        state.experience += expgain(state);

        // evaluate achivements time
        if(state.resets>=1) {
          Vue.set(state.achievements,'beginner',true);
          if(state.resets==1)
            eventBus.$emit('achievement', achievements['beginner']);
        }
        if(state.buildings['Inn']===undefined
         && state.buildings['Store']===undefined
         && state.buildings['Bank']===undefined
         && state.buildings['Datacenter']===undefined
         && state.buildings['Factory']===undefined
         && state.buildings['Energy']===undefined) {
          if(state.achievements['workfun'] !== true)
            eventBus.$emit('achievement', achievements['workfun']);
          Vue.set(state.achievements,'workfun', true);
        }
        if(Object.keys(state.upgrades).length === 0) {
          if(state.achievements['upgrades'] === undefined)
            eventBus.$emit('achievement', achievements['upgrades']);
          Vue.set(state.achievements,'upgrades',true);
        }

        state.resettime = Date.now();

        // Reset run specific stats
        state.buildings = {};
        state.infrastructure = {};
        state.research = {};
        state.upgrades = {};

        state.lockedexp = 0;
        state.resource = 0;
        state.resetresource = 0;

        state.gridconfigs = state.gridconfigs.filter((grid) => !sameGrid(grid,state.citygrid));
        state.gridconfigs.unshift(state.citygrid);
        if(state.gridconfigs.length > 3)
          state.gridconfigs.pop();
        state.citygrid = [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0]
        ];

        // Reset buildings array
        root.store_buildings = JSON.parse(JSON.stringify(basebuildings));
        root.store_infrastructure = JSON.parse(JSON.stringify(baseinfrastructure));
      }
      if (upgrade && cityupgradeable(state)) {
        state.experience = 0;
        state.citylevel += 1;
        if(state.citylevel==1)
          eventBus.$emit('achievement', achievements['advancer']);
        if(state.citylevel==2)
          eventBus.$emit('achievement', achievements['prof']);
      }
      if(state.citylevel>=1)
        Vue.set(state.achievements, 'advancer', true);
      if(state.citylevel>=2)
        Vue.set(state.achievements, 'prof', true);
    },
    buybuilding(state, {building, count}) {
      if (state.buildings[building.name] === undefined)
        Vue.set(state.buildings, building.name, 0);
      for (let i = 0; i < count; i++) {
        if(state.buildings[building.name]>=7000)
          return;
        const cost = building.cost.base * Math.pow(building.cost.rate, state.buildings[building.name]);
        if (cost < state.resource) {
          state.resource -= cost;
          state.buildings[building.name] += 1;
        }
        if(upgradereached(building.name, state.buildings[building.name])){
          if(state.achievements['upgrades']!==undefined) {
            buyupgrade(state, building, state.buildings[building.name]);
          }
          if (maxreached(building.name, state.buildings[building.name])) {
            eventBus.$emit('maxupgrade', {building: building.name, upgrade: upgrades[building.name][state.buildings[building.name]]});
          }else{
            eventBus.$emit('upgrade', {building: building.name, upgrade: upgrades[building.name][state.buildings[building.name]]});
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
      if(evalGrid(state.citygrid).some(value=>value>=500)){
        if(state.achievements['zone']!==undefined) {
          eventBus.$emit('achievement', achievements['zone']);
        }
        Vue.set(state.achievements, 'zone', true);
      }
    },
    setbuycount(state, value) {
      state.buycount = value;
    },
    setbuytoupg(state, value) {
      state.buytoupgrade = value;
    },
    buyupgrade(state, {building, level}) {
      buyupgrade(state, building, level);
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
  }
})