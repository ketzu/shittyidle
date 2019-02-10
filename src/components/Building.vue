<template>
  <v-list-tile avatar>
    <v-list-tile-avatar>
      <v-icon large color="blue darken-2">fas {{type.icon}}</v-icon>
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title>
        {{type.name}}
      </v-list-tile-title>
      <v-list-tile-sub-title>
        {{type.type}}
      </v-list-tile-sub-title>
    </v-list-tile-content>

    <v-list-tile-action>
      <v-btn icon ripple>
        <v-icon color="grey darken-2">fas fa-hammer</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
  export default {
    name: "Building",
    props: ['type']
  }
</script>

<style scoped>

</style>