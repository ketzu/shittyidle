<template>
  <v-content class="green darken-3">
    <v-container grid-list-lg>
      <v-layout align-start justify-center row wrap>
        <v-flex md8>
          <MainScreen></MainScreen>
        </v-flex>

        <v-flex md4>
          <BuildMenu></BuildMenu>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import BuildMenu from './Buildings/BuildMenu';
import MainScreen from "./MainScreen";

export default {
  name: 'Game',
  components: {
    MainScreen,
    BuildMenu
  },
  data() {
    return {
    }
  }
}
</script>