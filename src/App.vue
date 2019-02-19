<template>
  <v-app>
    <v-toolbar dark fixed app>
      <v-toolbar-title>
        <img src="logo.png" height="35px" alt="Logo" style="margin-bottom: -8px;"> City Idle
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <h2>{{formatresource(resource)}}</h2>

      <v-spacer></v-spacer>

      <h2 v-if="resets >= 1">{{formatexp(experience)}} Exp</h2>
      <stats></stats>
      <v-btn icon id="sidemenutoggle" @click="sidemenu = !sidemenu">
        <v-icon>fas fa-code-branch</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer fixed v-model="sidemenu" app right>
      <Changelog></Changelog>
    </v-navigation-drawer>

    <Game></Game>
    <v-footer app dark height="auto" absolute>
      <v-layout justify-center row wrap>
        <v-spacer></v-spacer>
        <a href="https://www.paypal.me/roughbudget">Support the game.</a>
        <v-spacer></v-spacer>
        <a @click="$store.commit('hardreset')">HARD RESET (No confirmation!)</a>
        <v-spacer></v-spacer>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import Game from './components/Game.vue';
import Changelog from "./components/Changelog.vue";
import Stats from "./components/Stats.vue";
import Data from './components/data';

export default {
  name: 'app',
  components: {
    Game,
    Changelog,
    Stats
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
