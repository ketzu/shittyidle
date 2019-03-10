<template>
  <v-hover>
    <v-list-tile avatar ripple slot-scope="{ hover }" :style="hover? 'background-color: #C8E6C9;' : ''">
      <v-list-tile-avatar>
        <v-icon large :color="type.iconcolor">fas {{type.icon}}</v-icon>
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title>
          ({{level}}) {{type.title}}
        </v-list-tile-title>

        <v-list-tile-sub-title>
          Improves {{type.affected.slice(0,-1).join(', ')}} and {{type.affected[type.affected.length-1]}} by {{format(multiplier)}}x.
        </v-list-tile-sub-title>

        <v-list-tile-sub-title>
          Next {{compbuycount>1? compbuycount : ''}} level{{compbuycount>1?'s':''}}: {{formatresource(cost)}}.
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
      maxbuyable() {
        let c=10;
        while(this.costof(c+10)<this.resource) c+=10;
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