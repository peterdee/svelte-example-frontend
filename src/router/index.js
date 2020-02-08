import AccountRecovery from '../pages/AccountRecovery/Index.svelte';
import GetAccountRecoveryLink from '../pages/GetAccountRecoveryLink/Index.svelte';
import GetPasswordRecoveryLink from '../pages/GetPasswordRecoveryLink/Index.svelte';
import Index from '../pages/Index/Index.svelte';
import Login from '../pages/Login/Login.svelte';
import Logout from '../pages/Logout/Index.svelte';
import PasswordRecovery from '../pages/PasswordRecovery/Index.svelte';
import Profile from '../pages/Profile/Index.svelte';
import Registration from '../pages/Registration/Registration.svelte';

export const routes = [
  {
    component: AccountRecovery,
    name: 'account-recovery/:code',
  },
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
    component: Logout,
    name: 'logout',
  },
  {
    component: PasswordRecovery,
    name: 'password-recovery/:code',
  },
  {
    component: Profile,
    name: 'profile',
  },
  {
    component: Registration,
    name: 'registration',
  },
];
