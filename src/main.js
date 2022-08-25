import {createApp} from 'vue'
import vueCesium from "vue-cesium";
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';

import 'vue-cesium/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(ElementUI)
app.use(vueCesium, {
    cesiumPath: './Cesium/Cesium.js'
})
app.mount('#app')
