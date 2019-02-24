import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const eventBus = new Vue();

const storagename = 'cidle-v1';

const bbcost = 10;
const costgrowth = 13;

const bcost = {
  Farm: bbcost,
  Inn: Math.pow(costgrowth,1)*bbcost,
  Store: Math.pow(costgrowth,2)*bbcost,
  Bank: Math.pow(costgrowth,3)*bbcost,
  Datacenter: Math.pow(costgrowth,4)*bbcost,
  Factory: Math.pow(costgrowth,5)*bbcost,
  Energy: Math.pow(costgrowth,6)*bbcost,
  Casino: Math.pow(costgrowth,7)*bbcost
};

const bbgain = 0.1;
const gaingrowth = 8;

const bgain = {
  Farm: bbgain,
  Inn: Math.pow(gaingrowth,1)*bbgain,
  Store: Math.pow(gaingrowth,2)*bbgain,
  Bank: Math.pow(gaingrowth,3)*bbgain,
  Datacenter: Math.pow(gaingrowth,4)*bbgain,
  Factory: Math.pow(gaingrowth,5)*bbgain,
  Energy: Math.pow(gaingrowth,6)*bbgain,
  Casino: Math.pow(gaingrowth,7)*bbgain
};

const basebuildings = [
  {name: "Farm", title: "Farm", type: "Generator", icon: "fa-apple-alt", cost: {base: bcost['Farm'], rate: 1.1}, gain: bgain['Farm'], mult: 1.00, iconcolor: "red darken-2"},
  {name: "Inn" , title: "Inn", type: "Generator", icon: "fa-beer", cost: {base: bcost['Inn'], rate: 1.1}, gain: bgain['Inn'], mult: 1.00, iconcolor: "amber"},
  {name: "Store", title: "Store", type: "Generator", icon: "fa-store-alt", cost: {base: bcost['Store'], rate: 1.1}, gain: bgain['Store'], mult: 1.00, iconcolor: "brown darken-3"},
  {name: "Bank", title: "Bank", type: "Generator", icon: "fa-university", cost: {base: bcost['Bank'], rate: 1.1}, gain: bgain['Bank'], mult: 1.00, iconcolor: "grey darken-4"},
  {name: "Datacenter", title: "Datacenter", type: "Generator", icon: "fa-satellite-dish", cost: {base: bcost['Datacenter'], rate: 1.1}, gain: bgain['Datacenter'], mult: 1.00, iconcolor: "blue darken-4"},
  {name: "Factory", title: "Factory", type: "Generator", icon: "fa-industry", cost: {base: bcost['Factory'], rate: 1.1}, gain: bgain['Factory'], mult: 1.00, iconcolor: "teal darken-4"},
  {name: "Energy", title: "Coal Plant", type: "Generator", icon: "fa-burn", cost: {base: bcost['Energy'], rate: 1.1}, gain: bgain['Energy'], mult: 1.00, iconcolor: "deep-orange"},
  {name: "Casino", title: "Gambling Den", type: "Generator", icon: "fa-dice", cost: {base: bcost['Casino'], rate: 1.095}, gain: bgain['Casino'], mult: 1.00, iconcolor: "purple darken-2"}
];

let buildings = JSON.parse(JSON.stringify(basebuildings));

