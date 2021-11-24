import Login from '../pages/Login.tsx';
import Home from '../pages/Home.tsx';

export const routerConfig = [
    {
        path : '/login',
        component: Login
    },
    {
        path : '/',
        component: Home,
        auth: true

    }
]