import { createWebHistory, createRouter } from 'vue-router'

import DashboardPage from '@/pages/DashboardPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import PasswordPage from '@/pages/PasswordPage.vue';
import UpdatePage from '@/pages/UpdatePage.vue';
import InvitePage from '@/pages/InvitePage.vue';
import MessagePage from '@/pages/MessagePage.vue';

const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true';
const routes = [
    { path: '/', component: DashboardPage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/profile', component: ProfilePage },
    { path: '/password', component: PasswordPage },
    { path: '/update', component: UpdatePage },
    { path: '/invite/:id', component: InvitePage },
    { path: '/message/:id', component: MessagePage },
    { path: '/message', component: MessagePage },
    { path: '/logout', component: null },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach((to, from, next) => {
    if (to.path === '/logout') {
        localStorage.removeItem('isAuthenticated'); // Clear auth state
        next('/login'); // Redirect to login
        return; // Stop further execution
    }
    
    if (isAuthenticated()) {
        if (to.path === '/login' || to.path === '/register') {
            next('/');
        } else {
            next();
        }
    } else {
        if (to.path !== '/login' && to.path !== '/register') {
            next('/login');
        } else {
            next();
        }
    }
});

export default router;