<template>
  <v-app>
    <v-toolbar dark fixed app>
      <v-toolbar-title>
        City Idle - a work in progress v0.1
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <h2>{{formatresource(resource)}}</h2>
      <v-spacer></v-spacer>
      all time {{formatresource(alltime)}}
    </v-toolbar>
    <Game></Game>
    <v-footer app dark height="auto" absolute>
      <v-layout justify-center row wrap>
        <v-spacer></v-spacer>
        <a href="https://www.paypal.me/roughbudget">Supprt the game.</a>
        <v-spacer></v-spacer>
        <a @click="$store.commit('hardreset')">HARD RESET (No confirmation!)</a>
        <v-spacer></v-spacer>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import Game from './components/Game.vue'
import Data from './components/data'

export default {
  name: 'app',
  components: {
    Game
  },
  data() {
    return {
    }
  },
  methods: {
  },
  mixins: [Data]
}
</script>
<style scoped>
a {
  color: #ffffff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
