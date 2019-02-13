<template>
  <v-list-tile avatar>
    <v-list-tile-avatar>
      <v-icon large color="grey darken-2">fas {{type.icon}}</v-icon>
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title>
        {{type.title}} ({{level}})
      </v-list-tile-title>

      <v-list-tile-sub-title v-if="type.gain>0">
        {{formatresource(mul*type.gain*level*1000/tickrate)}} per second.
      </v-list-tile-sub-title>
      <v-list-tile-sub-title v-if="type.mult>1">
        Supporting multiplier is {{format(Math.pow(type.mult,level))}}.
      </v-list-tile-sub-title>

      <v-list-tile-sub-title>
        Next level: {{formatresource(cost)}}.
      </v-list-tile-sub-title>
    </v-list-tile-content>

    <v-list-tile-action>
      <v-btn icon ripple @click="buy()" :disabled="!buyable">
        <v-icon :color="buyable? 'blue darken-2' : 'grey darken-2'">fas fa-hammer</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
  export default {
    name: "Building",
    props: ['type'],
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
      mul: {
        get() {
          return this.$store.getters.multiplier;
        }
      },
      cost() {
        return this.type.cost.base*Math.pow(this.type.cost.rate,this.level);
      },
      buyable() {
        return this.cost <= this.resource;
      }
    },
    methods: {
      buy() {
        if(this.buyable)
          this.$store.dispatch('buybuilding',{building: this.type});
      }
    }
  }
</script>

<style scoped>

</style>