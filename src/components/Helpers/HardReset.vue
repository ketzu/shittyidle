<template>
  <div>
  <v-btn flat @click="dialog = true" color="red darken-4">
    HARD RESET!
  </v-btn>
  <v-dialog
      v-model="dialog"
      max-width="350">
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
  </div>
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
</style>