const upgrades = {
  Farm: {
    25: {gain: 3, uname: "Crop Rotation"},
    50: {gain: 5, uname: "Fertilizer"},
    100:{gain: 15, uname: "Artificial Irrigation", title: "Advanced Farm"},
    130: {gain:10, uname: "Plant Crossing"},
    170: {gain:12, uname: "Mechanized Agriculture", title: "Automated Farm"},
    200: {gain:18, uname: "Bio Farming", title: "Bio Farm"}
    },
  Inn:  {
    30: {gain: 3, title: "Tavern"},
    60: {gain: 3, title: "Minibars"},
    90: {gain: 12, title: "Hotel"},
    120:{gain: 15, title: "Spa"},
    150:{gain: 12, title: "Bar"}
    },
  Store: {
    15: {gain: 4, title: "Shop"},
    40: {gain: 4, title: "Market"},
    80: {gain: 5, title: "Farming Market"},
    140: {gain:11, title: "Mall"}
    },
  Bank: {
    35: {gain: 5, title: "Online bank"},
    70: {gain: 8, title: "Loan Shark"},
    105: {gain: 4, title: "Investment Bank"},
    140: {gain: 9, title: "Highspeed Trader"},
    180: {gain: 13, title: "Money Launderer"}
    },
  Datacenter: {
    40: {gain: 4, title: "Bitcoin Mining"},
    80: {gain: 7, title: "Social Networks"},
    120: {gain:5, title: "Ad Tracking"},
    160: {gain:9, title: "Smart Grid"}
    },
  Factory: {
    10: {gain: 3, title: "Outsourcing"},
    40: {gain: 4, title: "Automatic Factory"},
    80: {gain: 8, title: "Self Replicating Goods"}
    },
  Energy: {
    50: {gain: 3, title: "Nuclear Reactor"},
    90: {gain: 8, title: "Renewable Energy"}
    },
  Casino: {
    75: {gain: 2, title: "Casino"},
    150: {gain: 4, title: "Las Vegas"}
    },
};

const infrastructure = [
  {name: "Roads", title: "Roads", icon: "fa-road", reqlevel: 1, basemult: 1.03, affected: ['Farm', 'Store', 'Factory'], cost: {base: Math.pow(10,5), rate: 1.1}},
  {name: "Electricity" , title: "Electricity Grid", icon: "fa-plug", reqlevel: 1, basemult: 1.02, affected: ['Energy', 'Datacenter', 'Bank'], cost: {base: Math.pow(10,8), rate: 1.1}},
  {name: "Transport", title: "Public Transport", icon: "fa-bus-alt", reqlevel: 1, basemult: 1.04, affected: ['Casino', 'Inn'], cost: {base: Math.pow(10,11), rate: 1.1}},
  {name: "University", title: "University", icon: "fa-graduation-cap ", reqlevel: 2, basemult: 1.02, affected: [], cost: {base: Math.pow(10,15), rate: 1.1}},
  {name: "Lighting", title: "Lighting", icon: "fa-lightbulb", reqlevel: 2, basemult: 1.02, affected: [], cost: {base: Math.pow(10,20), rate: 1.1}},
  {name: "Internet", title: "Internet", icon: "fa-wifi", reqlevel: 3, basemult: 1.02, affected: [], cost: {base: Math.pow(10,25), rate: 1.1}},
  {name: "Airport", title: "Airport", icon: "fa-plane-departure ", reqlevel: 3, basemult: 1.02, affected: [], cost: {base: Math.pow(10,30), rate: 1.1}}
];

const upgrade = (buildingid, level) => {
  if(upgrades[buildingid] === undefined)
    return;
  if(upgrades[buildingid][level] === undefined)
    return;
  let index = buildings.findIndex(element => element.name === buildingid);
  if(index === undefined)
    return;
  let tempgain = buildings[index].gain * upgrades[buildingid][level].gain;
  buildings[index] = {...buildings[index], ...upgrades[buildingid][level], gain: tempgain};
  eventBus.$emit('upgrade', {building: buildingid, upgrade: upgrades[buildingid][level]});
};

const allupgrades = (buildingid, level) => {
  for(let i = 0; i <= level; i++) {
    upgrade(buildingid, i);
  }
};

const affecting = (building, inflevels) => {
  let mult = 1;
  for(let infra of infrastructure.filter(inf => inf.affected.includes(building.name))) {
    if(inflevels[infra.name] !== undefined)
      mult *= Math.pow(infra.basemult, inflevels[infra.name]);
  }
  return mult;
};

const resourcegain = (state) => {
  // base generation
  let gain = 0.1;
  let multiplier = 1+expmult(state);
  for(let current of buildings) {
    let level = state.buildings[current['name']];
    if(level === undefined)
      continue;
    multiplier *= Math.pow(current.mult,level);
    gain += current.gain * level*affecting(current, state.infrastructure);
  }
  return [gain,multiplier];
};

const updateresources = (state, gain) => {
  state.resource += gain;
  state.resetresource += gain;
  state.alltime += gain;
};

