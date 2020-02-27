<template>
  <v-hover>
    <v-list-item ripple slot-scope="{ hover }" :style="hover? 'background-color: #C8E6C9;' : ''">
      <v-list-item-avatar>
        <v-icon large :color="type.iconcolor">fas {{type.icon}}</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>
          ({{level}}) {{type.title}}
        </v-list-item-title>

        <v-list-item-subtitle>
          Improves {{comp_affected.slice(0,-1).join(', ')}} and {{type.affected[comp_affected.length-1]}} by {{format(multiplier)}}x.
        </v-list-item-subtitle>

        <v-list-item-subtitle>
          Next {{compbuycount>1? compbuycount : ''}} level{{compbuycount>1?'s':''}}: {{formatresource(cost)}}.
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-btn icon ripple @click="buy()" :disabled="!buyable">
          <v-icon :color="buyable? 'blue darken-4' : 'grey darken-2'">fas fa-hammer</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-hover>
</template>

<script>
  import {translator} from '@/statics/buildings';

  export default {
    name: "InfraBuilding",
    props: ['type'],
    data() {
      return {
        dialog: false
      };
    },
    computed: {
      level: {
        get() {
          let level = this.$store.getters.infrastructurelevels[this.type.name];
          if (level === undefined) {
            return 0;
          }
          return level;
        }
      },
      comp_affected() {
        return this.type.affected.map(name => this.$root.store_buildings[translator[name]].title);
      },
      maxbuyable() {
        let c= this.buycount;
        while(this.costof(c+this.buycount)<this.resource && c <=700) c+=this.buycount;
        return Math.min(c,700-this.level);
      },
      compbuycount() {
        if(this.buytoupgrade) {
          return this.maxbuyable;
        }
        return this.buycount;
      },
      cost() {
        if (this.compbuycount === 1) {
          return this.type.cost.base * Math.pow(this.type.cost.rate, this.level);
        } else {
          return this.costof(this.compbuycount);
        }
      },
      buyable() {
        return this.cost <= this.resource && this.level < 700;
      },
      multiplier() {
        return Math.pow(this.type.basemult, this.level);
      }
    },
    methods: {
      buy() {
        if (this.buyable)
          this.$store.dispatch('buyinfrastructure', {building: this.type, count: this.compbuycount});
      },
      costof(value) {
        const rtos = Math.pow(this.type.cost.rate, this.level);
        const rtogms = Math.pow(this.type.cost.rate, value);
        return this.type.cost.base * rtos * (rtogms * this.type.cost.rate - 1) / (this.type.cost.rate - 1);
      }
    }
  }
</script>

<style scoped>

</style>
