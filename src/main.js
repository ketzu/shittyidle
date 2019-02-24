import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false;

store.subscribe((mutation, state) => {
  if(mutation.type === "hardreset") return;
  localStorage.setItem('cidle-v1', JSON.stringify({...state, time: (new Date()).getTime()}));
});

import Data from './components/data'
Vue.mixin(Data);


Vue.mixin({
  methods: {
    format(value) {
      if(value < 1000*1000)
        return value.toFixed(2).toLocaleString();
      let values = value.toExponential().split('e').map(i => Number(i));
      return values[0].toFixed(2)+" x10^"+values[1].toFixed(0);
    },
    formatresource(value) {
      return this.format(value)+this.$store.getters.currency;
    },
    formatexp(value) {
      if(value < 1000*1000)
        return value.toFixed(0).toLocaleString();
      return format(value);
    }
  }
});

new Vue({
  store,
  render: h => h(App),
  data() {
    return {
      buyamount: 1
    }
  },
  beforeCreate() {
    this.$store.commit('initstore');
  },
  mounted() {
    this.$store.commit('startgame');
  }
}).$mount('#app')
