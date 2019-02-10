import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false

store.subscribe((mutation, state) => {
  localStorage.setItem('igame-v1', JSON.stringify(state));
});

import Data from './components/data'
Vue.mixin(Data);


Vue.mixin({
  methods: {
    formatresource(value) {
      if(value < 1000*1000*1000)
        return Math.floor(value).toLocaleString()+this.$store.getters.currency;
      let values = value.toExponential().split('e').map(i => Number(i));
      return values[0].toFixed(2)+" x10^"+values[1].toFixed(0)+this.$store.getters.currency;
    }
  }
});

new Vue({
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('initstore');
  },
  mounted() {
    this.$store.commit('startgame');
  }
}).$mount('#app')
