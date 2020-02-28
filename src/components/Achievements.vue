<template>
  <v-container>
    <v-row wrap :key="index" v-for="(achievement, index) in achievements">
      <v-col md="3" class="text-center">
        <v-icon large :color="cleared(index)?achievement.iconcolor:'grey lighten-2'" style="width:40px;">{{achievement.icon}}</v-icon>
      </v-col>
      <v-col md="9">
        <h2 class="stat">{{achievement.title}}</h2>
        <span class="subitem">{{achievement.desc}} </span><br v-if="cleared(index)">
        <span class="subitem" v-if="cleared(index)">{{(achievement.buildingboni!==undefined?achievement.buildingboni:'Improvement: '+achievement.mult*100+'%.')}}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import {achievements} from "@/statics/statics";

  export default {
    name: "Achivements",
    computed: {
      reached() {
        return this.$store.getters.achievements;
      },
      achievements() {
        return achievements;
      }
    },
    methods: {
      cleared(index) {
        return this.reached[index] !== undefined;
      }
    }
  }
</script>

<style scoped>

</style>
