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
              <Generator :name="generator.name" :generation="generator.generation" :cost="generator.cost" :key="generator.name" v-for="generator in generators"></Generator>
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
import Generator from './Generator.vue'

export default {
  name: 'Game',
  components: {
    Generator
  },
  data() {
    return {
      generators: [
        {name: "Slow", generation: level => {return level*level;}, cost: level => {return level*level*level}},
        {name: "Hyper", generation: level => {return Math.exp(level)-1;}, cost: level => {return Math.exp(level*level)}}
      ]
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
    },
    resourcegain: {
      get() {
        // base generation
        let gain = 1;

        // generators computation
        const levels = this.$store.getters["generators"];
        for(const gen of this.generators) {
          gain += gen.generation(gen.name in levels? levels[gen.name] : 0);
        }
        return gain;
      }
    },
    tickrate: {
      get() {
        return this.$store.getters["tickrate"];
      }
    }
  },
  mounted() {
    let self = this;
    setInterval(() => {
      // Main Gameloop
      self.resource += this.resourcegain;
    }, this.tickrate);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
