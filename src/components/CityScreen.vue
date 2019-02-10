<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Welcome to your {{towntype}}, {{title}}.</div>
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
            {{formatresource(resourcegain*1000/tickrate)}} per second.
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat color="purple">I have no use.</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "CityScreen"
  }
</script>

<style scoped>

</style>