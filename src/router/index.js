import VueRouter from "vue-router"
import Vue from 'vue'
Vue.use(VueRouter)
import Index from '../components/Index.vue';

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: "index",
            component: Index,
        }
    ]
})
export default router;