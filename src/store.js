import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const buildings = [
  {name: "Farm", type: "Generator", icon: "fa-apple-alt", cost: {base: 10, rate: 1.1}, gain: 1},
  {name: "Inn", type: "Generator", icon: "fa-beer", cost: {base: 1000, rate: 1.1}, gain: 100},
  {name: "Roads", type: "Support", icon: "fa-road", cost: {base: 1000000, rate: 1.1}, gain: 1.02},
  {name: "Store", type: "Generator", icon: "fa-store-alt", cost: {base: 1000000, rate: 1.1}, gain: 10000},
  {name: "Bank", type: "Generator", icon: "fa-university", cost: {base: 1000000000, rate: 1.1}, gain: 1000000},
  {name: "Public Transport", type: "Support", icon: "fa-bus-alt", cost: {base: 1000000000000, rate: 1.1}, gain: 1.03},
  {name: "Datacenter", type: "Generator", icon: "fa-database", cost: {base: 1000000000000, rate: 1.1}, gain: 100000000},
  {name: "Factory", type: "Generator", icon: "fa-industry", cost: {base: 1000000000000000, rate: 1.1}, gain: 10000000000}
];

const resourcegain = (state) => {
  // base generation
  let gain = 1;
  let multiplier = 1;
  for(let current of buildings) {
    let level = state.buildings[current['name']];
    if(level === undefined)
      continue;
    switch(current.type) {
      case "Support":
        multiplier *= Math.pow(current.gain,level);
        break;
      case "Generator":
        gain += current.gain * level;
        break;
      default:
        console.log("Default case triggered for: "+name);
        break;
    }
  }
  return [gain,multiplier];
};

export default new Vuex.Store({
  state: {
    resource: 0,
    tickrate: 100,
    towntype: "Village",
    title: "Mayor",
    currency: "€",
    buildings: {}
  },
  getters: {
    resource(state) { return state.resource; },
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
        // Replace the state object with the stored item
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('igame-v1')))
        );
      }
    },
    startgame(state) {
      setInterval(() => {
        state.resource += resourcegain(state).reduce((a,b) => a*b);
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
    },
    hardreset(state) {
      // Hard Reset State to initial values
      this.replaceState(
        Object.assign(state, {
          resource: 0,
          tickrate: 100,
          towntype: "Village",
          title: "Mayor",
          currency: "€",
          buildings: {}
        })
      );
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
