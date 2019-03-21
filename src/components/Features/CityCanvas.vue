<template>
  <div ref="pdiv" style="width: 100%;">
    <canvas ref="canv"></canvas>
  </div>
</template>

<script>
  import {basebuildings} from "../../statics/buildings";

  const gen_prng = (seed) => {
    let value = seed;
    return () => {
      return value = (value * 1103515245 + 12345) % Math.pow(2, 31);
    };
  };

  const gen_field = (dimension) => {
    if (dimension <= 1) return;
    let f = [];
    for (let x = 0; x < dimension; x += 1) {
      f[x] = new Array(dimension);
      for (let y = 0; y < dimension; y += 1) {
        f[x][y] = 0;
      }
    }
    return f;
  };

  const has_space = (field, x, y, w, h) => {
    // should never happen, let's keep it for now
    if (x + w >= field.length)
      return false;
    if (y + h >= field.length)
      return false;
    for (let a = 0; a < w; a += 1) {
      for (let b = 0; b < h; b += 1) {
        if (field[a + x][b + y] !== 0)
          return false;
      }
    }
    return true;
  };

  const place = (field, bnr, randomness) => {
    let prng = gen_prng(randomness);
    const b = basebuildings[bnr - 1];
    for (let cntdwn = 10; cntdwn > 0; cntdwn -= 1) {
      const x = (prng() % (field.length - b.width - 2)) + 1;
      const y = (prng() % (field.length - b.height - 2)) + 1;
      if (has_space(field, x, y, b.width, b.height)) {
        for (let w = 0; w < b.width; w += 1) {
          for (let h = 0; h < b.height; h += 1) {
            field[x + w][y + h] = bnr;
          }
        }
        buildroad(field, x + (b.width / 2), y + (b.height / 2));
        return;
      }
    }
  };

  const placeroad = (field, x, y, tx, ty) => {
    // move to open field
    const origin = field[x][y];
    let dir = 0;
    while (field[x][y] === origin) {
      if (Math.abs(tx - x) > Math.abs(ty - y)) {
        if (x < tx) {x += 1; dir=1;}
        if (x > tx) {x -= 1; dir=2;}
      } else {
        if (y < ty) {y += 1; dir=3;}
        if (y > ty) {y -= 1; dir=4;}
      }
    }
    // is there another building in the way?
    while(field[x][y] !== 0) {
      switch(dir) {
        case 2:
        case 1: y=(() => {
          for(let t=1; true; t+=1) {
            if(field[x+1][y+t] !== origin
              && field[x+1][y-t] !== origin
              && field[x-1][y+t] !== origin
              && field[x-1][y-t] !== origin)
              return -1;
            if(field[x][y+t]===0) return y+t;
            if(field[x][y-t]===0) return y-t;
          }
        })(); break;
        case 3:
        case 4: x=(() => {
          for(let t=1; true; t+=1) {
            if(field[x+t][y+1] !== origin
              && field[x+t][y-1] !== origin
              && field[x-t][y+1] !== origin
              && field[x-t][y-1] !== origin)
              return -1;
            if(field[x+t][y]===0) return x+t;
            if(field[x-t][y]===0) return x-t;
          }
        })();
      }
      // cannot be placed, we don't care anymore
      if(x===-1 || y===-1) return;
    }
    // build path now
    const recplace = (field, x, y, tx, ty) => {
      if(x===tx && y===ty) return true;
      // current field blocked: refuse
      if(field[x][y]>0) return false;
      // crossed another path: done
      if(field[x][y]<0) return true;
      let xdir = x<tx?1:-1;
      let ydir = y<ty?1:-1;
      if(x!==tx){
        if(recplace(field,x+xdir,y,tx,ty)){
          field[x][y] = -1;
          return true;
        }
      }else if(y!==ty){
        if(recplace(field,x,y+ydir,tx,ty) && y!==ty){
          field[x][y] = -1;
          return true;
        }
      }
      return false;
    };
    if(recplace(field,x,y,tx,ty))
      field[x][y] = -1;
    else
      console.log("failed");
  };

  const buildroad = (field, x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    // find closest road or edge
    let closestedge = Math.min(x, y, field.length - x, field.length - y);

    // range to check for road
    const range_s = x - closestedge;
    const range_e = x + closestedge + 1;
    let mincoord = [-1, -1];
    // distance metric
    const dist = (a, b) => {
      const d1 = Math.abs(x - a[0]) + Math.abs(y - a[1]);
      const d2 = Math.abs(x - b[0]) + Math.abs(y - b[1]);
      return d1 > d2;
    };
    // check all fields
    for (let a = y - closestedge; a < y + closestedge; a += 1) {
      for (let b = range_s; b < range_e; b += 1) {
        if (field[a][b] === -1) {
          if (dist(mincoord, [a, b])) {
            mincoord[0] = a;
            mincoord[1] = b;
          }
        }
      }
    }

    if (mincoord[0] === -1) {
      if (x === closestedge) {
        mincoord = [0, y];
      } else if (y === closestedge) {
        mincoord = [x, 0];
      } else if (x + closestedge === field.length) {
        mincoord = [250, y];
      } else {
        mincoord = [x, 250];
      }
    }
    placeroad(field, x, y, mincoord[0], mincoord[1]);
  };

  const comp_field = (store) => {
    // field we are building
    let field = gen_field(250);

    // Building stuff
    const blevels = store.getters.buildinglevels;
    const infra = store.getters.infrastructurelevels;

    // generating a deterministic field
    const prng = gen_prng(store.getters.timeall);

    // build streets if infrastracture is available
    /*
    Blub blub blub
    */

    let bid = 1;
    for (const b of basebuildings) {
      for (let i = 1; i < 7000; i *= 1.2) {
        const r = prng();
        if (i > blevels[b.name])
          continue;
        place(field, bid, r);
      }
      bid += 1;
    }

    return field;
  };

  const paint = (canvas, ctx, parent, store) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.width, ctx.height);

    const width = parent.clientWidth;
    // make size appropriate
    if (parent !== null) {
      ctx.width = width;
      ctx.height = width;
      canvas.width = width;
      canvas.height = width;
    }

    // draw background
    const infra = store.getters.infrastructurelevels;
    // if we have roads in any way, get surrounding road
    if (infra['Roads'] > 0) {
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#757575";
    } else {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "white";
    }
    ctx.fillStyle = "#2e7d32";
    ctx.beginPath();
    ctx.rect(0, 0, ctx.width, ctx.height);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 1;

    // zone sizes
    const grid = store.getters.citygrid;
    const wsep = ctx.width / grid.length;
    const hsep = ctx.height / grid.length;
    // paint zone lines
    /*for(let x=0; x<grid.length; x+=1) {
      for(let y=0; y<grid.length; y+=1) {
        ctx.beginPath();
        ctx.rect(x*wsep, y*hsep, wsep, hsep);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }*/

    const field = comp_field(store);
    const unit = width / field.length;
    // color of buildingfields
    let x = 0;
    let y = 0;
    for (let row of field) {
      for (let e of row) {
        x += unit;
        if (e === 0)
          continue;
        if (e > 0) {
          const b = basebuildings[e - 1];
          ctx.strokeStyle = b.mapcolor;
          ctx.fillStyle = '#616161';
          ctx.beginPath();
          ctx.rect(x, y, unit, unit);
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
        } else {
          ctx.fillStyle = '#5D4037';
          ctx.beginPath();
          ctx.rect(x, y, unit, unit);
          ctx.fill();
          ctx.closePath();
        }
      }
      y += unit;
      x = 1;
    }
  };

  export default {
    name: "CityCanvas",
    mounted() {
      const canvas = this.$refs.canv;
      const parent = this.$refs.pdiv;
      const ctx = canvas.getContext("2d");

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      const store = this.$store;

      window.requestAnimationFrame(() => paint(canvas, ctx, parent, store));

      window.addEventListener("resize", () => paint(canvas, ctx, parent, store));
    }
  }
</script>

<style scoped>

</style>