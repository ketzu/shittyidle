<template>
  <v-container grid-list-xs fluid>
    <div :key="science.title" row wrap v-for="(science,id) in research">
      <v-row class="pt-5 text-center">
        <v-col md12 style="border-radius: 25px; border: 2px solid black;" class="mt-5 mx-5 mb-3 py-2 px-0">
          <div class="headline">{{science.title}}</div>
          <span class="grey--text">Requires {{science.cost}} Experience</span>
        </v-col>
      </v-row>
      <v-row class="pb-5">
        <v-col :key="option.name" md4 v-for="(option,pos) in science.options" class="text-md-center">
          <v-layout column align-center>
            <h3 style="font-weight: 400;">{{option.name}}</h3>
            <v-btn fab large depressed @click="buy(id,pos)" :disabled="!selectable(id,pos)" :text="!selectable(id,pos)" class="my-4">
              <v-icon large :color="selected(id,pos)||selectable(id,pos)?option.iconcolor:'grey'">fas fa-{{option.icon}}</v-icon>
            </v-btn>
            <div class="grey--text">{{option.desc}}</div>
          </v-layout>
        </v-col>
      </v-row>
    </div>
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
