<script>
  import axios from 'axios';
  import { navigateTo } from 'svelte-router-spa';

  import { getTokens } from '../../utilities/tokens';

  import Error from '../../reusable/Error.svelte';
  import Loader from '../../reusable/Loader.svelte';
  import PasswordRecoveryForm from './PasswordRecoveryForm.svelte';
  import PasswordRecoveryInfo from './PasswordRecoveryInfo.svelte';

  let emailSent = false;
  let formError = '';
  let highlight = {
    email: '',
  };
  let isLoading = false;
  let recoveryData = {
    email: '',
  };

  // redirect to index if the token is there
  if (getTokens().accessToken) {
    navigateTo('/');
  }

  /**
   * Handle form submit
   */
  const handleForm = async () => {
    // check the data
    const { email = '' } = recoveryData;
    if (!email) {
      highlight.email = 'error';
      return formError = 'Please provide the necessary data!';
    }

    // highlight inputs, start loading
    formError = '';
    highlight.email = 'success';
    isLoading = true;

    // send the login request
    try {
      // const response = await axios({
      //   data: { ...recoveryData },
      //   method: 'POST',
      //   url: 'https://express-mongo-node.herokuapp.com/api/v1/password-recovery/send-email',
      // });
      
      // stop the loader
      isLoading = false;

      // redirect to the index
      // return navigateTo('/');
      return emailSent = true;
    } catch (error) {
      // remove the loader
      isLoading = false;

      // handle error response
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;
      if (info === 'ACCESS_DENIED' && status === 401) {
        highlight.email = highlight.password = 'error';
        return formError = 'Access denied!';
      }
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
      
      highlight.email = highlight.password = '';      
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
    recoveryData[name] = value;
    highlight[name] = '';
    formError = '';
  }
</script>

<div class="page-wrap">
  <Loader { isLoading } />
  <div class="margin page-title noselect">
    Password Recovery
  </div>
  {#if emailSent}
    <PasswordRecoveryInfo email={recoveryData.email} />
  {:else}
    <div class="margin page-subtitle noselect">
      Please provide your email address
    </div>  
    <PasswordRecoveryForm
      { isLoading }
      emailHighlight={highlight.email}
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
