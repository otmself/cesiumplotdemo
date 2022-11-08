// import {createApp} from 'vue'
// import ElementPlus from 'element-plus'
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import router from '@/router'

// import 'vue-cesium/dist/index.css'
import 'element-ui/lib/theme-chalk/index.css';
// import 'element-plus/dist/index.css'

// const app = createApp(App)
// app.use(router)
// app.use(ElementPlus)
// app.use(ElementUI)

Vue.use(ElementUI)
// Vue.use(router)
new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
// app.mount('#app')
