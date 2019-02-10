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
