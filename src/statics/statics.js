import Vue from 'vue'
import {bgain} from "./buildings";
export const storagename = 'cidle-v1';

export const baseinfrastructure = [
  {name: "Roads", title: "Roads", icon: "fa-road", reqlevel: 1, basemult: 1.015, affected: ['Farm', 'Store', 'Factory'], cost: {base: Math.pow(10,5), rate: 1.1}, iconcolor: "teal darken-4"},
  {name: "Electricity" , title: "Electricity Grid", icon: "fa-plug", reqlevel: 1, basemult: 1.025, affected: ['Energy', 'Datacenter', 'Bank'], cost: {base: Math.pow(10,8), rate: 1.1}, iconcolor: "deep-orange"},
  {name: "Transport", title: "Public Transport", icon: "fa-bus-alt", reqlevel: 1, basemult: 1.04, affected: ['Casino', 'Inn'], cost: {base: Math.pow(10,11), rate: 1.1}, iconcolor: "red darken-4"},
  {name: "Lighting", title: "Lighting", icon: "fa-lightbulb", reqlevel: 2, basemult: 1.04, affected: ['Farm', 'Inn', 'Store'], cost: {base: Math.pow(10,18), rate: 1.1}, iconcolor: "amber"},
  {name: "University", title: "University", icon: "fa-graduation-cap ", reqlevel: 2, basemult: 1.02, affected: ['Factory', 'Datacenter', 'Energy'], cost: {base: Math.pow(10,23), rate: 1.1}, iconcolor: "brown darken-3"},
  {name: "Airport", title: "Airport", icon: "fa-plane-departure ", reqlevel: 3, basemult: 1.02, affected: [], cost: {base: Math.pow(10,30), rate: 1.1}, iconcolor: "purple darken-2"},
  {name: "Internet", title: "Internet", icon: "fa-wifi", reqlevel: 3, basemult: 1.02, affected: [], cost: {base: Math.pow(10,40), rate: 1.1}, iconcolor: "grey darken-4"}
];

