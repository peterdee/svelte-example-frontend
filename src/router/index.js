import GetAccountRecoveryLink from '../pages/GetAccountRecoveryLink/Index.svelte';
import GetPasswordRecoveryLink from '../pages/GetPasswordRecoveryLink/Index.svelte';
import Index from '../pages/Index/Index.svelte';
import Login from '../pages/Login/Login.svelte';
import PasswordRecovery from '../pages/PasswordRecovery/Index.svelte';
import Registration from '../pages/Registration/Registration.svelte';

export const routes = [
  {
    component: GetAccountRecoveryLink,
    name: 'get-account-recovery-link/:email',
  },
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
