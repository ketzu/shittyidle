<template>
  <v-layout style="margin-left:15px;margin-right:15px;">
    <v-checkbox
        v-model="buytoupgrade"
        :label="$store.getters.ignoreupgradebuy?'To max':'To next upgrade (or max)'"
        color="blue darken-4"
    ></v-checkbox>
    <v-text-field v-model="buycount"
                  type="number"
                  color="blue darken-4"
                  label="Multi buy"
                  :rules="[(value)=>value>0?true:'Buy amount must be positive.']"
                  prefix="x"
                  @click:append-outer="cycleCount"
                  append-outer-icon="fas fa-undo-alt "
    ></v-text-field>
  </v-layout>
</template>

<script>
  export default {
    name: "MultiBuy",
    data() {
      return {
        shiftkey: false,
        buycountstore: 0
      }
    },
    methods: {
      cycleCount() {
        switch (this.buycount) {
          case 1:
            this.buycount = 10;
            break;
          case 10:
            this.buycount = 25;
            break;
          case 25:
            this.buycount = 100;
            break;
          default:
            this.buycount = 1;
        }
      },
      keydown(e) {
        if (e.key == "Shift" && !this.shiftkey) {
          this.shiftkey = true;
          this.buycountstore = this.buycount;
          this.buycount = 10;
        }
      },
      keyup(e) {
        if (e.key == "Shift") {
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

</style>