export const research = [
  {citylevel: 2, title: "Material Science", cost: 1000, options: [
      {name: "Better Roads", icon: "cat ", iconcolor: "red darken-3", modification: (state,root) => { root.store_infrastructure[0].basemult=1.025 }, desc: "Increase the multiplier of roads to 2.5% (from 1.5%)."},
      {name: "Roads to more Buildings", icon: "cat ", iconcolor: "blue darken-3", modification: (state,root) => { root.store_infrastructure[0].affected = ['Farm', 'Store', 'Factory', 'Inn', 'Casino', 'Bank'] }, desc: "Make roads affect all buildings, besides power plants and datacenters."},
      {name: "Cheaper Roads", icon: "cat ", iconcolor: "green darken-3", modification: (state,root) => { root.store_infrastructure[0].cost.rate=1.09 }, desc: "Reduce cost increase of roads from 10% to 9%."}
    ]},
  {citylevel: 2, title: "Electrical Engineering", cost: 50000, options: [
      {name: "Improved Grid", icon: "cat ", iconcolor: "red darken-3", modification: (state,root) => { root.store_infrastructure[1].basemult=1.035 }, desc: "Increase the multiplier of electricity to 3.5% (from 2.5%)."},
      {name: "Overclock Buildings", icon: "cat ", iconcolor: "blue darken-3", modification: (state,root) => { Vue.set(root,'store_buildings',root.store_buildings.map(building => { return ({ ...building, mult:40});})); }, desc: "Improve production of all buildings."},
      {name: "Outsource Grid Maintenance", icon: "cat ", iconcolor: "green darken-3", modification: (state,root) => { root.store_infrastructure[1].cost.rate=1.09 }, desc: "Reduce cost increase of electricity from 10% to 9%."}
    ]},
  {citylevel: 2, title: "Psychology", cost: 200000, options: [
      {name: "Motivational Speeches", icon: "cat ", iconcolor: "red darken-3", modification: (state,root) => { root.store_infrastructure[2].basemult=1.045 }, desc: "Increase the multiplier of transport to 4.5% (from 4%)."},
      {name: "Peace of Mind", icon: "cat ", iconcolor: "blue darken-3", modification: (state,root) => { Vue.set(root,'store_buildings',root.store_buildings.map(building => { return {name: building.name, title: "The same", icon: "fa-cat", cost: {base: bcost['Farm'], rate: 1.1}, gain: bgain['Casino'], mult: building.mult, iconcolor: building.iconcolor} })); }, desc: "Everything is the same."},
      {name: "Layoff Coaching", icon: "cat ", iconcolor: "green darken-3", modification: (state,root) => { root.store_infrastructure[2].cost.rate=1.09 }, desc: "Reduce cost increase of transport from 10% to 9%."}
    ]},
  {citylevel: 2, title: "Civil Engineering", cost: 500000, options: [
      {name: "Add Street Lamps", icon: "cat ", iconcolor: "red darken-3", modification: (state,root) => { root.store_infrastructure[3].basemult=1.045 }, desc: "Increase the multiplier of lighting to 4.5% (from 4%)."},
      {name: "Gambling Addiction", icon: "cat ", iconcolor: "blue darken-3", modification: (state,root) => { if(!state.buildings.boni.some(boni => boni!==0)) Vue.set(state.buildings,'boni', state.buildings.boni.map(boni => (Math.min(-Math.log(Math.random())*6,1000)+4))) }, desc: "Improve your buildings by a random factor until you change your job."},
      {name: "Remove Street Lamps", icon: "cat ", iconcolor: "green darken-3", modification: (state,root) => { root.store_infrastructure[3].cost.rate=1.09 }, desc: "Reduce cost increase of lighting from 10% to 9%."}
    ]},
  {citylevel: 2, title: "Educational Science", cost: 1000000, options: [
      {name: "Pay Teachers more", icon: "cat ", iconcolor: "red darken-3", modification: (state,root) => { root.store_infrastructure[4].basemult=1.04 }, desc: "Increase the multiplier of university to 4% (from 2%)."},
      {name: "Resumé Course", icon: "cat ", iconcolor: "blue darken-3", modification: (state,root) => { state.expchange = 1;}, desc: "Increase experience boost."},
      {name: "Prohibit Strikes", icon: "cat ", iconcolor: "green darken-3", modification: (state,root) => { root.store_infrastructure[4].cost.rate=1.09 }, desc: "Reduce cost increase of university from 10% to 9%."}
    ]}
];

export const zones = [
  {name: 'Free', color: 'green darken-4', icons: ['']},
  {name: 'Comercial', color: 'blue darken-4', icons: ['fas fa-glass-martini ','fas fa-beer','fas fa-hotel'], strong: "Stores and Banks", weak :"Inn and Powerplant."},
  {name: 'Residential', color: 'light-green darken-2', icons: ['fas fa-home', 'fas fa-building', 'fas fa-place-of-worship'], strong: "Inn and Casino", weak: "Store and Factory."},
  {name: 'Industrial', color: 'yellow accent-4', icons: ['fas fa-industry', 'fas fa-warehouse'], strong: "Factory and Energy", weak: "Bank and Casino."}
];

export const achievements = {
  beginner: {desc: "Change your job once.", title: "Beginner", icon: "fas fa-cat", iconcolor: "orange accent-4", mult: 0.05},
  advancer: {desc: "Get promoted.", title: "Advancer", icon: "fas fa-cat", iconcolor: "blue-grey lighten-2", mult: 0.05},
  prof: {desc: "Get another promotion.", title: "Professional", icon: "fas fa-cat", iconcolor: "amber", mult: 0.05},
  workfun: {desc: "Get a new job with only Farms and Casinos.", title: "Work hard and play hard", icon: "fas fa-dice", iconcolor: "red darken-2", mult: 0.1},
  upgrades: {desc: "Get a new job without buying any building upgrades.", title: "Nerfs make for good achievements", icon: "fas fa-upload", iconcolor: "light-blue darken-3", buildingboni: "Autoupgrades unlocked.", mult: 0},
  zone: {desc: "Reach a zoning value of over 500 for one type.", title: "In the zone", icon: "fas fa-object-group", iconcolor: "purple darken-4", mult: 0.5},
  zone2: {desc: "Reach a zoning value of over 2399 for one type.", title: "Twilight zone", icon: "fas fa-object-group", iconcolor: "green accent-4", mult: 1}
};