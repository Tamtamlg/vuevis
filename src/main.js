import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import vue2vis from '../node_modules/vue2vis/dist/vue2vis'

// Vue.use(vue2vis)

// Vue.component('timeline', vue2vis.Timeline);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
