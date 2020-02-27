<template>
  <v-dialog v-model="$store.getters.startofgamedialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="headline"  style="background-color: #2e7d32; color: white;">
        <v-icon large color="white">far fa-envelope</v-icon>
        &nbsp;Your first job as a {{title}}.
      </v-card-title>

      <v-card-text>
        <v-container grid-list-lg>
          <v-layout align-start justify-center row wrap>
            <v-flex md10 offset-md1>
              Welcome {{title}},
            </v-flex>
            <v-flex md10 offset-md1>
              I am your assistant and this is your new {{towntype}}! It will take some time, but you will surely create something awe inspiring on these empty plains.
            </v-flex>
            <v-flex md10 offset-md1>
              Many jobs await you, but you should not burden yourself with every aspect of town building. Some <b>more complex tasks require a lot of experience</b>.
            </v-flex>
            <v-flex md10 offset-md1>
              First lets use these open fields and start a farm to create some jobs and produce some food. We can sell it to neighboring towns to make some money.
            </v-flex>
            <v-flex md10 offset-md1>
              I am sure, if we can <b>improve our buildings 100 times</b>, we can impress everyone in a wide radius and <b>gain some experience</b> on the way.
            </v-flex>
            <v-flex md10 offset-md1>
              Good luck and regards,<br>
              your assistant.
            </v-flex>
            <v-flex md10 offset-md1>
              ps: For you first job, I will assist you, providing you <b>20 experience.</b>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-4" text @click="$store.dispatch('startGame')">
          <v-icon small left>fas fa-file-signature</v-icon>
          Accept responsibilities
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "WelcomeMessage"
  }
</script>

<style scoped>

</style>
