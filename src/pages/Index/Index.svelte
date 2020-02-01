<script>
  import axios from 'axios';
  import { Navigate } from 'svelte-router-spa';
  import { onMount } from 'svelte';

  import { deleteTokens, getTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  $: loggedIn = $store.auth.loggedIn;

  /**
   * Handle logging out from a single device
   * @returns {*}
   */
  const logout = async () => {
    const { accessToken = '', refreshToken = '' } = getTokens();
    try {
      await axios({
        data: { refreshToken },
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/logout',
      });

      store.setLoggedIn(false);
      return deleteTokens();
    } catch (error) {
      return deleteTokens();
    }
  };

    /**
   * Handle logging out from all devices
   * @returns {*}
   */
  const logoutAll = async () => {
    const { accessToken = '' } = getTokens();
    try {
      await axios({
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        method: 'GET',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/logout/all',
      });
      
      store.setLoggedIn(false);
      return deleteTokens();
    } catch (error) {
      return deleteTokens();
    }
  };

  /**
   * On component mounting
   */
  onMount(() => {
    const { accessToken = '' } = getTokens();
    if (accessToken) {
      return store.setLoggedIn(true);
    }
  });
</script>

<div class="page-wrap">
  <h1>Index</h1>

  <div>Logged in: {loggedIn}</div>

  <p><Navigate to="login">Login</Navigate></p>
  <p><Navigate to="password-recovery">Password recovery</Navigate></p>
  <p><Navigate to="registration">Registration</Navigate></p>
  {#if loggedIn}
    <div on:click={logout}>Log out from a single device</div>
    <div on:click={logoutAll}>Log out from all devices</div>
  {/if}
</div>

<style>
  h1 {
    color: #ff3e00;
    font-size: 2em;
    font-weight: 100;
    text-transform: uppercase;
  }
  .page-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    margin: 0 auto;
  }
</style>
