<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Game Development - watch the game improve</div>
        <span class="grey--text">Current Version: 0.2</span>
      </div>
    </v-card-title>

    <v-card-text>
      <v-container grid-list-lg>
        <v-layout align-start justify-center row wrap>
          <v-flex md12>
            <h2>Upcoming Features</h2>
            <br>
            <ul>
              <li>First soft reset draft</li>
              <li>Support buildings</li>
              <li>Actual gamescreen</li>
              <li>Feedback options</li>
              <li>Cross computer storage</li>
              <li>Hard reset confirmation</li>
              <li>Building efficiency indicator</li>
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

          <v-flex md12>
            <h2>Feedback and Ideas</h2>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>

  </v-card>
</template>

<script>
  export default {
    name: "Changelog"
  }
</script>

<style scoped>

</style>