<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Welcome to your {{towntype}}, {{title}}.</div>
        <span class="grey--text">Make wise decisions!</span>
      </div>
    </v-card-title>

    <v-card-text>
      Maybe check out the stats screen <v-icon small>fas fa-chart-line</v-icon> or the on click menu of buildings.
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <transition name="fade">
        <v-btn flat color="blue darken-2" @click="findNewJob()" v-if="resettable">Find a new job.</v-btn>
      </transition>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "CityScreen",
    methods: {
      findNewJob() {
        this.$store.dispatch('softreset', {});
      }
    }
  }
</script>

<style scoped>

</style>