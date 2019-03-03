<template>
  <v-container grid-list-lg>
    <v-layout align-start justify-center row wrap>
      <v-flex md4 offset-md1 xs10 offset-xs1 :key="index" v-for="(achievement, index) in achievements">
        <v-layout align-center justify-left row wrap>
          <v-flex md3>
            <v-icon large :color="cleared(index)?achievement.iconcolor:'grey lighten-2'" style="width:40px;">{{achievement.icon}}</v-icon>
          </v-flex>
          <v-flex md9>
            <h2 class="stat">{{achievement.title}}</h2>
            <span class="subitem">{{achievement.desc}}</span>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {achievements} from "@/statics";

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