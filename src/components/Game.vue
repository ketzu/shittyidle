<template>
  <v-content class="green darken-3">
    <v-container grid-list-lg>
      <v-layout align-start justify-center row wrap>
        <v-flex md9>
          <CityScreen></CityScreen>
        </v-flex>

        <v-flex md3>
          <BuildMenu></BuildMenu>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import BuildMenu from './BuildMenu'
import CityScreen from "./CityScreen";

export default {
  name: 'Game',
  components: {
    CityScreen,
    BuildMenu
  },
  data() {
    return {
    }
  },
  computed: {
    tickrate: {
      get() {
        return this.$store.getters["tickrate"];
      }
    }
  }
}
</script>