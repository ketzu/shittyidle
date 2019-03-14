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
        The <b>first soft reset</b> is currently available at <b>85 gambling dens</b>.
      </v-flex>
      <v-flex xs10 offset-xs1>
        Soft resets grant you <b>experience</b> depending on the currency earned this run. Between 0 and 1000 experience each point grants you roughly 4% production bonus. After reaching 1k experience the production bonus changes to <b>e<sup>ln(x)/ln(ln(x))</sup></b> , where x is your current experience.
      </v-flex>
      <v-flex xs10 offset-xs1>
        The first soft reset also grants you the <b>city zoning</b> feature in which you can place districts to get a discount on buildings.
      </v-flex>
      <v-flex xs10 offset-xs1>
        Once you accumulated 1000 experience you can get your first <b>promotion</b> to increase your city level. Each time you increase your city level the available space in your city zoning is increased. Additionally new features are unlocked.
        The first promotion at 1000 experience unlocks <b>infrastructure</b>, the second promotion at 100k experience unlocks research. Each promotion resets your experience to 0.
      </v-flex>
      <v-flex xs10 offset-xs1>
        Infrastructure gives you the ability to build buff structures which increase certain buildings. Infrastructure is reset each soft reset.
      </v-flex>
      <v-flex xs10 offset-xs1>
        Research give you a tech tree in which you can unlock multiple tiers of research, every tier you have a 1 out of 3 choice to make. Researches are paid with experience, but it's not really spend, only locked for this run. Researches reset each soft reset.
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