<template>
  <v-container grid-list-xs fluid>
    <h2>Beta Feature: Feel free to experiment.</h2>
    <v-layout :key="science.title" row wrap v-for="(science,id) in research">
      <v-flex md12>
        <div class="headline">{{science.title}}</div>
        <span class="grey--text">Requires {{science.cost}} Experience</span>
      </v-flex>
      <v-flex :key="option.name" md4 v-for="(option,pos) in science.options" class="text-md-center">
        <v-layout column align-center>
          <h3 style="font-weight: 400;">{{option.name}}</h3>
          <v-btn fab large @click="buy(id,pos)" :disabled="!selectable(id,pos)" :text="!selectable(id,pos)" class="my-4">
            <v-icon large :color="selected(id,pos)||selectable(id,pos)?option.iconcolor:'grey'">fas fa-{{option.icon}}</v-icon>
          </v-btn>
          <div class="grey--text">{{option.desc}}</div>
        </v-layout>
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
      },
      selections: {
        get() {
          return this.$store.getters.researchselection;
        }
      }
    },
    methods: {
      selectable(x, y) {
        if(this.research[x].cost > this.experience)
          return false;
        if(this.selections[x] === undefined)
          return true;
        if(this.selections[x] !== y)
          return false;
        return true;
      },
      selected(x,y) {
        if(this.selections[x] === undefined)
          return false;
        if(this.selections[x] === y)
          return true;
        return false;
      },
      buy(x,y) {
        this.$store.dispatch('selectresearch',{level: x, selection: y});
      }
    }
  }
</script>

<style scoped>

</style>
