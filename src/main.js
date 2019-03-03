import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store,{eventBus, evalGrid} from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false;

// Store the Vuex store in localstorage on changes
store.subscribe((mutation, state) => {
  if(mutation.type === "hardreset") return;
  localStorage.setItem('cidle-v1', JSON.stringify({...state, time: (new Date()).getTime()}));
});

import Data from './components/data'
Vue.mixin(Data);

Vue.mixin({
  computed: {
    bus() {
      return eventBus;
    }
  }
});

Vue.mixin({
  methods: {
    format(value) {
      if(this.$store.getters.settings.numberview === 2) {
        const letters = ['','K','M','B','T','q','Q','s','S','O','N','D','U','DD'];
        let letter = Math.max(Math.floor(Math.log(value) / Math.log(1000)),0);
        let output = (value/Math.pow(1000,letter)).toFixed(2);
        if(letter>letters.length) {
          letter-=letters.length;
          let firstletter = String.fromCharCode(97 + letter/26);
          let secondletter = String.fromCharCode(97 + letter%26);
          return output+firstletter+secondletter;
        }
        return output+letters[letter];
      }
      // default format
      if(value < 1000*1000)
        return value.toFixed(2).toLocaleString();
      let values = value.toExponential().split('e').map(i => Number(i));
      return values[0].toFixed(2)+this.$store.getters.settings.numbersplitsymbol+values[1].toFixed(0);
    },
    formatresource(value) {
      return this.format(value)+this.$store.getters.currency;
    },
    formatexp(value) {
      if(value < 1000*1000)
        return value.toFixed(0).toLocaleString();
      return this.format(value);
    }
  }
});

new Vue({
  store,
  render: h => h(App),
  data() {
    return {
      buyamount: 1,
      buytoupg: false,
      _buildings: {},
      _infrastructure: {},
      kongapi: undefined
    }
  },
  beforeCreate() {
    this.$store.commit('initstore', this);
    let self = this;
    kongregateAPI.loadAPI(()=>{
      self.kongapi=kongregateAPI.getAPI();

      let buildinglevels = self.$store.getters.buildinglevels;
      let count = 0;
      for(let b in buildinglevels){
        if(buildinglevels.hasOwnProperty(b)) {
          count+=buildinglevels[b];
        }
      }
      let infralevels = self.$store.getters.infrastructurelevels;
      for(let i in infralevels){
        if(infralevels.hasOwnProperty(i)) {
          count+=infralevels[i];
        }
      }
      self.kongapi.stats.submit("Resets", self.$store.getters.resets);
      self.kongapi.stats.submit("Buildings", count);
      self.kongapi.stats.submit("Zeros", Math.log10(self.$store.getters.alltime));

    });
  },
  mounted() {
    this.$store.commit('startgame');
  }
}).$mount('#app')
