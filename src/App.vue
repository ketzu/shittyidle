<template>
  <v-app>
    <v-toolbar dark fixed app>
      <v-toolbar-title>
        City Idle
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <h2>{{formatresource(resource)}}</h2>
      <v-spacer></v-spacer>
      all time {{formatresource(alltime)}}
      <v-btn icon id="sidemenutoggle" @click="sidemenu = !sidemenu">
        <v-icon>fas fa-bars</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer fixed v-model="sidemenu" app right>
      <Changelog></Changelog>
    </v-navigation-drawer>

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
import Changelog from "./components/Changelog.vue";
import Data from './components/data'

export default {
  name: 'app',
  components: {
    Game,
    Changelog
  },
  data() {
    return {
      sidemenu: false
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
