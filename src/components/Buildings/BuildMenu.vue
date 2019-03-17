<template>
  <v-card>
    <v-layout row style="margin: 0px;">
      <v-flex xs8 style="padding: 0px;">
        <v-card-title primary-title>
          <div>
            <div class="headline">Buildings</div>
            <span class="grey--text">Add buildings to your {{towntype}}!</span>
          </div>
        </v-card-title>
      </v-flex>
      <v-flex xs4 align-self-center>
        <v-btn flat large ripple block color="blue darken-4" @click="$store.dispatch('buyallupgrades')" :disabled="!anyupgrades">
          Upgrade<br>all
        </v-btn>
      </v-flex>
    </v-layout>

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
        return basebuildings.some(({name}) => upgradeable(name, this.$store.getters.buildinglevels[name], this.$store.getters.boughtupgrades[name]));
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