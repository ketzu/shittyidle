<template>
  <v-app>
    <v-toolbar dark fixed app>
      <v-toolbar-title>
        <img src="logo.png" height="35px" alt="Logo" style="margin-bottom: -8px;"> {{cityname}}
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

    <WelcomeMessage></WelcomeMessage>

    <Game></Game>
  </v-app>
</template>

<script>
import Game from './components/Game.vue';
import Changelog from "./components/Development/Changelog.vue";
import WelcomeMessage from "./components/Helpers/WelcomeMessage.vue";
import Notification from "./components/Helpers/Notification.vue";
import ImportExport from "./components/Helpers/ImportExport.vue";
import Data from './components/data';

export default {
  name: 'app',
  components: {
    Game,
    Changelog,
    ImportExport,
    Notification,
    WelcomeMessage
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
    this.bus.$on('maxupgrade', ({building}) => {
      self.notifications.push("Last upgrade reached for "+building);
    });
    this.bus.$on('notification', text => {
      self.notifications.push(text);
    });
    this.bus.$on('offlineincome', ({gain,time, now})=> {
      self.notifications.push("You gained "+this.formatresource(gain)+" for being offline for "+this.timediff(time, now));
    });
    this.bus.$on('achievement', ({title}) => {
      self.notifications.push("Achievement reached: "+title);
    });
  },
  beforeDestroy() {
    this.bus.$off('offlineincome');
    this.bus.$off('maxupgrade');
    this.bus.$off('notification');
    this.bus.$off('achievement');
  },
  mixins: [Data]
}
</script>
<style scoped>
</style>
