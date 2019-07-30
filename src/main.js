// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
import axios from 'axios'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Cookies from 'js-cookie'
import method from './method/method.js'


Vue.use(Vuex)
Vue.use(ElementUI)
axios.defaults.headers.common['Authorization'] = store.state.account?store.state.account:Cookies.get('username')
Vue.prototype.$axios= axios
Vue.prototype.$method = method
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
