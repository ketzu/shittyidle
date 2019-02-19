<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Game Development - watch the game improve</div>
        <span class="grey--text">Current Version: 0.5</span>
      </div>
    </v-card-title>

    <v-card-text>
      <v-container grid-list-lg>
        <v-layout align-start justify-center row wrap>
          <!--
          <v-flex md12>
            <h2>Feedback and Ideas</h2>

            <v-textarea
                name="feedback"
                box
                v-model="feedbacktext"
                label="Send the authors a message."
                auto-grow
                value=""
            ></v-textarea>
            <v-btn @click="submitFeedback()">
              Submit
            </v-btn>
          </v-flex>-->

          <v-flex md12>
            <h2>Upcoming Features</h2>
            <br>
            <ul>
              <li>Support buildings</li>
              <li>Actual gamescreen</li>
              <li>Feedback options</li>
              <li>Cross computer storage</li>
              <li>Hard reset confirmation</li>
              <li>Building efficiency indicator</li>
              <li>Import/Export of Game State</li>
              <li>Cloud Saves</li>
            </ul>
            &nbsp; &nbsp;...
            <br>
            <ul>
              <li>Balancing lol</li>
            </ul>
          </v-flex>

          <v-flex md12>
            <h2>Changelog</h2>
            <br>
            Version 0.5
            <ul>
              <li>Colors!</li>
              <li>New on-click menu for buildings</li>
              <li>Stats screen</li>
              <li>Multibuy improved</li>
              <li>Nerfed experience, less fun for everyone!</li>
            </ul>
            <br>
            Version 0.4.2
            <ul>
              <li>More Upgrades</li>
              <li>Bad mouseover text to show levels left for upgrade</li>
              <li>Rebalancing for even less fun!</li>
            </ul>
            <br>
            Version 0.4.1
            <ul>
              <li>Typo fixed</li>
              <li>Removed statistics unrealted to current point in game</li>
              <li>(These statistics are temporary fillers for the main screen and will be moved soon)</li>
            </ul>
            <br>
            Version 0.4
            <ul>
              <li>New URL</li>
              <li>First soft reset mechanic</li>
              <li>A few statistics</li>
              <li>Number notation change starting with 10^6</li>
            </ul>
            <br>
            Version 0.3
            <ul>
              <li>New balancing mechanic (and rebalancing)</li>
              <li>Logo and Favicon</li>
              <li>Sidemenu for devnews</li>
            </ul>
            <br>
            Version 0.2
            <ul>
              <li>Game-Dev Screen added</li>
              <li>Support buildings removed</li>
              <li>2 new buildings added</li>
              <li>Rebalanced so it's less fun</li>
            </ul>
            <br>
            Version 0.1
            <ul>
              <li>Added upgrade mechanic and some initial upgrades</li>
              <li>Added all time counter</li>
              <li>Added multibuy</li>
              <li>Added offline income</li>
            </ul>
            <br>
            Version 0.0
            <ul>
              <li>Concept of buildings added</li>
              <li>Income and layout draft</li>
            </ul>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>

  </v-card>
</template>

<script>
  export default {
    name: "Changelog",
    data() {
      return {
        feedbacktext: ""
      }
    },
    methods: {
      submitFeedback() {
        if(this.feedbacktext !== "") {

          this.feedbacktext = "";
        }
      }
    }
  }
</script>

<style scoped>

</style>