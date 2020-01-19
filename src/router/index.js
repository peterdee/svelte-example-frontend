import Index from '../pages/Index/Index.svelte';
import Login from '../pages/Login/Login.svelte';

export const routes = [
  {
    component: Index,
    name: '/',
  },
  {
    component: Login,
    name: 'login',
  },
];
