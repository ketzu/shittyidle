import Vue from "vue";
import {evalGrid} from "../statics/grid";
import {zones} from "../statics/statics";
import {basebuildings} from "../statics/buildings";

const effectstrength = (value) => {
  if(value <3) return 0.05;
  if(value < 550) return 0.05+value/550*0.2;
  if(value<1500) return 0.25+value/1500*0.74;
  return 0.99+(0.01)*(1-(Math.pow(0.99,value)));
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

const updateGridResults = (state) => {
  const improvements = evalGrid(state.grid);
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

let root;

export default {
  state: {
    grid: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    configs: []
  },
  getters: {
    zones(state) {
      return zones;
    },
    gridconfigs(state) {
      return state.configs;
    },
    citygrid(state) {
      return state.grid;
    }
  },
  mutations: {
    initstore(state, vm) {
      root = vm;
      if(state.grid===undefined) {
        state.grid = [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0]
        ];
      }
      if(state.configs===undefined)
        state.configs = [];
    },
    startgame(state) {
      // reapply grid results
      updateGridResults(state);
    },
    buildzone(state, {x, y, zone}) {
      Vue.set(state.grid[x], y, zone);
      updateGridResults(state);
    },
    softreset(state) {
      state.configs = state.configs.filter((grid) => !sameGrid(grid,state.grid));
      state.configs.unshift(state.grid);
      if(state.configs.length > 3)
        state.configs.pop();
      state.grid = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
    }
  },
  actions: {
    softreset({commit}) {
      commit('softreset');
    },
    buildzone({state, commit, rootState}, payload) {
      commit('buildzone', payload);
      if(evalGrid(state.grid).some(value=>value>=500)){
        commit('achievement','zone');
      }
      if(evalGrid(state.grid).some(value=>value>=2399)){
        commit('achievement','zone2');
      }
    }
  }
};