<template>
  <v-container grid-list-lg>
    <v-layout align-start justify-center row wrap>
      <v-flex xs10 offset-xs1>
        This is an idle game, you gain currency by waiting and buying things, that shorten the waiting time.
      </v-flex>
      <v-flex xs10 offset-xs1>
        There is an <b>offline income</b> mechanic. As soon as you bought your first building, you will gain the same amount of currecy, no matter if you are offline or online.
        Offline income will only work for a <b>maximum of 30 days</b> at a time.
      </v-flex>
      <v-flex xs10 offset-xs1>
        You can change how many buildings you buy at a time with the <b>multi buy</b> feature. Either use the slider to adjust the number of buildings or press the button initally marked as 1x, it will cycle through the numbers 1, 10, 25 and 100.
        If you press the <b>shift key</b>, you can buy 10 buildings at a time. This will remember your last setting.
      </v-flex>
      <v-flex xs10 offset-xs1>
        This project was created to show a friend JavaScript, we discuss and continue to work on it together. The aspirations for our first game are very high, as the name indicates.
      </v-flex>
      <v-flex xs10 offset-xs1>
        The <b>first soft reset</b> is currently available at <b>100 gambling dens</b>.
      </v-flex>
      <v-flex xs10 offset-xs1>
        If you want to contact us, feel free to <a href="mailto:developers@shittyidle.com">send an email</a>, use the feedback form in the side menu or <a href="https://reddit.com/u/ketzu">ask me on reddit</a>.
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "Help"
  }
</script>

<style scoped>
  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>