const resettable = (state) => {
  if(state.buildings['Casino'] >= 100)
    return true;
  return false;
};

const expgain = (state) => {
  return Math.sqrt(state.resetresource/(2*Math.pow(10,10)));
};
const expmult = (state) => {
  return 0.04*state.experience;
};

const citynames = [
  "village",
  "city",
  "large city",
  "metropolis"
];

const cityupgradeable = (state) => {
  if(state.citylevel === 0 && state.experience >= 1000) {
    return true;
  }
  return false;
};

export default new Vuex.Store({
  state: {
    resets: 0,
    resetresource: 0,
    experience: 0,
    resource: 0,
    alltime: 0,
    tickrate: 100,
    title: "mayor",
    currency: "₡",
    citylevel: 0,
    buildings: {},
    infrastructure: {}
  },
  getters: {
    resource(state) { return state.resource; },
    upgrades(state) { return upgrades; },
    basegain(state) { return bgain; },
    expgain(state) { return expgain(state); },
    expmult(state) { return expmult(state); },
    alltime(state) { return state.alltime; },
    resetresource(state) { return state.resetresource; },
    experience(state) { return state.experience; },
    resets(state) { return state.resets; },
    buildings(state) { return buildings; },
    infrastructure(state) { return infrastructure.filter(obj => obj.reqlevel <= state.citylevel)},
    infrastructurelevels(state) { return state.infrastructure; },
    buildinglevels(state) { return state.buildings; },
    tickrate(state) { return state.tickrate; },
    towntype(state) { return citynames[state.citylevel]; },
    nexttowntype(state) { return citynames[state.citylevel+1]; },
    cityupgradeable(state) { return cityupgradeable(state); },
    citylevel(state) { return state.citylevel; },
    currency(state) { return "₡"; },
    resettable(state) { return resettable(state); },
    title(state) { return state.title; },
    multiplier(state) {
      return resourcegain(state)[1];
    },
    resourcegain(state) {
      return resourcegain(state).reduce((a,b) => a*b);
    }
  },
  mutations: {
    initstore(state) {
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

        // offline ticks
        if(deserialize["time"] !== undefined) {
          // at most 25920000 ticks = 30 Days worth of offline time
          let ticks = Math.min(((new Date()).getTime()-deserialize["time"])/state.tickrate,25920000);
          const gain = resourcegain(state).reduce((a,b) => a*b);
          updateresources(state,ticks*gain);
        }
      }
    },
    startgame(state) {
      setInterval(() => {
        const gain = resourcegain(state).reduce((a,b) => a*b);
        updateresources(state, gain);
      }, state.tickrate);
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
      if(resettable(state)){
        state.resets += 1;
        state.experience += expgain(state);

        // Reset run specific stats
        state.buildings = {};
        state.infrastructure = {};
        state.resource = 0;
        state.resetresource = 0;

        // Reset buildings array
        Object.assign(buildings, JSON.parse(JSON.stringify(basebuildings)));
      }
      if(upgrade && cityupgradeable(state)){
        state.experience = 0;
        state.citylevel += 1;
      }
    },
    buybuilding(state, {building, count}) {
      if(state.buildings[building.name] === undefined)
        Vue.set(state.buildings, building.name, 0);
      for(let i=0;i<count;i++){
        const cost = building.cost.base*Math.pow(building.cost.rate,state.buildings[building.name]);
        if(cost < state.resource) {
          state.resource -= cost;
          state.buildings[building.name] += 1;
          upgrade(building.name, state.buildings[building.name]);
        }
      }
    },
    buyinfrastrucutre(state, {building, count}) {
      if(state.infrastructure[building.name] === undefined)
        Vue.set(state.infrastructure, building.name, 0);
      for(let i=0;i<count;i++){
        const cost = building.cost.base*Math.pow(building.cost.rate,state.infrastructure[building.name]);
        if(cost < state.resource) {
          state.resource -= cost;
          state.infrastructure[building.name] += 1;
        }
      }
    },
    hardreset(state) {
      // Hard Reset: Delete State
      localStorage.removeItem(storagename);
      // Reload page
      location.reload();
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
    softreset({commit}, payload) {
      commit('softreset', payload);
    }
  }
})
