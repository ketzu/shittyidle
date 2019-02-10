<template>
  <v-app>
    <v-toolbar dark fixed app>
      <v-toolbar-title>
        City Idle
      </v-toolbar-title>
      <v-spacer></v-spacer>
      {{formatresource(resource)}}
    </v-toolbar>
    <Game></Game>
    <v-footer app dark height="auto" absolute>
      <v-layout justify-center row wrap>
        If you are not idling, you are doing it wrong. ~<a @click="$store.commit('hardreset')">HARD RESET.</a>~
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
