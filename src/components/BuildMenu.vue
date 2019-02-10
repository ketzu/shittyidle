<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Construct</div>
        <span class="grey--text">Add buildings to your {{towntype}}!</span>
      </div>
    </v-card-title>

    <v-list two-line>
      Generators
    </v-list>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat color="purple" @click="$store.commit('settownspecs',{title:'Mayor', towntype: 'Village'})">FixMe</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "BuildMenu"
  }
</script>

<style scoped>

</style>