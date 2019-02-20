<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Welcome to your {{towntype}}, {{title}}.</div>
        <span class="grey--text">Make wise decisions!</span>
      </div>
    </v-card-title>

    <v-card-text>
      <v-container grid-list-lg>
        <v-layout align-start justify-center row wrap>
          <v-flex md8 offset-md-2>
            <v-img src="welcome.png" contain max-width="800px"></v-img>
          </v-flex>
        </v-layout>
      </v-container>

    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <transition name="fade">
        <v-btn flat color="blue darken-2" @click="findNewJob()" v-if="resettable">Find a new job.</v-btn>
      </transition>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "CityScreen",
    methods: {
      findNewJob() {
        this.$store.dispatch('softreset', {});
      }
    }
  }
</script>

<style scoped>

</style>