import GetPasswordRecoveryLink from '../pages/GetPasswordRecoveryLink/Index.svelte';
import Index from '../pages/Index/Index.svelte';
import Login from '../pages/Login/Login.svelte';
import PasswordRecovery from '../pages/PasswordRecovery/Index.svelte';
import Registration from '../pages/Registration/Registration.svelte';

export const routes = [
  {
    component: GetPasswordRecoveryLink,
    name: 'get-password-recovery-link/:email',
  },
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
    name: 'password-recovery/:code',
  },
  {
    component: Registration,
    name: 'registration',
  },
];
