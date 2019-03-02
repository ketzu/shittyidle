<template>
  <v-container fluid>
    <h2>Beta feature: Feel free to experiment. More info on the effect will be added.</h2>
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
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title style="background-color: #2e7d32; color: white;">
          <v-container fluid>
            <v-layout>
              <v-flex xs12 align-end flexbox>
                    <span class="headline">
                      <v-icon large color="white">fas fa-hammer</v-icon>
                      Place a building, {{title}}!
                    </span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-lg>
            <v-layout align-start justify-center row wrap>
              <v-flex xs10 offset-xs1>
                <v-list two-line>
                  <transition name="fade" :key="index" v-for="(zone, index) in zones.slice(1)">

                    <v-list-tile avatar>
                      <v-list-tile-avatar>
                        <v-icon large :color="zone.color">{{zone.icons[0]}}</v-icon>
                      </v-list-tile-avatar>

                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{zone.name}}
                        </v-list-tile-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-btn icon ripple @click="build(di,dj,index+1);dialog=false">
                          <v-icon color="blue darken-4">fas fa-hammer</v-icon>
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
      }
    }
  }
</script>

<style scoped>

</style>