import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

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
  {name: "Farm", title: "Farm", type: "Generator", icon: "fa-apple-alt", cost: {base: bcost['Farm'], rate: 1.1}, gain: bgain['Farm'], mult: 1.00},
  {name: "Inn" , title: "Inn", type: "Generator", icon: "fa-beer", cost: {base: bcost['Inn'], rate: 1.1}, gain: bgain['Inn'], mult: 1.00},
  {name: "Store", title: "Store", type: "Generator", icon: "fa-store-alt", cost: {base: bcost['Store'], rate: 1.1}, gain: bgain['Store'], mult: 1.00},
  {name: "Bank", title: "Bank", type: "Generator", icon: "fa-university", cost: {base: bcost['Bank'], rate: 1.1}, gain: bgain['Bank'], mult: 1.00},
  {name: "Datacenter", title: "Datacenter", type: "Generator", icon: "fa-database", cost: {base: bcost['Datacenter'], rate: 1.1}, gain: bgain['Datacenter'], mult: 1.00},
  {name: "Factory", title: "Factory", type: "Generator", icon: "fa-industry", cost: {base: bcost['Factory'], rate: 1.1}, gain: bgain['Factory'], mult: 1.00},
  {name: "Energy", title: "Coal Plant", type: "Generator", icon: "fa-burn", cost: {base: bcost['Energy'], rate: 1.1}, gain: bgain['Energy'], mult: 1.00},
  {name: "Casino", title: "Gambling Den", type: "Generator", icon: "fa-dice", cost: {base: bcost['Casino'], rate: 1.1}, gain: bgain['Casino'], mult: 1.00}
];

let buildings = JSON.parse(JSON.stringify(basebuildings));

const upgrades = {
  Farm: {25: {gain: 3*bgain['Farm'], title: "Efficient Farm"}, 100: {gain: 15*bgain['Farm'], title: "Automated Farm"}},
  Inn:  {30: {gain: 4*bgain['Inn'], title: "Tavern"}, 60: {gain: 12*bgain['Inn'], title: "Bar"}},
  Store: {15: {gain: 2*bgain['Store'], title: "Shop"}, 40: {gain: 4*bgain['Store'], title: "Market"}, 80: {gain: 8*bgain['Store'], title: "Mall"}},
  Bank: {35: {gain: 4*bgain['Bank'], title: "Online bank"}, 70: {gain: 8*bgain['Bank'], title: "Investment Bank"}},
  Datacenter: {40: {gain: 4*bgain['Datacenter'], title: "Social Networks"}, 50: {gain: 7*bgain['Datacenter'], title: "Bitcoin Mining"}},
  Factory: {10: {gain: 3*bgain['Factory'], title: "Outsourcing"}, 80: {gain: 8*bgain['Factory'], title: "Automatic Factory"}},
  Energy: {50: {gain: 3*bgain['Energy'], title: "Atomic Reactor"}, 90: {gain: 8*bgain['Energy'], title: "Renewable Energy"}},
  Casino: {100: {gain: 2*bgain['Casino'], title: "Casino"}, 200: {gain: 4*bgain['Casino'], title: "Las Vegas"}},
};

const upgrade = (buildingid, level) => {
  if(upgrades[buildingid] === undefined)
    return;
  if(upgrades[buildingid][level] === undefined)
    return;
  let index = buildings.findIndex(element => element.name === buildingid);
  if(index === undefined)
    return;
  buildings[index] = {...buildings[index], ...upgrades[buildingid][level]};
};

const allupgrades = (buildingid, level) => {
  for(let i = 0; i <= level; i++) {
    upgrade(buildingid, i);
  }
};

const resourcegain = (state) => {
  // base generation
  let gain = 0.1;
  let multiplier = 1;
  for(let current of buildings) {
    let level = state.buildings[current['name']];
    if(level === undefined)
      continue;
    multiplier *= Math.pow(current.mult,level);
    gain += current.gain * level;
  }
  return [gain,multiplier];
};

export default new Vuex.Store({
  state: {
    resource: 0,
    alltime: 0,
    tickrate: 100,
    towntype: "village",
    title: "mayor",
    currency: "€",
    buildings: {}
  },
  getters: {
    resource(state) { return state.resource; },
    alltime(state) { return state.alltime; },
    buildings(state) { return buildings; },
    buildinglevels(state) { return state.buildings; },
    tickrate(state) { return state.tickrate; },
    towntype(state) { return state.towntype; },
    currency(state) { return state.currency; },
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
      if (localStorage.getItem('igame-v1')) {
        let deserialize = JSON.parse(localStorage.getItem('igame-v1'));
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
          state.resource += ticks*gain;
          state.alltime += ticks*gain;
        }
      }
    },
    startgame(state) {
      setInterval(() => {
        const gain = resourcegain(state).reduce((a,b) => a*b);
        state.resource += gain;
        state.alltime += gain;
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
    hardreset(state) {
      // Hard Reset State to initial values
      this.replaceState(
        Object.assign(state, {
          resource: 0,
          alltime: 0,
          tickrate: 100,
          towntype: "village",
          title: "mayor",
          currency: "€",
          buildings: {}
        })
      );
      Object.assign(buildings, JSON.parse(JSON.stringify(basebuildings)));
    }
  },
  actions: {
    updateresource({commit}, payload) {
      commit('updateresource', payload);
    },
    spendresource({commit}, payload) {
      commit('spendresource', payload);
    },
    settownspecs({commit}, payload) {
      commit('settownspecs', payload);
    },
    buybuilding({commit}, payload) {
      commit('buybuilding', payload);
    }
  }
})
