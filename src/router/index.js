import {createRouter, createWebHistory} from "vue-router";
import Index from '../components/Index.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Index,
        }
    ]
})
export default router;