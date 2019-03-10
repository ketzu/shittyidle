
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