<template>
  <v-list-tile avatar>
    <v-list-tile-avatar>
      {{level}}
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title>
        {{name}}
      </v-list-tile-title>
      <v-list-tile-sub-title>
        Producing 0 units.
      </v-list-tile-sub-title>
    </v-list-tile-content>

    <v-list-tile-action>
      <v-btn icon ripple @click="build()">
        <v-icon color="blue darken-2">fas fa-hammer</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
  export default {
    name: "Generator",
    props: ["name"],
    data() {
      return {
      }
    },
    computed: {
      level: {
        get() {
          return this.$store.getters["generators"][this.name];
        }
      }
    },
    methods: {
      build() {
        this.$store.dispatch("build", {name: this.name});
      }
    }
  }
</script>