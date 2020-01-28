import Index from '../pages/Index/Index.svelte';
import Login from '../pages/Login/Login.svelte';
import PasswordRecovery from '../pages/PasswordRecovery/PasswordRecovery.svelte';
import Registration from '../pages/Registration/Registration.svelte';

export const routes = [
  {
    component: Index,
    name: '/',
  },
  {
    component: Login,
    name: 'login',
  },
  {
    component: PasswordRecovery,
    name: 'password-recovery',
  },
  {
    component: Registration,
    name: 'registration',
  },
];
