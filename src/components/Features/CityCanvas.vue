<template>
  <div ref="pdiv" style="width: 100%;">
    <canvas ref="canv"></canvas>
  </div>
</template>

<script>
  import {basebuildings} from "@/statics/buildings";

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
        if (field[a + x][b + y] !== 0 && field[a + x][b + y] !== 2017)
          return false;
      }
    }
    return true;
  };

  const place = (field, bnr, randomness, grid) => {
    let prng = gen_prng(randomness);
    const b = basebuildings[bnr - 1];
    const pref = b.zonepref;
    const zonesize = field.length / grid.length;
    // no suitable zone found, try placing anywhere
    for (let cntdwn = 10; cntdwn > 0; cntdwn -= 1) {
      const x = (prng() % (field.length - b.width - 2)) + 1;
      const y = (prng() % (field.length - b.height - 2)) + 1;
      if (has_space(field, x, y, b.width, b.height)) {
        // place road
        buildroad(field, x + (b.width / 2), y + (b.height / 2));
        // place building, overwrites road
        for (let w = 0; w < b.width; w += 1) {
          for (let h = 0; h < b.height; h += 1) {
            field[x + w][y + h] = bnr;
          }
        }
        return;
      }
    }
  };

  const placeroad = (field, x, y, tx, ty) => {
    let count = 0;
    const id = ({x, y}) => {
      return x * field.length + y;
    };
    let visited = new Set();
    let queue = [];
    // add first node
    queue.push({x: x, y: y, path: []});
    visited.add(id({x: x, y: y}));

    while (queue.length > 0) {
      // emergency break
      count += 1;
      if (count > 70000) break;

      // actual algorithm
      let current = queue.shift();

      // generate successors
      for (let dir of [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}]) {
        let node = {x: current.x + dir.x, y: current.y + dir.y, path: [...current.path, {x: current.x, y: current.y}]};
        // check if node is out of bounds
        if (node.x >= field.length || node.x < 0 || node.y >= field.length || node.y < 0)
          continue;
        // check if node is an obstacle or has been visited
        if ((field[node.x][node.y] > 0 && field[node.x][node.y] < 100) || visited.has(id(node)))
          continue;
        // check if goal is reached or other path met
        if (node.x === tx && node.y === ty || field[node.x][node.y] < 0) {
          for (let p of current.path) {
            field[p.x][p.y] = -1;
          }
          field[current.x][current.y] = -1;
          return;
        }
        visited.add(id(node));
        queue.push(node);
      }
    }
  };

  const buildroad = (field, x, y) => {
    // starting coordinates
    x = Math.floor(x);
    y = Math.floor(y);

    // output variables
    let nx = 0;
    let ny = 0;

    // temporary spiral variables
    let tx = 0;
    let ty = 0;
    let dx = 0;
    let dy = -1;
    // this is a for loop in the form of a spiral, that will end if we touch an edge or a road
    while (true) {
      if (x + tx <= 0 || x + tx >= field.length - 1) {
        // touching x edge
        nx = x + tx;
        ny = y;
        break;
      } else if (y + ty >= field.length - 1 || y + ty <= 0) {
        // touching y edge
        nx = x;
        ny = y + ty;
        break;
      }
      if (field[x + tx][y + ty] < 0) {
        // touching road
        nx = x + tx;
        ny = y + ty;
        break;
      }
      if (tx === ty || (tx < 0 && tx == -ty) || (tx > 0 && tx == 1 - ty)) {
        dx = [-dy, dy = dx][0];
      }
      tx = tx + dx;
      ty = ty + dy;
    }

    // actually place road from x,y to nx,ny
    placeroad(field, x, y, nx, ny);
  };

  const paint = (canvas, ctx, parent, store, field, dopaint) => {
    if (dopaint === false) return;
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
      ctx.strokeStyle = "#455A64";
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

    const unit = width / field.length;

    // add some trees
    ctx.strokeStyle = "#1B5E20";
    ctx.fillStyle = "#1B5E20";
    let local_prng = gen_prng(2017 * store.getters.timereset);
    const treeamount = 1000 + (local_prng() % 500);
    let ox = 0;
    let oy = 0;
    for (let t = 0; t < treeamount; t += 1) {
      let cords = local_prng();
      ox += cords % (field.length - 2) + 1;
      oy += Math.floor(cords / (field.length - 2));
      ox = ox % (field.length - 2) + 1;
      oy = oy % (field.length - 2) + 1;

      ctx.beginPath();
      ctx.rect(ox * unit, oy * unit, unit, unit);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }

    // color of buildingfields
    let x = 0;
    let y = 0;
    for (let _x = 0; _x < field.length; _x += 1) {
      let row = field[_x];
      for (let _y = 0; _y < field.length; _y += 1) {
        let e = row[_y];
        x += unit;
        if (e === 0 || e === 100)
          continue;
        if (e > 0) {
          // only paint from top left corner
          if (x > 0 && y > 0) {
            if (field[_x - 1][_y] === e || field[_x][_y - 1] === e)
              continue;
          } else {

          }
          let b;
          if (e < 10) {
            b = basebuildings[e - 1];
          } else {
            if (e === 50) {
              // living house
              b = {height: 2, width: 2, mapcolor: "#212121"}
            } else if (e === 2017) {
              // tree
              b = {height: 1, width: 1, mapcolor: "#1B5E20"}
            }
          }
          ctx.beginPath();
          // i don't know why height and width are the wrong way.
          ctx.rect(x, y, unit * b.height, unit * b.width);
          ctx.strokeStyle = b.mapcolor;
          switch (b.name) {
            case "Farm":
              ctx.fillStyle = '#689F38';
              break;
            default:
              //ctx.fillStyle = '#616161';
              ctx.fillStyle = b.mapcolor;
              ctx.stroke();
          }
          ctx.fill();
          ctx.closePath();
        } else {
          if (e === -2) {
            ctx.strokeStyle = "#455A64";
            ctx.fillStyle = '#455A64';
          } else {
            if (infra['Roads'] > 100) {
              ctx.strokeStyle = "#757575";
              ctx.fillStyle = '#757575';
            } else {
              ctx.fillStyle = '#5D4037';
              ctx.strokeStyle = '#5D4037';
            }
          }
          ctx.beginPath();
          ctx.rect(x, y, unit, unit);
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
        }
      }
      y += unit;
      x = 1;
    }
  };

  export default {
    name: "CityCanvas",
    props: ['tabs'],
    data() {
      return {
        field: undefined,
        rands: undefined,
        currstate: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        shortpaint: undefined,
        dopaint: true
      }
    },
    watch: {
      tabs(newVal, oldVal) {
        if (newVal === 0) {
          this.dopaint = true;
          window.setTimeout(this.shortpaint, 1000);
        } else {
          this.dopaint = false;
        }
      }
    },
    methods: {
      comp_field() {
        // field we are building
        let field = gen_field(250);

        // build streets if infrastracture is available
        this.update_infrastructure(field);

        // build buildings
        this.update_building(field);

        return field;
      },
      update_building(field) {
        const blevels = this.$store.getters.buildinglevels;
        let levelsum = 0;
        // add functional buildings
        for (let bid = 0; bid < basebuildings.length; bid += 1) {
          const b = basebuildings[bid];
          levelsum += blevels[b.name];
          for (let t = this.currstate[bid]; t < this.rands[bid].length; t += 1) {
            const r = this.rands[bid][t];
            if (r[0] > blevels[b.name] || blevels[b.name] === undefined) {
              this.currstate[bid] = t;
              break;
            }
            place(field, bid + 1, r[1], this.$store.getters.citygrid);
          }
        }

        const has_roadaccess = (field, x, y) => {
          return ([[x - 1, y], [x - 1, y + 1], [x, y - 1], [x + 1, y - 1], [x + 2, y], [x + 2, y + 1], [x, y + 2], [x + 1, y + 2]].some((value) => {
            if (value[0] < 0 || value[0] > field.length || value[1] < 0 || value[1] > field.length)
              return false;
            if (field[value[0]][value[1]] < 0)
              return true;
          }));
        };

        // add residential only buildings
        let prng = gen_prng(1453 * this.$store.getters.timereset);
        for (let i = this.currstate[8]; i < levelsum; i += 1) {
          // try ten times to place a building
          for (let cntdwn = 100; cntdwn > 0; cntdwn -= 1) {
            const x = (prng() % (field.length - 2 - 2)) + 1;
            const y = (prng() % (field.length - 2 - 2)) + 1;
            if (has_space(field, x, y, 2, 2) && has_roadaccess(field, x, y)) {
              // place building, overwrites road
              for (let w = 0; w < 2; w += 1) {
                for (let h = 0; h < 2; h += 1) {
                  field[x + w][y + h] = 50;
                }
              }
              continue;
            }
          }
        }
        this.currstate[8] = levelsum;
        return field;
      },
      update_infrastructure(field) {
        const infra = this.$store.getters.infrastructurelevels;
        let placeholder = 100;
        if (infra['Roads'] >= 300) {
          placeholder = -2
        } else {
          placeholder = 100;
        }
        for (let x = 0; x < field.length; x += 1) {
          let mid2 = Math.floor(field.length / 4);
          field[x][mid2] = placeholder;
          field[x][field.length - mid2] = placeholder;
          field[mid2][x] = placeholder;
          field[field.length - mid2][x] = placeholder;
        }
        if (infra['Roads'] >= 10) {
          placeholder = -2
        } else {
          placeholder = 100;
        }
        for (let x = 0; x < field.length; x += 1) {
          let middle = Math.floor(field.length / 2);
          field[x][middle] = placeholder;
          field[middle][x] = placeholder;
        }
        if (infra['Roads'] > 0) {
          placeholder = -2;
        } else {
          placeholder = 100;
        }
        for (let x = 0; x < field.length; x += 1) {
          field[x][0] = placeholder;
          field[x][field.length - 1] = placeholder;
          field[0][x] = placeholder;
          field[field.length - 1][x] = placeholder;
        }
        return field;
      },
      prerand() {
        // generating a deterministic field
        const prng = gen_prng(this.$store.getters.timereset);

        this.rands = [];
        for (let a = 0; a < basebuildings.length; a += 1) {
          this.rands.push([]);
          for (let i = 1; i < 7000; i *= 1.6) {
            this.rands[a].push([i, prng()]);
          }
        }
      }
    },
    mounted() {
      this.prerand();

      this.field = this.comp_field();

      const canvas = this.$refs.canv;
      const parent = this.$refs.pdiv;
      const ctx = canvas.getContext("2d");

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      const store = this.$store;

      this.shortpaint = () => paint(canvas, ctx, parent, store, this.field, this.dopaint);
      this.bus.$on('drawcityon', () => {
        window.requestAnimationFrame(() => this.shortpaint());
        window.addEventListener("resize", this.shortpaint);
      });
      this.bus.$on('drawcityoff', () => {
        canvas.removeEventListener('resize', this.shortpaint);
      });

      if (this.$store.getters.drawcity) {
        window.requestAnimationFrame(() => this.shortpaint());
        window.addEventListener("resize", this.shortpaint);
      }

      store.subscribe((mutation, state) => {
        if (!state.settings.drawcity)
          return;
        if (mutation.type === "updatebuilding") {
          this.field = this.update_building(this.field, state.buildings.levels, this.rands);
        } else if (mutation.type === 'updateinfrastructure') {
          this.field = this.update_infrastructure(this.field, state.infrastructure, this.rands);
        } else if (mutation.type === 'softreset') {
          this.field = this.comp_field();
          this.currstate = [0, 0, 0, 0, 0, 0, 0, 0];
          this.prerand();
        } else {
          // no event we want to react to or paint anything
          return;
        }
        window.requestAnimationFrame(this.shortpaint);
      });
    },
    beforeDestroy() {
      this.bus.$off('drawcityon');
      this.bus.$off('drawcityoff');
    }
  }
</script>

<style scoped>

</style>