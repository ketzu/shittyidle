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

      <v-flex md4 offset-md1 xs10 offset-xs1 v-if="$store.getters.achievements['upgrades'] === true">
        <v-switch
            v-model="autobuyupgrades"
            label="autobuy upgrades"
        ></v-switch>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <v-switch
            v-model="densebuildingmenu"
            label="Dense building menu"
        ></v-switch>
      </v-flex>

      <v-flex md10 offset-md1>
        <v-divider></v-divider>
        <br>
        Dangerous buttons:
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <v-btn flat @click="$store.dispatch('restartsim')">
          Click if the game stopped.
        </v-btn>
      </v-flex>

      <v-flex md4 offset-md1 xs10 offset-xs1>
        <HardReset></HardReset>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import HardReset from "./Helpers/HardReset";

  export default {
    name: "Settings",
    components: {HardReset},
    data() {
      return {
        numformats: [{show: "1.23 x10^11", format: " x10^"}, {show: "1.23e11", format: "e"}, {
          show: "123B",
          format: "KMB"
        }]
      }
    },
    computed: {
      autobuyupgrades: {
        get() {
          return this.$store.getters.autoupgrade;
        },
        set(value) {
          this.$store.dispatch('setAutoupgrade', value);
        }
      },
      densebuildingmenu: {
        get() {
          return this.$store.getters.densebuildingmenu;
        },
        set(value) {
          this.$store.dispatch('setDensebuildingmenu', value);
        }
      },
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
          this.$store.dispatch('setCurrency', value);
        }
      },
      numformat: {
        get() {
          if (this.$store.getters.numberview === 1)
            return {
              show: "1.23" + this.$store.getters.numbersplitsymbol + "11",
              format: this.$store.getters.numbersplitsymbol
            };
          return {show: "123B", format: "KMB"};
        },
        set(value) {
          if (value.format === "KMB")
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