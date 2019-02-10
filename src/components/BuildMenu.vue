<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Construct</div>
        <span class="grey--text">Add buildings to your {{towntype}}!</span>
      </div>
    </v-card-title>

    <v-list two-line>
      <Building :type="building" :key="index" v-for="(building, index) in buildings"></Building>
    </v-list>

    <v-card-actions>
      Producing {{formatresource(resourcegain*1000/tickrate)}} per second.
      <v-spacer></v-spacer>
      <!--<v-btn flat color="purple" @click="$store.commit('settownspecs',{title:'Mayor', towntype: 'Village'})">FixMe</v-btn>-->
    </v-card-actions>
  </v-card>
</template>

<script>
  import Building from "./Building.vue"
  export default {
    name: "BuildMenu",
    components: {Building},
    computed: {
      buildings: {
        get() {
          return this.$store.getters.buildings;
        }
      }
    }
  }
</script>

<style scoped>

</style>