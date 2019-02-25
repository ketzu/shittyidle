<template>
  <v-app>
    <v-toolbar dark fixed app>
      <v-toolbar-title>
        <img src="logo.png" height="35px" alt="Logo" style="margin-bottom: -8px;"> City Idle
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <h2>{{formatresource(resource)}}</h2>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <h2 v-if="resets >= 1">{{formatexp(experience)}} Exp</h2>

      <v-spacer></v-spacer>

      <ImportExport></ImportExport>
      <v-btn icon id="sidemenutoggle" @click="sidemenu = !sidemenu">
        <v-icon>fas fa-code-branch</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer fixed v-model="sidemenu" app right>
      <Changelog></Changelog>
    </v-navigation-drawer>

    <Notification v-on:done="done(index)" :key="index" :text="notification" v-for="(notification, index) in notifications"></Notification>

    <Game></Game>

    <v-footer app dark height="auto" absolute>
      <v-layout justify-center row wrap>
        <v-spacer></v-spacer>
        <a href="https://www.paypal.me/roughbudget">Support the game.</a>
        <v-spacer></v-spacer>
        <HardReset></HardReset>
        <v-spacer></v-spacer>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import Game from './components/Game.vue';
import Changelog from "./components/Changelog.vue";
import Notification from "./components/Notification.vue";
import HardReset from "./components/HardReset.vue";
import ImportExport from "./components/ImportExport.vue";
import Data from './components/data';

export default {
  name: 'app',
  components: {
    Game,
    Changelog,
    ImportExport,
    HardReset,
    Notification
  },
  data() {
    return {
      sidemenu: false,
      notifications: []
    }
  },
  methods: {
    done(index) {
      this.notifications.splice(index,1);
    }
  },
  created() {
    const self = this;
    this.bus.$on('upgrade', ({building, upgrade}) => {
      console.log("Upgrade notification");
      self.notifications.push(upgrade.gain+"x upgrade for "+building);
    });
    this.bus.$on('notification', text => {
      self.notifications.push(text);
    });
  },
  beforeDestroy() {
    this.bus.$off('upgrade');
    this.bus.$off('notification');
  },
  mixins: [Data]
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
