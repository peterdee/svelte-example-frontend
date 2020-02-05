<script>
  import axios from 'axios';
  import { navigateTo } from 'svelte-router-spa';

  import { getTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  import Error from '../../reusable/Error.svelte';
  import Form from './Form.svelte';
  import Info from './Info.svelte';
  import Loader from '../../reusable/Loader.svelte';

  export let currentRoute = {};
  export let params; // this is not used, investigate the router module

  let formError = '';
  let highlight = {
    confirmNewPassword: '',
    newPassword: '',
  };
  let isLoading = false;
  let passwordSubmitted = false;
  let data = {
    confirmNewPassword: '',
    newPassword: '',
  };

  // if the email address was passed
  const { namedParams: { code = '' } = {} } = currentRoute;

  // make sure that the header is hidden
  store.setShowHeader(false);

  // redirect to index if the token is there
  if (getTokens().accessToken) {
    navigateTo('/');
  }

  /**
   * Handle form submit
   * @returns {*}
   */
  const handleForm = async () => {
    // check the data
    const keys = Object.keys(data);
    if (keys.some((key = '') => !data[key])) {
      keys.forEach((key = '') => highlight[key] = (!data[key] && 'error') || '');
      return formError = 'Please provide the necessary data!';
    }

    // check the passwords
    if (data.confirmNewPassword !== data.newPassword) {
      keys.forEach((key = '') => highlight[key] = 'error');
      return formError = 'Password confirmation is incorrect!';
    }

    // highlight inputs, start loading
    formError = '';
    keys.forEach((key = '') => highlight[key] = 'success');
    isLoading = true;

    // send the request
    try {
      await axios({
        data: {
          code,
          newPassword: data.newPassword,
        },
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/password-recovery/submit-password',
      });
      
      // stop the loader
      isLoading = false;

      // show the info page
      return passwordSubmitted = true;
    } catch (error) {
      // remove the loader
      isLoading = false;

      // handle error response
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;
      if (info === 'INVALID_DATA' && status === 400) {
        const { invalid = [] } = data;
        invalid.forEach((field = '') => highlight[field] = 'error');
        return formError = 'Invalid data!';
      }
      if (info === 'MISSING_DATA' && status === 400) {
        const { missing = [] } = data;
        missing.forEach((field = '') => highlight[field] = 'error');
        return formError = 'Missing data!';
      }

      keys.forEach((field = '') => highlight[field] = '');
      if (info === 'ACCESS_DENIED' && status === 401) {
        return formError = 'Access denied!';
      }
      if (info === 'EXPIRED_RECOVERY_CODE' && status === 403) {
        return formError = 'Recovery code expired!';
      }
      if (info === 'INVALID_RECOVERY_CODE' && status === 403) {
        return formError = 'Recovery code is invalid!';
      }  
      if (info === 'INTERNAL_SERVER_ERROR' && status === 500) {
        return formError = 'Oops! Something went wrong...';
      }

      return formError = 'Access denied!';
    }
  };

  /**
   * Handle text inputs
   * @param name {string} - input name
   * @param value {number|string} - input value
   * @returns {*}
   */
  const handleInput = ({ detail: { name = '', value = '' } = {} }) => {
    data[name] = value;
    formError = '';
    highlight[name] = '';
  }
</script>

<div class="page-wrap">
  <Loader { isLoading } />
  <div class="margin page-title noselect">
    Password Recovery
  </div>
  {#if passwordSubmitted}
    <Info />
  {:else}
    <div class="page-subtitle margin noselect">
      Please provide your new password
    </div>  
    <Form
      { isLoading }
      confirmNewPasswordHighlight={highlight.confirmNewPassword}
      newPasswordHighlight={highlight.newPassword}
      on:handle-form={handleForm}
      on:handle-input={handleInput}
    />
  {/if}
  <Error message={formError} />
  <div class="center margin noselect">
    <a
      class={ isLoading ? 'disable-link' : '' }
      href="/login"
    >
      Back to Login
    </a>
  </div>
</div>

<style>
  .center {
    text-align: center;
  }
  .disable-link {
    color: #909090;
    cursor: default;
    pointer-events: none;
    text-decoration: none;
  }
  .margin {
    margin-bottom: 15px;
  }
  .page-title {
    font-size: 2em;
    font-weight: 100;
    text-align: center;
    text-transform: uppercase;
  }
  .page-subtitle {
    font-size: 1em;
    font-weight: 300;
    text-align: center;
  }
  .page-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: auto auto;
    width: 325px;
  }
</style>
