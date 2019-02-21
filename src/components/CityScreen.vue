<template>
  <v-card>
    <v-card-title primary-title style="margin-bottom: -30px;">
      <div>
        <div class="headline">Welcome to your {{towntype}}, {{title}}.</div>
        <span class="grey--text">Make wise decisions!</span>
      </div>
    </v-card-title>

    <v-card-text>
      <v-tabs v-model="tabcontrols" color="white" fixed-tabs slider-color="green darken-4">
        <v-tab v-for="i in tabs" :key="i" ripple class="green--text text--darken-4">
          {{ i }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabcontrols">
        <v-tab-item>
          <v-container grid-list-lg>
            <v-layout align-start justify-center row wrap>
              <v-flex md8 offset-md-2>
                <v-img src="welcome.png" contain max-width="800px"></v-img>
              </v-flex>
            </v-layout>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <Stats></Stats>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <transition name="fade">
        <SoftReset></SoftReset>
      </transition>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Stats from "./Stats.vue";
  import SoftReset from "./SoftReset.vue";

  export default {
    name: "CityScreen",
    components: {
      Stats,
      SoftReset
    },
    data() {
      return {
        tabcontrols: 0,
        tabs: ['Main','Statistics']
      }
    }
  }
</script>

<style scoped>

</style>