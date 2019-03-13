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
        You can change how many buildings you buy at a time with the <b>multi buy</b> feature. Press the loop button, it will cycle through the numbers 1, 10, 25 and 100, or change the number directly.
        If you press the <b>shift key</b>, you can buy 10 buildings at a time. This will remember your last setting. Setting the "to upgrade or max" checkmark will set the multi buy for each building for the next upgrade level, or, if no upgrades are left of the settings are set to max only, to the maximum you can afford.
      </v-flex>
      <v-flex xs10 offset-xs1>
        The <b>first soft reset</b> is currently available at <b>85 gambling dens</b>. A soft reset will reward you with experience, depending on the amount of currency earned in your current run. <b>Experience</b> will give you a multiplier on your income.
      </v-flex>
      <v-flex xs10 offset-xs1>
        If you have earned enough experience, you can get noticed by headhunters and receive a promotion. This also resets your game, but you will unlock new features. The first promotion awaits you at <b>1000 experience</b>, while the second one is at 100k.
        Getting a promotion will reset your experience, as you have no experience with this new job!
      </v-flex>
      <v-flex xs10 offset-xs1>
        If you want to contact us, feel free to <a href="mailto:developers@shittyidle.com">send an email</a>, use the feedback form in the side menu or <a href="https://reddit.com/r/shittyidle">ask me on reddit</a>.
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