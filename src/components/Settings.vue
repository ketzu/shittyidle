<template>
  <v-container grid-list-lg>
    <v-layout align-start justify-center row wrap>
      <v-flex xs10 offset-xs1>
        All the settings you might want.
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <v-text-field
            v-model="currencychange"
            label="Currency"
        >
        </v-text-field>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
          <v-select
              v-model="numformat"
              :items="numformats"
              item-text="show"
              item-value="format"
              label="Number format"
              return-object
              single-line
          ></v-select>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <v-text-field
            label="City name"
            v-model="newcityname"
        ></v-text-field>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <v-switch
            v-model="indicateupgrades"
            label="Indicate next upgrade level"
        ></v-switch>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <v-switch
            v-model="ignoreupgradebuy"
            label="'To upgrade or max' becomes only max"
        ></v-switch>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <v-btn @click="$store.dispatch('restartsim')">
          Click if the game stopped.
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "Settings",
    data() {
      return {
        numformats: [{show: "1.23 x10^11", format: " x10^"}, {show: "1.23e11", format: "e"}, {show: "123B", format: "KMB"}]
      }
    },
    computed: {
      newcityname: {
        get() {
          return this.cityname;
        },
        set(value) {
          this.$store.dispatch('setCityname', value);
        }
      },
      ignoreupgradebuy: {
        get() {
          return this.$store.getters.ignoreupgradebuy;
        },
        set(value) {
          this.$store.dispatch('setIgnoreupgradebuy', value);
        }
      },
      indicateupgrades: {
        get() {
          return this.upgradeindicator;
        },
        set(value) {
          this.$store.dispatch('setUpgradeindicator', value);
        }
      },
      currencychange: {
        get() {
          return this.currency;
        },
        set(value) {
          this.$store.dispatch('setCurrency',value);
        }
      },
      numformat: {
        get() {
          if(this.$store.getters.numberview === 1)
            return {show: "1.23"+this.$store.getters.numbersplitsymbol+"11", format: this.$store.getters.numbersplitsymbol};
          return {show: "123B", format: "KMB"};
        },
        set(value) {
          if(value.format==="KMB")
            this.$store.dispatch('setNumberformat', {symbol: value.format, view: 2});
          else
            this.$store.dispatch('setNumberformat', {symbol: value.format, view: 1});
        }
      }
    }
  }
</script>

<style scoped>

</style>