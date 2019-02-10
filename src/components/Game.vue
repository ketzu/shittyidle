<template>
  <v-content class="deep-purple darken-4">
    <v-container grid-list-lg>
      <v-layout align-start justify-center row wrap>
        <v-flex md9>
          <v-card>
            <v-card-title primary-title>
              <div>
                <div class="headline">Gamescreen</div>
                <span class="grey--text">All the data you want!</span>
              </div>
            </v-card-title>

            <v-list two-line>
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <v-btn icon @click="">
                    <v-icon large color="blue darken-2">fas fa-arrow-circle-up</v-icon>
                  </v-btn>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{resourcegain*1000/tickrate}} units per second.
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="purple">I have no use.</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md3>
          <v-card>
            <v-card-title primary-title>
              <div>
                <div class="headline">Generators</div>
                <span class="grey--text">Increasing your increments!</span>
              </div>
            </v-card-title>

            <v-list two-line>
              Generators
            </v-list>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat>Share</v-btn>
              <v-btn flat color="purple">Explore</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import Data from './data'

export default {
  name: 'Game',
  components: {
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
  },
  mixins: [Data]
}
</script>