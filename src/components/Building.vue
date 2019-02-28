<template>
  <v-hover>
    <v-list-tile avatar ripple slot-scope="{ hover }" :style="hover? 'background-color: #C8E6C9;' : ''">
      <v-list-tile-avatar>
        <v-badge left overlap color="white">
          <v-icon small color="amber darken-3" slot="badge" v-if="nextupgrade==='∞'">fas fa-check-circle</v-icon>
          <v-icon large :color="type.iconcolor" style="width:40px;">fas {{type.icon}}</v-icon>
        </v-badge>
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-dialog v-model="dialog" max-width="600px">
          <span slot="activator" ripple>
            <v-list-tile-title>
              <small>{{level}}x</small> {{type.title}} <v-icon small color="blue darken-4" style="padding-bottom:2px;">fas fa-info</v-icon>
            </v-list-tile-title>

            <v-list-tile-sub-title>
              {{formatresource(production*1000/tickrate)}} per second ({{format(production*100/(resourcegain>0.1?resourcegain-0.1:1))}}%).
            </v-list-tile-sub-title>

            <v-list-tile-sub-title>
              Next {{compbuycount>1? compbuycount : ''}} level{{compbuycount>1?'s':''}}: {{formatresource(cost)}}.
            </v-list-tile-sub-title>
          </span>
          <v-card>
            <v-card-title style="background-color: #2e7d32; color: white;">
              <v-container fluid>
                <v-layout>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline">
                      <v-icon large color="white">fas {{type.icon}}</v-icon>
                      {{type.name}}
                    </span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-lg>
                <v-layout align-start justify-center row wrap>
                  <v-flex md4 offset-md1 xs10 offset-xs1>
                    <h2 class="stat">{{type.title}}</h2>
                    <span class="subitem">current level</span>
                  </v-flex>
                  <v-flex md4 offset-md1 xs10 offset-xs1>
                    <h2 class="stat">{{format(type.gain/basegain[type.name])}}x</h2>
                    current multiplier
                  </v-flex>
                  <v-flex md4 offset-md1 xs10 offset-xs1>
                    <h2 class="stat">{{nextupgrade}}</h2>
                    level until next upgrade
                  </v-flex>
                  <v-flex md4 offset-md1 xs10 offset-xs1>
                    <h2 class="stat">{{format(production*100/(resourcegain>0.1?resourcegain-0.1:1))}}%</h2>
                    of current production
                  </v-flex>
                  <v-flex md9 offset-md1 xs10 offset-xs1 v-if="citylevel>0">
                    <h2 class="stat">{{format(affecting)}}x</h2>
                    by infrastructure
                  </v-flex>
                  <v-flex xs12>
                    <v-list two-line>
                      <v-list-tile avatar :key="index" v-for="(upgrade, index) in upgrades">
                        <v-list-tile-avatar>
                          <v-btn depressed fab color="green darken-3">
                            <h2 style="color: white;">{{index}}</h2>
                          </v-btn>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            {{upgrade.uname === undefined ? upgrade.title : upgrade.uname}}
                          </v-list-tile-title>

                          <v-list-tile-sub-title>
                            {{format(upgrade.gain)}}x
                          </v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                          <v-icon large color="green darken-3" v-if="level>=index">fas fa-check</v-icon>
                          <v-icon large color="grey darken-2" v-else>fas fa-slash</v-icon>
                        </v-list-tile-action>
                      </v-list-tile>
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
      </v-list-tile-content>

      <v-list-tile-action>
        <v-btn icon ripple @click="buy()" :disabled="!buyable">
          <v-icon :color="buyable? 'blue darken-4' : 'grey darken-2'">fas fa-hammer</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-hover>
</template>

<script>
  export default {
    name: "Building",
    props: ['type'],
    data() {
      return {
        dialog: false
      };
    },
    computed: {
      level: {
        get() {
          let level = this.$store.getters.buildinglevels[this.type.name];
          if (level === undefined) {
            return 0;
          }
          return level;
        }
      },
      maxbuyable() {
        return this.buycount;
      },
      compbuycount() {
        if(this.buytoupgrade) {
          if(this.nextupgrade === '∞') {
            return this.maxbuyable;
          }else{
            return this.nextupgrade;
          }
        }
        return this.buycount;
      },
      possibleups: {
        get() {
          let possibleups = [];
          for (var key in this.upgrades) {
            // check if the property/key is defined in the object itself, not in parent
            if (this.upgrades.hasOwnProperty(key)) {
              if (this.level < key) {
                possibleups.push(key);
              }
            }
          }
          return possibleups;
        }
      },
      nextupgrade: {
        get() {
          let possibleups = this.possibleups.map(uplevel => uplevel-this.level);
          if (possibleups.length === 0)
            return "∞";
          return Math.min(...possibleups);
        }
      },
      upgrades: {
        get() {
          return this.$store.getters.upgrades[this.type.name];
        }
      },
      mul: {
        get() {
          return this.$store.getters.multiplier;
        }
      },
      affecting() {
        const inflevels = this.$store.getters.infrastructurelevels;
        let mult = 1;
        for(let infra of this.infrastructure.filter(inf => inf.affected.includes(this.type.name))) {
          if(inflevels[infra.name] !== undefined)
            mult *= Math.pow(infra.basemult, inflevels[infra.name]);
        }
        return mult;
      },
      production() {
        return this.mul*this.type.gain*this.level*this.affecting*(this.type.mult*this.level-1);
      },
      cost() {
        if (this.compbuycount === 1) {
          return this.type.cost.base * Math.pow(this.type.cost.rate, this.level);
        } else {
          const rtos = Math.pow(this.type.cost.rate, this.level);
          const rtogms = Math.pow(this.type.cost.rate, this.compbuycount);
          return this.type.cost.base * rtos * (rtogms * this.type.cost.rate - 1) / (this.type.cost.rate - 1);
        }
      },
      buyable() {
        return this.cost <= this.resource;
      }
    },
    methods: {
      buy() {
        if (this.buyable) {
          this.$store.dispatch('buybuilding', {building: this.type, count: this.compbuycount});
        }
      }
    }
  }
</script>

<style scoped>
.stat {
  font-weight: normal;
}

.subitem {
  font-weight: normal;
}
</style>