<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-btn slot="activator" icon id="statisticstoggle">
      <v-icon>fas fa-chart-line</v-icon>
    </v-btn>
    <v-card>
      <v-card-title style="background-color: #2e7d32; color: white;">
        <v-container fluid>
          <v-layout>
            <v-flex xs12 align-end flexbox>
              <span class="headline">
                <v-icon large color="white">fas fa-chart-line</v-icon>
                Statistics
              </span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-title>
      <v-card-text>
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
      </v-card-text>
      <v-card-actions style="background-color: #2e7d32;">
        <v-spacer></v-spacer>
        <v-btn color="white" flat @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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