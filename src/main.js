import {createApp} from 'vue'
import vueCesium from "vue-cesium";
import ElementPlus from 'element-plus'
import App from './App.vue'
// import ElementUI from 'element-ui';
import router from './router'

import 'vue-cesium/dist/index.css'
// import 'element-ui/lib/theme-chalk/index.css';
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
// app.use(ElementUI)
app.use(vueCesium, {
    cesiumPath: './Cesium/Cesium.js'
})
app.mount('#app')
