<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">Changelog</div>
        <span class="grey--text"><a class="grey--text" href="https://www.paypal.me/roughbudget" target="_blank"><v-icon>fab fa-paypal</v-icon> Support the game.</a></span><br>
        <span class="grey--text">Current Version: {{$store.getters.version}}</span>
      </div>
    </v-card-title>

    <v-card-text>
      <v-container grid-list-lg style="margin-top:-30px;">
        <v-layout align-start justify-center row wrap>
          <v-flex md12>
            <v-expansion-panels :value="0">
              <v-expansion-panel>
                <v-expansion-panel-header>Version {{$store.getters.version}}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Moved to vuetify 2.0</li>
                    <li>Removed incomplete features.</li>
                    <li>Overhaul some layouts.</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.11</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Some typos fixed.</li>
                    <li>More consistent naming.</li>
                    <li>Max buy maybe fixed.</li>
                    <li>Tried to eliminate the savegame bugs, if you have any savegame related issues, it would be nice if you could send me your savegame!</li>
                    <li>Rough city screen.</li>
                    <li>Upgrade all button fixed, should actually unlock now.</li>
                    <li>Negative building amounts should be recoverable from savegames now and not happen again.</li>
                    <li>Terrible bug I don't really understand should be gone now.</li>
                    <li>Some other bugs fixed: Buy above max buildings/infrastructure, 123B suffix broken after DD, offline income, max upgrade notification</li>
                    <li>New Settings: Auto upgrade, dense view</li>
                    <li>Settings reorganisation: Hard reset and other dangerous buttons</li>
                    <li>Support button is now in the dev menu and the footer is gone</li>
                    <li>Tabs: Now with icons to have more space and in slightly different order</li>
                    <li>Welcome sign changed, should look better with different city names, maybe worse with some</li>
                    <li>New players receive a 20ep boost during their first run</li>
                    <li>Building list entry is now fully clickable</li>
                    <li>Max buy uses stepsize of multibuy instead of fixed 10</li>
                    <li>Time bug should be fixed now</li>
                    <li>Research 2 middle now provides 40x boost insteadt of 1.001x (I thought I was making it 1.001<sup>level</sup>)</li>
                    <li>Research: Only unlocked by exp, doesn't cost exp anymore.</li>
                    <li>Research: Byebye cats. :(</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.10</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Massive exp multiplier nerf.</li>
                    <li>Setting to build to max you can afford and ignore upgrades.</li>
                    <li>Infrastrucutre is limited to 700 for now.</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.9</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Bug in the calculations broke a lot of things, should be gone now.</li>
                    <li>Research bug #1: No buying multiple researches of the same type or multiple times.</li>
                    <li>First impression of research if you reached 'large city' (aka second promotion).</li>
                    <li>Exp gain function changed, more exp in the beginning, less exp in the end.</li>
                    <li>Zoning (previously called citygrid) was shown too late (after 4th reset) is now shown after first reset.</li>
                    <li>Time bug (00:29 -> 01:30) fixed.</li>
                    <li>Last three infrastructure builds are stored over time!</li>
                    <li>First indicator of improvements by building infrastrucutre.</li>
                    <li>Offline time indicator. (Mostly to find the offline income bug that shouldn't exist :( )</li>
                    <li>Help page updated.</li>
                    <li>Exp gain buffed again, might break the game.</li>
                    <li>Thank you note to Filip and bug reporters!</li>
                    <li>Upgrades need to be bought now (for now only for a symbolic cost, the game needs to get worse step by step, not all at once!).</li>
                    <li>New settings option: Upgrade indicator.</li>
                    <li>Auto upgrades can be unlocked by resetting without any upgrades.</li>
                    <li>Soft reset requirement is now 85 gambling dens.</li>
                    <li>Maybe the visual bug for >100% and non updating info on upgrades is gone now. Please please be gone.</li>
                    <li>Hard nerf for experience gain starting at 100k experience gained.</li>
                    <li>Experimental buildings limit to 7000 per Building.</li>
                    <li>Cost display bug (should now show and lockout with correct cost).</li>
                    <li>Citygrid should provide more noticable cost reduction, but there is a bug that prevents the cost values from updating.</li>
                    <li>Achievements beta.</li>
                    <li>Buy to next upgrade buys to max in 10 increments if no upgrade is possible. (Including infrastructure)</li>
                    <li>Feature release indicator</li>
                    <li>City Grid (Beta)</li>
                    <li>Time tracking statistics</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.8</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Exp over 1M crashed the game.</li>
                    <li>City upgrade to large city is possible for two more infrastructures, more features soon.</li>
                    <li>Notifications for upgrades are not only "last upgrade reached".</li>
                    <li>Maybe fixed export bug only once refreshing the state.</li>
                    <li>Promotions should show up again.</li>
                    <li>Fixed unit number format giving undefined for small values.</li>
                    <li>Removed preview as it was causing confusion.</li>
                    <li>Added settings tab with number format and currency.</li>
                    <li>Attempt at fixing running in inactive tabs, if your gain fully stops for any reason, please let me know and try the emergency button in the settings.</li>
                    <li>Removed max upgrade text, now a small badge is shown on the icon of the building.</li>
                    <li>Added information i, indication a clickable part.</li>
                    <li>Notification for online income.</li>
                    <li>Multi buy until next update+rework</li>
                    <li>Starting Picture Font change</li>
                    <li>Welcome screen for new players</li>
                    <li>City name can now be changed.</li>
                    <li>Feedback directly on the side.</li>
                    <li>Changelog expandable and reduction to main versions.</li>
                    <li>Notifications now stack instead of overwrite.</li>
                    <li>Bug removed from infrastructure.</li>
                    <li>Notifications for upgrades added.</li>
                    <li>First promotion introduced!</li>
                    <li>Support buildings can be unlocked</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.7</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Upgrade list now contains multiplier of that upgrade</li>
                    <li>New data layout for upgrades</li>
                    <li>Corrected upgrade multiplier of farm</li>
                    <li>Tabbing introduction, statistics moved</li>
                    <li>Exp gain listed on job change button</li>
                    <li>Soft Reset confirmation</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.6</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Exp nerfed, for some reason it's still too much fun.</li>
                    <li>Import/Export added</li>
                    <li>Less accidental clicking and having to restart. (Hard Reset confirmation)</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.5</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Colors!</li>
                    <li>New on-click menu for buildings</li>
                    <li>Stats screen</li>
                    <li>Multibuy improved</li>
                    <li>Nerfed experience, less fun for everyone!</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.4</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>More Upgrades</li>
                    <li>Bad mouseover text to show levels left for upgrade</li>
                    <li>Rebalancing for even less fun!</li>
                    <li>Typo fixed</li>
                    <li>Removed statistics unrealted to current point in game</li>
                    <li>(These statistics are temporary fillers for the main screen and will be moved soon)</li>
                    <li>New URL</li>
                    <li>First soft reset mechanic</li>
                    <li>A few statistics</li>
                    <li>Number notation change starting with 10^6</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.3</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>New balancing mechanic (and rebalancing)</li>
                    <li>Logo and Favicon</li>
                    <li>Sidemenu for devnews</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.2</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Game-Dev Screen added</li>
                    <li>Support buildings removed</li>
                    <li>2 new buildings added</li>
                    <li>Rebalanced so it's less fun</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.1</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Added upgrade mechanic and some initial upgrades</li>
                    <li>Added all time counter</li>
                    <li>Added multibuy</li>
                    <li>Added offline income</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>Version 0.0</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li>Concept of buildings added</li>
                    <li>Income and layout draft</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>

  </v-card>
</template>

<script>
  import {storagename} from "../../statics/statics";

  export default {
    name: "Changelog"
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
