<template>
  <v-container grid-list-xs fluid>
    <v-layout :key="science.title" row wrap v-for="science in research">
      <v-flex md12>
        {{science.title}} {{science.cost}}
      </v-flex>
      <v-flex :key="option.name" md4 v-for="option in science.options">
        {{option.name}}
        <v-icon large :color="option.iconcolor">fas fa-{{option.icon}}</v-icon>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "Research",
    computed: {
      research: {
        get() {
          return this.$store.getters.research;
        }
      }
    }
  }
</script>

<style scoped>

</style>