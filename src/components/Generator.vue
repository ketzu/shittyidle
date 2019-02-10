<template>
  <v-list-tile avatar>
    <v-list-tile-avatar>
      {{level}}
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title>
        {{name}}, next level for {{Math.floor(cost(level))}} units.
      </v-list-tile-title>
      <v-list-tile-sub-title>
        {{buildamount}}
      </v-list-tile-sub-title>
      <v-list-tile-sub-title>
        Producing {{Math.floor(generation(level))}} units per tick.
      </v-list-tile-sub-title>
    </v-list-tile-content>

    <v-list-tile-action>
      <v-btn icon ripple @click="build()" :disabled="!buildable">
        <v-icon color="blue darken-2">fas fa-hammer</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
  export default {
    name: "Generator",
    props: ["name", "cost", "generation", "buildamount"],
    data() {
      return {
      }
    },
    computed: {
      level: {
        get() {
          let tmp = this.$store.getters["generators"][this.name];
          if(tmp === undefined)
            return 0;
          return tmp;
        }
      },
      resource: {
        get() {
          return this.$store.getters["resource"];
        }
      },
      buildable() {
        return this.resource > this.cost(this.level);
      }
    },
    methods: {
      build() {
        if(this.buildable) {
          this.$store.dispatch("spendresource", {value: this.cost(this.level)});
          this.$store.dispatch("build", {name: this.name});
        }
      }
    }
  }
</script>

<style scoped>

</style>