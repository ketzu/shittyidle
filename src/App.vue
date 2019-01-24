<template>
  <v-app>
    <v-toolbar dark fixed app>
      <v-toolbar-title>
        IGame
      </v-toolbar-title>
      <v-spacer></v-spacer>
      {{resource}} units
    </v-toolbar>

    <v-content class="deep-purple darken-4">
      <v-container grid-list-lg>
        <v-layout align-start justify-center row wrap>
          <v-flex md12 class="text-md-center">
            <v-icon color="white">fas fa-plus</v-icon>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
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
      },
      set(value) {
        this.$store.dispatch('updateresource', {value: value});
      }
    }
  },
  methods: {
  },
  mounted() {
    let self = this;
    setInterval(() => {
      // Main Gameloop
      this.resource += 1;
    }, 100);
  }
}
</script>

<style>
</style>
