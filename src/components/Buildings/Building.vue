<template>
  <v-hover>
    <v-list-tile avatar ripple slot-scope="{ hover }" :style="hover? 'background-color: #C8E6C9;' : ''" @click="dialog=true">
      <v-list-tile-avatar>
        <v-badge left overlap :color="!upgradeable && upgradeindicator && nextupgrade !=='∞'?'green darken-4':'white'">
          <v-icon small color="blue darken-4" slot="badge" v-if="upgradeable">fas fa-plus</v-icon>
          <small style="color: white;" slot="badge" v-else-if="nextupgrade!=='∞' && upgradeindicator">{{nextupgrade}}
          </small>
          <v-icon small color="amber darken-3" slot="badge" v-else-if="nextupgrade==='∞'">fas fa-check-circle</v-icon>
          <v-icon large :color="type.iconcolor" style="width:40px;">fas {{type.icon}}</v-icon>
        </v-badge>
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-dialog v-model="dialog" max-width="600px">
          <span slot="activator" ripple>
            <v-list-tile-title>
              <small>{{level}}x</small> {{type.title}}
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
                  <v-flex md4 offset-md1 xs10 offset-xs1 v-if="type.title!=='The same'">
                    <h2 class="stat">{{format(buildingboni*type.gain/basegain[type.name])}}x</h2>
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
                  <v-flex md4 offset-md1 xs10 offset-xs1 v-if="citylevel>0">
                    <h2 class="stat">{{format(affecting)}}x</h2>
                    by infrastructure
                  </v-flex>
                  <v-flex md4 offset-md1 xs10 offset-xs1 v-if="buildingboni>1">
                    <h2 class="stat">{{format(buildingboni)}}x</h2>
                    by gambling
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
                            {{format(upgrade.gain)}}x {{upgbought(index)?'':'cost:'+formatresource(upgrades[index].upgcost)}}
                          </v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                          <v-icon large color="green darken-3" v-if="upgbought(index)">fas fa-check</v-icon>
                          <v-btn v-else icon ripple @click="buyupgrade(index)" :disabled="!upgbuyable(index)">
                            <v-icon large :color="upgbuyable(index)? 'blue darken-4' : 'grey darken-2'">fas fa-hammer
                            </v-icon>
                          </v-btn>
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

      <v-list-tile-action @click.stop="buy()">
        <v-btn icon ripple  :disabled="!buyable">
          <v-icon :color="buyable? 'blue darken-4' : 'grey darken-2'">fas fa-hammer</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-hover>
</template>

<script>
  import {buildingCostOf, buildingGain, buyableUpgrades, maxcount, affecting, upgradeable} from '@/statics/buildings'

  export default {
    name: "Building",
    props: ['type', 'index'],
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
      boughtUpgrades: {
        get() {
          return this.$store.getters.boughtupgrades[this.type.name];
        }
      },
      buildingboni() {
        return this.$store.getters.buildingboni[this.index];
      },
      upgradeable() {
        if(this.type.title === "The same")
          return false;
        return upgradeable(this.type.name, this.level, this.boughtUpgrades);
      },
      maxbuyable() {
        let c = this.buycount;
        while (buildingCostOf(this.level, (c + 10), this.type.cost.base, this.type.cost.rate) < this.resource && this.level + c <= maxcount + this.buycount) c += this.buycount;
        return Math.min(c, maxcount - this.level);
      },
      compbuycount() {
        if (this.buytoupgrade) {
          if (this.nextupgrade === '∞' || this.$store.getters.ignoreupgradebuy) {
            return this.maxbuyable;
          } else {
            return this.nextupgrade;
          }
        }
        return this.buycount;
      },
      possibleups: {
        get() {
          if(this.type.title === "The same")
            return [];
          let possibleups = [];
          for (let key in this.upgrades) {
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
          let possibleups = this.possibleups.map(uplevel => uplevel - this.level);
          if (possibleups.length === 0)
            return "∞";
          return Math.min(...possibleups);
        }
      },
      upgrades: {
        get() {
          if(this.type.title === "The same")
            return [];
          return this.$store.getters.upgrades[this.type.name];
        }
      },
      mul: {
        get() {
          return this.$store.getters.multiplier;
        }
      },
      affecting() {
        return  affecting(this.type, this.$store.getters.infrastructurelevels, this.$root);
      },
      production() {
        return buildingGain(this.level, this.type.gain, this.type.mult, this.buildingboni, this.affecting)*this.$store.getters.multiplier;
      },
      cost() {
        return buildingCostOf(this.level, this.compbuycount, this.type.cost.base, this.type.cost.rate);
      },
      buyable() {
        return (this.cost <= this.resource) && (this.level < 7000);
      }
    },
    methods: {
      buy() {
        if (this.buyable) {
          this.$store.dispatch('buybuilding', {building: this.type, count: this.compbuycount});
        }
      },
      buyupgrade(level) {
        if (this.upgbuyable(level))
          this.$store.dispatch('buyupgrade', {building: this.type, level: level});
      },
      upgbought(level) {
        if (this.boughtUpgrades === undefined) return false;
        return this.boughtUpgrades[level] !== undefined;
      },
      upgbuyable(level) {
        return this.resource >= this.upgrades[level].upgcost && this.level >= level;
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