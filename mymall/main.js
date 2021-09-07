import Vue from 'vue'
import App from './App'
import store from './store'
import {
	msg,
	isLogin,
	debounce,
	throttle,
	prePage,
	date
} from '@/common/util'

// 全局混入组件
import mixin from '@/common/mixin'
Vue.mixin(mixin) 

Vue.prototype.$store = store
Vue.prototype.$util = {
	msg,
	isLogin,
	debounce,
	throttle,
	prePage,
	date
}
// 注册全局组件
// import MescrollBody from "@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body.vue"
// import MescrollUni from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-uni.vue"
// Vue.component('mescroll-body', MescrollBody)
// Vue.component('mescroll-uni', MescrollUni)

// #ifndef VUE3
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif