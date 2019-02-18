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

      <span v-if="resets > 0"><br>Produced {{formatresource(resetresource)}} this reset.</span>

      <br>
      Produced {{formatresource(alltime)}} all time.

      <span v-if="resets > 0"><br>Your experience gives you a {{format(expmult)}}x multiplier.</span>

      <span v-if="resettable || resets > 0"><br>A job change would gain you {{formatexp(expgain)}} experience.</span>
    </v-card-text>

    <v-card-actions>
      <v-btn flat color="blue darken-2" @click="$store.dispatch('cheat')" v-if="!resettable">Cheat.</v-btn>

      <v-spacer></v-spacer>

      <transition name="fade">
        <v-btn flat color="blue darken-2" @click="findNewJob()" v-if="resettable">Find a new job.</v-btn>
      </transition>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "CityScreen",
    methods: {
      findNewJob() {
        this.$store.dispatch('softreset', {});
      }
    }
  }
</script>

<style scoped>

</style>