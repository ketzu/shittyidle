<template>
  <v-container fluid>
    <v-layout row>
      <v-flex :key="i" md4 v-for="i in 5">
        <v-layout column>
          <v-flex :key="j" md4 v-for="j in 5" style="padding:1px;">
            <v-card :color="color(i,j)" dark min-height="100px" flat @click="plotusable(i,j)?dialog = true:'';di=i;dj=j">
              <v-card-text class="text-md-center">
                <v-icon x-large v-if="grid[i-1][j-1]!==0" style="margin-bottom:-30px;">{{icon(i,j)}}</v-icon>
                <v-icon x-large v-else-if="i===3 && j===3" style="margin-bottom:-30px;">fas fa-city</v-icon>
                <v-icon x-large v-else-if="trees[i-1][j-1]===0 || trees[i-1][j-1]===1" style="margin-bottom:-30px;">
                  fas fa-tree
                </v-icon>
                <span v-else-if="trees[i-1][j-1]===2">
                <v-icon x-large style="margin-bottom:-30px;">fas fa-tree</v-icon>
                  &nbsp;
                <v-icon x-large style="margin-bottom:-30px;">fas fa-tree</v-icon>
                  &nbsp;
                <v-icon x-large style="margin-bottom:-30px;">fas fa-tree</v-icon>
                </span>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex md12 class="text-md-center">
        Current effectiveness: {{evalGrid(grid).map(value=>value.toFixed(0)).join(', ')}}.
      </v-flex>
      <v-flex md12 class="text-md-center">
        <v-icon color="#364a38">fas fa-square</v-icon>
        Zone not yet available.
        &nbsp;&nbsp;&nbsp;&nbsp;
        <v-icon color="green darken-4">fas fa-square</v-icon>
        Zone available
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex md4 xs12 :key="index" v-for="(config, index) in gridconfigs">
        <v-hover>
          <v-card slot-scope="{ hover }" :style="hover? 'background-color: #C8E6C9;' : ''">
            <div class="text-md-center" style="padding-top:15px;">
              <canvas width="160" height="160" v-paint-colors="config"></canvas>
            </div>

            <v-card-title primary-title>
              <div>
                <div class="headline">Effectiveness:</div>
              </div>
              <v-list :style="hover? 'background-color: #C8E6C9;' : ''">
                <v-list-tile :key="index" v-for="(value, index) in evalGrid(config)">
                  <v-list-tile-avatar>
                    <v-icon color="blue darken-4" v-if="index===0">fas fa-glass-martini </v-icon>
                    <v-icon color="light-green darken-2" v-else-if="index===1">fas fa-home</v-icon>
                    <v-icon color="yellow accent-4" v-else>fas fa-industry</v-icon>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{['Commercial','Residential','Industrial'][index]}}: {{value.toFixed(0)}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="useConfig(index)" color="green darken-4">Use!</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title style="background-color: #2e7d32; color: white;">
          <v-container fluid>
            <v-layout>
              <v-flex xs12 align-end flexbox>
                    <span class="headline">
                      <v-icon large color="white">fas fa-map-marked </v-icon>
                      Select an appropriate zone, {{title}}!
                    </span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-lg>
            <v-layout align-start justify-center row wrap>
              <v-flex xs10 offset-xs1>
                Zoning can improve your city. The availability of land has an <b>effect on cost</b> of buildings.
                All zones affect farms and datacenters, as everyone needs food, and datacenters just don't care.
                But be aware: Neighboring, diagonally and normal, affect other zones effect.
              </v-flex>
              <v-flex xs10 offset-xs1>
                <v-list two-line>
                  <transition name="fade" :key="index" v-for="(zone, index) in zones.slice(1)">

                    <v-list-tile avatar>
                      <v-list-tile-avatar>
                        <v-icon large :color="zone.color">{{zone.icons[0]}}</v-icon>
                      </v-list-tile-avatar>

                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{zone.name}} ({{whatif(di,dj,index+1).join(', ')}})
                        </v-list-tile-title>

                        <v-list-tile-sub-title>
                          Strongly affects: {{zone.strong}}
                        </v-list-tile-sub-title>
                        <v-list-tile-sub-title>
                          Weakly affects: {{zone.weak}}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-btn icon ripple @click="build(di,dj,index+1);dialog=false">
                          <v-icon color="blue darken-4">fas fa-map-marker-alt</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </transition>
                </v-list>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions style="background-color: #2e7d32;">
          <v-spacer></v-spacer>
          <v-btn color="white" flat @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {evalGrid} from "../store";

  export default {
    name: "CityGrid",
    data() {
      return {
        dialog: false,
        di: 3,
        dj: 3
      }
    },
    computed: {
      trees() {
        let result = [];
        for(let i=0;i<5;i++) {
          result.push([]);
          for(let j=0;j<5;j++) {
            result[i].push(Math.floor(Math.random()*7)%7);
          }
        }
        return result;
      },
      grid: {
        get() {
          return this.$store.getters.citygrid;
        }
      },
      gridconfigs: {
        get() {
          return this.$store.getters.gridconfigs;
        }
      },
      gridvalues: {
        get() {
          let cache = this.grid;
          return evalGrid(cache);
        }
      },
      zones() {
        return this.$store.getters.zones;
      },
      radius() {
        if (this.citylevel > 2)
          return 3;
        if (this.citylevel > 1)
          return 2;
        if (this.resets > 3)
          return 1;
        return 0;
      },
      plotavailable() {
        return (i, j) => {
          if (Math.abs(i - 3) < this.radius && Math.abs(j - 3) < this.radius)
            return true;
          return false;
        }
      },
      plotusable() {
        return (i, j) => {
          if (this.plotavailable(i,j) && this.grid[i-1][j-1]===0)
            return true;
          return false;
        }
      }
    },
    methods: {
      whatif(i,j,zoneindex){
        const values = evalGrid(this.grid);
        let newgrid = this.grid.map( value => value.slice());
        newgrid[i-1][j-1] = zoneindex;
        const values2 = evalGrid(newgrid);
        return (values.map((value, index) => (values2[index]-value))).map(value => ((value>0?'+':(value===0?'±':''))+value.toFixed(0)));
      },
      build(i,j,zoneindex){
        this.$store.dispatch('buildzone', {x:(i-1),y:(j-1),zone:zoneindex});
      },
      color(i,j) {
        if(this.plotavailable(i,j))
          return this.zones[this.grid[i-1][j-1]].color;
        return '#364a38';
      },
      icon(i,j) {
        let random = this.trees[i-1][j-1];
        let icons = this.zones[this.grid[i-1][j-1]].icons;
        return icons[random%icons.length];
      },
      evalGrid(grid) {
        return evalGrid(grid);
      },
      useConfig(index) {
        for(let x=0;x<5;x+=1){
          for(let y=0;y<5;y+=1){
            if(this.grid[x][y] === 0 && this.plotusable(x+1,y+1))
              this.build(x+1,y+1,this.gridconfigs[index][x][y]);
          }
        }
      }
    },
    directives: {
      paintColors: (canvasElement, binding) => {
        // Get canvas context
        const config = binding.value;
        let ctx = canvasElement.getContext("2d");
        // Clear the canvas
        ctx.clearRect(0, 0, 40, 40);
        ctx.strokeStyle="white";
        ctx.lineWidth=1;
        // Insert stuff into canvas
        for(let x=0;x<5;x+=1){
          for(let y=0;y<5;y+=1){
            switch(config[x][y]){
              case 1: ctx.fillStyle = "#0d47a1"; break;
              case 2: ctx.fillStyle = "#689f38"; break;
              case 3: ctx.fillStyle = "#ffd600"; break;
              default: ctx.fillStyle = "#2e7d32";
            }
            ctx.beginPath();
            ctx.rect(x*32,y*32,(x+1)*32,(y+1)*32);
            ctx.fill();
            ctx.stroke();
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>