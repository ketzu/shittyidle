<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Buildings</div>
        <span class="grey--text">Add buildings to your {{towntype}}!</span>
      </div>
    </v-card-title>

    <v-list two-line>
      <transition name="fade" :key="index" v-for="(building, index) in buildings">
        <Building :type="building" v-if="building.cost.base < alltime" :count="buycount"></Building>
      </transition>
    </v-list>

    <v-card-actions>
      &nbsp;&nbsp;
      <v-slider
          v-model="buycount"
          min="1"
          max="100"
          thumb-label
          label="Multi buy"
          color="blue darken-4"
      ></v-slider>
      <v-spacer></v-spacer>
      <v-btn flat color="blue darken-4" @click="cycleCount()">
        <h2>{{buycount}}x</h2>
        <v-icon small right>fas fa-undo</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Building from "./Building.vue";

  export default {
    name: "BuildMenu",
    components: {Building},
    data() {
      return {
        shiftkey: false,
        buycountstore: 0
      }
    },
    computed: {
      buildings: {
        get() {
          return this.$store.getters.buildings;
        }
      }
    },
    methods: {
      cycleCount() {
        switch (this.buycount) {
          case 1: this.buycount = 10; break;
          case 10: this.buycount = 25; break;
          case 25: this.buycount = 100; break;
          default: this.buycount = 1;
        }
      },
      keydown(e) {
        if(e.key=="Shift" && !this.shiftkey) {
          this.shiftkey = true;
          this.buycountstore = this.buycount;
          this.buycount = 10;
        }
      },
      keyup(e) {
        if(e.key=="Shift") {
          this.shiftkey = false;
          this.buycount = this.buycountstore;
        }
      }
    },
    mounted() {
      window.addEventListener("keydown", this.keydown);
      window.addEventListener("keyup", this.keyup);
    }
  }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>