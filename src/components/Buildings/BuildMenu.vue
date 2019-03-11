<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Buildings</div>
        <span class="grey--text">Add buildings to your {{towntype}}!</span>
      </div>
    </v-card-title>

    <v-list two-line>
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

  export default {
    name: "BuildMenu",
    components: {Building, MultiBuy}
  }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>