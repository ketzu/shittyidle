<template>
  <v-container grid-list-lg>
    <v-layout align-start justify-center row wrap>
      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{formatresource(resourcegain*1000/tickrate)}}</h2>
        <span class="subitem">production per second</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1 v-if="resets > 0">
        <h2 class="stat">{{formatresource(resetresource)}}</h2>
        <span class="subitem">production this reset</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{formatresource(alltime)}}</h2>
        <span class="subitem">all time production</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{format(expmult)}}x</h2>
        <span class="subitem">experience multiplier (to all buildings)</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{formatexp(experience)}}</h2>
        <span class="subitem">current experience</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{formatexp(expgain)}}</h2>
        <span class="subitem">experience gain</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{$store.getters.oldversion}}</h2>
        <span class="subitem">first version you saw</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{$store.getters.version}} (Kong)</h2>
        <span class="subitem">current version</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{format($store.getters.achievementmult*100)}}%</h2>
        <span class="subitem">improvement by achievements</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <h2 class="stat">{{timeall}}</h2>
        <span class="subitem">time played</span>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1 v-if="resets > 0">
        <h2 class="stat">{{timereset}}</h2>
        <span class="subitem">time since last reset</span>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "Stats",
    data() {
      return {
        now: Date.now()
      }
    },
    computed: {
      timereset() {
        return this.timediff(this.$store.getters.timereset, this.now);
      },
      timeall() {
        return this.timediff(this.$store.getters.timeall, this.now);
      }
    },
    created() {
      setInterval(()=>{
        this.now = Date.now();
      },1000);
    }
  }
</script>

<style scoped>
  .stat {
    font-weight: normal;
  }

  .subitem {
    font-weight: normal;
  }

</style>