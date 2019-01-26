<template>
  <v-app>
    <v-toolbar dark fixed app>
      <v-toolbar-title>
        IGame
      </v-toolbar-title>
      <v-spacer></v-spacer>
      {{resource}} units
    </v-toolbar>
    <Game></Game>
    <v-footer app dark height="auto" absolute>
      <v-layout justify-center row wrap>
        If you are not idling, you are doing it wrong.
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'app',
  components: {
    Game
  },
  data() {
    return {
    }
  },
  computed: {
    resource: {
      get() {
        return this.$store.getters["resource"];
      }
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
