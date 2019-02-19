<template>
  <v-hover>
    <v-list-tile avatar ripple slot-scope="{ hover }" :style="hover? 'background-color: #C8E6C9;' : ''">
      <v-list-tile-avatar>
        <v-icon large :color="type.iconcolor">fas {{type.icon}}</v-icon>
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-dialog v-model="dialog" max-width="600px">
          <span slot="activator">
            <v-list-tile-title>
              {{type.title}} ({{level}})
            </v-list-tile-title>

            <v-list-tile-sub-title>
              {{formatresource(mul*type.gain*level*1000/tickrate)}} per second ({{format(mul*type.gain*level*100/(resourcegain>0.1?resourcegain-0.1:1))}}%).
            </v-list-tile-sub-title>

            <v-list-tile-sub-title>
              Next {{count>1? count : ''}} level{{count>1?'s':''}}: {{formatresource(cost)}}.
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
                    <h2 class="stat">{{format(mul*type.gain*level*100/(resourcegain>0.1?resourcegain-0.1:1))}}%</h2>
                    of current production
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
                            {{upgrade.title}}
                          </v-list-tile-title>

                          <v-list-tile-sub-title>
                            {{format(upgrade.gain/basegain[type.name])}}x
                          </v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                          <v-icon large color="green darken-3" v-if="level>index">fas fa-check</v-icon>
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
    props: ['type', 'count'],
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
      nextupgrade: {
        get() {
          let possibleups = [];
          for (var key in this.upgrades) {
            // check if the property/key is defined in the object itself, not in parent
            if (this.upgrades.hasOwnProperty(key)) {
              if (this.level < key) {
                possibleups.push(key - this.level);
              }
            }
          }
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
      cost() {
        if (this.count === 1) {
          return this.type.cost.base * Math.pow(this.type.cost.rate, this.level);
        } else {
          const rtos = Math.pow(this.type.cost.rate, this.level);
          const rtogms = Math.pow(this.type.cost.rate, this.count);
          return this.type.cost.base * rtos * (rtogms * this.type.cost.rate - 1) / (this.type.cost.rate - 1);
        }
      },
      buyable() {
        return this.cost <= this.resource;
      }
    },
    methods: {
      buy() {
        if (this.buyable)
          this.$store.dispatch('buybuilding', {building: this.type, count: this.count});
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