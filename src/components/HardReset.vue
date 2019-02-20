<template>
  <span>
  <a @click="dialog = true">HARD RESET</a>
  <v-dialog
      v-model="dialog"
      max-width="290">
    <v-card>
      <v-card-title class="headline">Hard Reset?</v-card-title>

      <v-card-text>
        This will delete all your progress, as if you started for the first time.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            color="red darken-4"
            flat="flat"
            @click="dialog = false;$store.commit('hardreset')"
        >
          Hard Reset
        </v-btn>

        <v-btn
            color="green darken-4"
            flat="flat"
            @click="dialog = false"
        >
          Keep Progress
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </span>
</template>

<script>
  export default {
    name: "HardReset",
    data() {
      return {
        dialog: false
      }
    }
  }
</script>

<style scoped>
  a {
    color: #ffffff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>