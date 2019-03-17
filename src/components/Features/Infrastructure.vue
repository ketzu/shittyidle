<template>
  <v-list two-line>
    <transition name="fade" :key="index" v-for="(building, index) in infrastructure">
      <InfraBuilding :type="building"></InfraBuilding>
    </transition>
  </v-list>
</template>

<script>
  import InfraBuilding from "./InfraBuilding.vue";

  export default {
    name: "Infrastructure",
    components: {InfraBuilding},
    data() {
      return {
      }
    }
  }
</script>

<style scoped>

</style>