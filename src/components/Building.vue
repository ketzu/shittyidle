<template>
  <v-hover>
  <v-list-tile avatar  slot-scope="{ hover }">
    <v-list-tile-avatar>
      <v-icon large color="grey darken-2">fas {{type.icon}}</v-icon>
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title>
        {{type.title}} (<transition name="fade">
        <span v-if="hover">Next upgrade in {{nextupgrade}} levels.</span>
        <span v-else>{{level}}</span>
      </transition>)
      </v-list-tile-title>

        <v-list-tile-sub-title>
          {{formatresource(mul*type.gain*level*1000/tickrate)}} per second ({{format(mul*type.gain*level*100/(resourcegain>0.1?resourcegain-0.1:1))}}%).
        </v-list-tile-sub-title>

      <v-list-tile-sub-title>
        Next {{count>1? count : ''}} level{{count>1?'s':''}}: {{formatresource(cost)}}.
      </v-list-tile-sub-title>
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
    props: ['type','count'],
    computed: {
      level: {
        get() {
          let level = this.$store.getters.buildinglevels[this.type.name];
          if(level === undefined) {
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
              if(this.level < key) {
                possibleups.push(key-this.level);
              }
            }
          }
          if(possibleups.length === 0)
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
        if(this.count === 1) {
          return this.type.cost.base*Math.pow(this.type.cost.rate,this.level);
        }else{
          const rtos = Math.pow(this.type.cost.rate,this.level);
          const rtogms = Math.pow(this.type.cost.rate,this.count);
          return this.type.cost.base*rtos*(rtogms*this.type.cost.rate-1)/(this.type.cost.rate-1);
        }
      },
      buyable() {
        return this.cost <= this.resource;
      }
    },
    methods: {
      buy() {
        if(this.buyable)
          this.$store.dispatch('buybuilding',{building: this.type, count: this.count});
      }
    }
  }
</script>

<style scoped>

</style>