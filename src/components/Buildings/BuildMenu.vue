<template>
  <v-card>
    <v-row class="ml-0">
      <v-card-title primary-title>
        <div class="headline">Buildings</div>
      </v-card-title>
    </v-row>

    <v-row v-if="$store.getters.achievements['upgrades2'] === true" class="py-0">
      <v-btn text large ripple block color="blue darken-4" @click="$store.dispatch('buyallupgrades')" :disabled="!anyupgrades">
        Upgrade all
      </v-btn>
    </v-row>

      <v-list two-line :dense="densebuildingmenu">
        <transition name="fade" :key="index" v-for="(building, index) in buildings">
          <Building :type="building" :index="index" v-if="building.cost.base < alltime" :count="buycount"></Building>
        </transition>
      </v-list>

    <v-card-actions>
      <MultiBuy></MultiBuy>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Building from "./Building.vue";
  import MultiBuy from "../Helpers/MultiBuy"
  import {upgradeable, basebuildings} from "../../statics/buildings";

  export default {
    name: "BuildMenu",
    components: {Building, MultiBuy},
    computed: {
      anyupgrades() {
        return this.$root.store_buildings.some(({name,title}) => {
        return title==="The same"?false
                  :upgradeable(name, this.$store.getters.buildinglevels[name],
                  this.$store.getters.boughtupgrades[name])});
      },
      densebuildingmenu() {
        return this.$store.getters.densebuildingmenu;
      }
    }
  }
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
