<template>
  <div>
  <v-dialog v-model="dialog" max-width="600">
    <v-btn slot="activator" flat color="white" v-if="resettable">A new job offer! (Gain {{formatexp(expgain)}} Exp)</v-btn>
    <v-card>
      <v-card-title class="headline"  style="background-color: #2e7d32; color: white;">
        <v-icon large color="white">far fa-envelope</v-icon>
        &nbsp;You have been offered a new job!
      </v-card-title>

      <v-card-text>
        <v-container grid-list-lg>
          <v-layout align-start justify-center row wrap>
            <v-flex md10 offset-md1>
              Dear {{title}},
            </v-flex>
            <v-flex md10 offset-md1>
              the investors of a new {{towntype}} have heard of your progress. They have <b>offered you a position</b>! Your new title would stay {{title}}, though.
            </v-flex>
            <v-flex md10 offset-md1>
              You would be able to apply the <b>{{formatexp(expgain)}} experience</b> you gained here. Your experience should help you make the next {{towntype}} grow even faster!
            </v-flex>
            <v-flex md10 offset-md1>
              If you choose to accept this offer, please sign this document! You will instantly move to the place of our new {{towntype}}.
            </v-flex>
            <v-flex md10 offset-md1>
              Best and happy regards,<br>
              your assistant.
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-4" flat @click="dialog = false;$store.dispatch('softreset', {})">
          <v-icon small left>fas fa-file-signature</v-icon>
          Accept
        </v-btn>

        <v-btn color="blue darken-2" flat @click="dialog = false">
          <v-icon small left>fas fa-times</v-icon>
          Stay
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="promodialog" max-width="600" v-if="cityupgradeable">
    <v-btn slot="activator" flat color="white" v-if="resettable">A promotion offer!</v-btn>
    <v-card>
      <v-card-title class="headline"  style="background-color: #2e7d32; color: white;">
        <v-icon large color="white">far fa-envelope</v-icon>
        &nbsp;You have been offered a new job!
      </v-card-title>

      <v-card-text>
        <v-container grid-list-lg>
          <v-layout align-start justify-center row wrap>
            <v-flex md10 offset-md1>
              Dear {{title}},
            </v-flex>
            <v-flex md10 offset-md1>
              the investors of a new {{nexttowntype}} have heard of your progress. They have <b>offered you a position</b>!  It's a promotion, but your new title would stay {{title}}.
            </v-flex>
            <v-flex md10 offset-md1>
              You would <b>not be able to apply the experience</b> you have with a {{towntype}}. But your would receive <b>additional benefits</b> with this promotion!
            </v-flex>
            <v-flex md10 offset-md1>
              If you choose to accept this offer, please sign this document! You will be moved to the place of our new {{nexttowntype}}.
            </v-flex>
            <v-flex md10 offset-md1>
              Best and happy regards,<br>
              your assistant.
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-4" flat @click="promodialog = false;$store.dispatch('softreset', {upgrade: true})">
          <v-icon small left>fas fa-file-signature</v-icon>
          Accept
        </v-btn>

        <v-btn color="blue darken-2" flat @click="promodialog = false">
          <v-icon small left>fas fa-times</v-icon>
          Stay
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
  export default {
    name: "SoftReset",
    data() {
      return {
        dialog: false,
        promodialog: false
      }
    }
  }
</script>

<style scoped>

</style>