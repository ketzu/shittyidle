<template>
  <v-container grid-list-lg>
    <v-layout align-start justify-center row wrap>
      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{formatresource(resourcegain*1000/tickrate)}}</h2>
        <span class="subitem">production per second</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1 v-if="resets > 0">
        <h2 class="stat">{{formatresource(resetresource)}}</h2>
        <span class="subitem">production this reset</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{formatresource(alltime)}}</h2>
        <span class="subitem">all time production</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1 v-if="resets > 0">
        <h2 class="stat">{{format(expmult)}}x</h2>
        <span class="subitem">experience multiplier</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1 v-if="resets > 0">
        <h2 class="stat">{{formatexp(experience)}}</h2>
        <span class="subitem">current experience</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1 v-if="resets > 0">
        <h2 class="stat">{{formatexp(expgain)}}</h2>
        <span class="subitem">experience gain</span>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "Stats",
    data() {
      return {
        dialog: false
      }
    }
  }
</script>

<style scoped>
  .stat {
    font-weight: normal;
  }

  .subitem {
    font-weight: normal;
  }

</style>