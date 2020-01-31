import GetPasswordRecoveryLink from '../pages/GetPasswordRecoveryLink/Index.svelte';
import Index from '../pages/Index/Index.svelte';
import Login from '../pages/Login/Login.svelte';
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
    component: GetPasswordRecoveryLink,
    name: 'get-password-recovery-link/:email',
  },
  {
    component: Registration,
    name: 'registration',
  },
];
