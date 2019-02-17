<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Welcome to your {{towntype}}, {{title}}.</div>
        <span class="grey--text">Make wise decisions!</span>
      </div>
    </v-card-title>

    <v-card-text>
      Currently producing {{formatresource(resourcegain*1000/tickrate)}} per second.
      <br>
      Produced {{formatresource(alltime)}} all time.
    </v-card-text>

  </v-card>
</template>

<script>
  export default {
    name: "CityScreen"
  }
</script>

<style scoped>

</style>