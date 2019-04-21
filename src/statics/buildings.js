import Vue from "vue";

export const maxcount = 7000;

const bbcost = 10;
const costgrowth = 13;

export const bcost = {
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

export const bgain = {
  Farm: bbgain,
  Inn: Math.pow(gaingrowth,1)*bbgain,
  Store: Math.pow(gaingrowth,2)*bbgain,
  Bank: Math.pow(gaingrowth,3)*bbgain,
  Datacenter: Math.pow(gaingrowth,4)*bbgain,
  Factory: Math.pow(gaingrowth,5)*bbgain,
  Energy: Math.pow(gaingrowth,6)*bbgain,
  Casino: Math.pow(gaingrowth,7)*bbgain
};

export const translator = {
  "Farm": 0,
  "Inn": 1,
  "Store": 2,
  "Bank": 3,
  "Datacenter": 4,
  "Factory": 5,
  "Energy": 6,
  "Casino": 7
};

export const basebuildings = [
  {name: "Farm", title: "Farm", type: "Generator", icon: "fa-apple-alt", cost: {base: bcost['Farm'], rate: 1.1}, gain: bgain['Farm'], mult: 1.00, iconcolor: "red darken-2", width: 20, height: 20, mapcolor: '#D32F2F'},
  {name: "Inn" , title: "Inn", type: "Generator", icon: "fa-beer", cost: {base: bcost['Inn'], rate: 1.1}, gain: bgain['Inn'], mult: 1.00, iconcolor: "amber", width: 5, height: 5, mapcolor: '#FFC107'},
  {name: "Store", title: "Store", type: "Generator", icon: "fa-store-alt", cost: {base: bcost['Store'], rate: 1.1}, gain: bgain['Store'], mult: 1.00, iconcolor: "brown darken-3", width: 9, height: 5, mapcolor: '#FFC107'},
  {name: "Bank", title: "Bank", type: "Generator", icon: "fa-university", cost: {base: bcost['Bank'], rate: 1.1}, gain: bgain['Bank'], mult: 1.00, iconcolor: "grey darken-4", width: 4, height: 8, mapcolor: '#0D47A1'},
  {name: "Datacenter", title: "Datacenter", type: "Generator", icon: "fa-satellite-dish", cost: {base: bcost['Datacenter'], rate: 1.1}, gain: bgain['Datacenter'], mult: 1.00, iconcolor: "blue darken-4", width: 6, height: 9, mapcolor: '#0D47A1'},
  {name: "Factory", title: "Factory", type: "Generator", icon: "fa-industry", cost: {base: bcost['Factory'], rate: 1.1}, gain: bgain['Factory'], mult: 1.00, iconcolor: "teal darken-4", width: 11, height: 6, mapcolor: '#004D40'},
  {name: "Energy", title: "Power Plant", type: "Generator", icon: "fa-burn", cost: {base: bcost['Energy'], rate: 1.1}, gain: bgain['Energy'], mult: 1.00, iconcolor: "deep-orange", width: 7, height: 7, mapcolor: '#FF5722'},
  {name: "Casino", title: "Gambling Den", type: "Generator", icon: "fa-dice", cost: {base: bcost['Casino'], rate: 1.095}, gain: bgain['Casino'], mult: 1.00, iconcolor: "purple darken-2", width: 6, height: 12, mapcolor: '#7B1FA2'}
];

export const upgrades = {
  Farm: {
    25: {gain: 3, uname: "Crop Rotation", upgcost: 50},
    50: {gain: 5, uname: "Fertilizer", upgcost: 50},
    100:{gain: 15, uname: "Artificial Irrigation", title: "Advanced Farm", upgcost: 50},
    130: {gain:10, uname: "Plant Crossing", upgcost: 50},
    170: {gain:12, uname: "Mechanized Agriculture", title: "Automated Farm", upgcost: 50},
    200: {gain:18, uname: "Bio Farming", title: "Bio Farm", upgcost: 50}
  },
  Inn:  {
    30: {gain: 3, uname: "Happy Hour", upgcost: 50},
    60: {gain: 3, title: "Hotel", upgcost: 50},
    90: {gain: 12, uname: "Spa", upgcost: 50},
    120:{gain: 15, uname: "Minibar", upgcost: 50},
    150:{gain: 12, uname: "Rebranding", title: "Bar", upgcost: 50}
  },
  Store: {
    15: {gain: 4, uname: "Delivery Service", upgcost: 50},
    40: {gain: 4, title: "Market", upgcost: 50},
    80: {gain: 5, title: "Farmers Market", upgcost: 50},
    140: {gain:11, title: "Mall", uname: "Expansion", upgcost: 50}
  },
  Bank: {
    35: {gain: 5, uname: "Online banking", upgcost: 50},
    70: {gain: 8, title: "Loan Shark", upgcost: 50},
    105: {gain: 4, title: "Investment Bank", upgcost: 50},
    140: {gain: 9, uname: "Highspeed Trading", upgcost: 50},
    180: {gain: 13, uname: "Money Laundering", upgcost: 50}
  },
  Datacenter: {
    40: {gain: 4, title: "Bitcoin Mining", upgcost: 50},
    80: {gain: 7, title: "Social Networks", upgcost: 50},
    120: {gain:5, title: "Ad Tracking", upgcost: 50},
    160: {gain:9, title: "Smart Grid", upgcost: 50}
  },
  Factory: {
    10: {gain: 3, uname: "Outsourcing", upgcost: 50},
    40: {gain: 4, uname: "Automation", title: "Automatic Factory", upgcost: 50},
    80: {gain: 8, uname: "Self Replicating Goods", upgcost: 50}
  },
  Energy: {
    50: {gain: 3, uname: "Nuclear Reactor", upgcost: 50},
    90: {gain: 8, uname: "Renewable Energy", upgcost: 50}
  },
  Casino: {
    75: {gain: 2, title: "Casino", uname: "Gamling License", upgcost: 50},
    150: {gain: 4, title: "Las Vegas", uname: "Gambling Addiction", upgcost: 50}
  },
};

export const buildingCostOf = (level, amount, base, rate) => {
  const rexpl = Math.pow(rate, level);
  if(amount === 1)
    return base * rexpl;
  const rexpa = Math.pow(rate, amount);
  return base * rexpl * (rexpa  - 1) / (rate - 1);
};

export const buildingGain = (level, gain, mult, boni, infra) => {
  return level*gain*mult*(boni+1)*infra;
};

const allUpgrades = (building) => {
  let available = [];
  for (let key in upgrades[building]) {
    if (upgrades[building].hasOwnProperty(key)) {
      available.push(key);
    }
  }
  return available;
};

export const maxReached = (building, level) => {
  return !(allUpgrades(building).some(upg => upg>level));
};

export const buyableUpgrades = (building, level) => {
  return allUpgrades(building).filter(upg => upg<=level);
};

export const upgradesReached = (building, oldlevel, newlevel) => {
  return buyableUpgrades(building, newlevel).filter(upg => upg>oldlevel);
};

export const applyupgrade = (buildingid, level, state, root) => {
  if (state.upgrades[buildingid] === undefined)
    return false;
  if (state.upgrades[buildingid][level] === undefined)
    return false;
  let index = root.store_buildings.findIndex(element => element.name === buildingid);
  if (index === undefined)
    return false;
  // appli gain as a multiplier, not an overwrite
  let tempgain = root.store_buildings[index].gain * upgrades[buildingid][level].gain;
  Vue.set(root.store_buildings, index, {...root.store_buildings[index], ...upgrades[buildingid][level], gain: tempgain});
  return true;
};

export const applyallupgrades = (building, level, state, root) => {
  for (let key in upgrades[building]) {
    if (upgrades[building].hasOwnProperty(key)) {
      if (level >= key) {
        applyupgrade(building, key, state, root);
      }
    }
  }
};

export const affecting = (building, inflevels, root) => {
  let mult = 1;
  for (let infra of root.store_infrastructure.filter(inf => inf.affected.includes(building.name))) {
    if (inflevels[infra.name] !== undefined)
      mult *= Math.pow(infra.basemult, inflevels[infra.name]);
  }
  return mult;
};

export const upgradeable = (name, level, boughtUpgrades) => {
// are there upgrades in buyableUpgrades that are not in boughtUpgrades
  for (let key of buyableUpgrades(name, level)) {
    if (boughtUpgrades === undefined) {
      return true;
    } else if (boughtUpgrades[key] === undefined) {
      return true;
    }
  }
  return false;
};