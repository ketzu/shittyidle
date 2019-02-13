import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const basebuildings = [
  {name: "Farm", title: "Farm", type: "Generator", icon: "fa-apple-alt", cost: {base: 10, rate: 1.1}, gain: 0.1, mult: 1.00},
  {name: "Inn" , title: "Inn", type: "Generator", icon: "fa-beer", cost: {base: 1000, rate: 1.1}, gain: 100, mult: 1.00},
  {name: "Roads", title: "Roads", type: "Support", icon: "fa-road", cost: {base: 1000000, rate: 1.1}, gain: 0, mult: 1.02},
  {name: "Store", title: "Store", type: "Generator", icon: "fa-store-alt", cost: {base: 1000000, rate: 1.1}, gain: 10000, mult: 1.00},
  {name: "Bank", title: "Bank", type: "Generator", icon: "fa-university", cost: {base: 1000000000, rate: 1.1}, gain: 1000000, mult: 1.00},
  {name: "Public Transport" , title: "Public Transport", type: "Support", icon: "fa-bus-alt", cost: {base: 1000000000000, rate: 1.1}, gain: 0, mult: 1.03},
  {name: "Datacenter", title: "Datacenter", type: "Generator", icon: "fa-database", cost: {base: 1000000000000, rate: 1.1}, gain: 100000000, mult: 1.00},
  {name: "Factory", title: "Factory", type: "Generator", icon: "fa-industry", cost: {base: 1000000000000000, rate: 1.1}, gain: 10000000000, mult: 1.00}
];

let buildings = JSON.parse(JSON.stringify(basebuildings));

const upgrades = {
  Farm: {10: {gain: 0.2, title: "Faster Farm"}, 25: {gain: 0.5, title: "Efficient Farm"}},
  Inn:  {15: {gain: 150, title: "Tavern"}, 30: {gain: 250, title: "Bar"}},
  Roads: {50: {mult: 1.03, title: "Speedway"}, 100: {gain: 50000, title: "Toll Roads"}},
  Store: {10: {gain: 20000, title: "Shop"}, 25: {gain: 50000, title: "Mall"}},
  Bank: {20: {gain: 1700000, title: "Online bank"}, 25: {gain: 3000000, title: "Investment Bank"}},
  "Public Transport":  {25: {mult: 1.04, title: "Selfdriving Cars"}, 50: {gain: 1000000000, title: "Train station"}, 100: {gain: 1000000000, title: "Airport"}},
  Datacenter: {10: {gain: 200000000, title: "Social Networks"}, 25: {gain: 400000000, title: "Bitcoin Mining"}},
  Factory: {},
};

const upgrade = (buildingid, level) => {
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
    buybuilding(state, {building}) {
      if(state.buildings[building.name] === undefined)
        Vue.set(state.buildings, building.name, 0);
      state.resource -= building.cost.base*Math.pow(building.cost.rate,state.buildings[building.name]);
      state.buildings[building.name] += 1;
      upgrade(building.name, state.buildings[building.name]);
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
