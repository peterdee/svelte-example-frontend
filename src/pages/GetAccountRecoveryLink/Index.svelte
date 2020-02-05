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

  let data = {
    email: '',
  };
  let emailSent = false;
  let formError = '';
  let highlight = {
    email: '',
  };
  let isLoading = false;

  // if the email address was passed
  const { namedParams: { email: passedEmail = '' } = {} } = currentRoute;
  data.email = passedEmail;

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
    const { email = '' } = data;
    if (!email) {
      highlight.email = 'error';
      return formError = 'Please provide the necessary data!';
    }

    // highlight inputs, start loading
    formError = '';
    highlight.email = 'success';
    isLoading = true;

    // send the request
    try {
      await axios({
        data,
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/account-recovery/send-email',
      });
      
      // stop the loader
      isLoading = false;

      // show the info page
      return emailSent = true;
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
      if (info === 'ACCESS_DENIED' && status === 401) {
        highlight.email = 'error';
        return formError = 'Account not found!';
      }
      
      highlight.email = '';      
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
    highlight[name] = '';
    formError = '';
  }
</script>

<div class="page-wrap">
  <Loader { isLoading } />
  <div class="margin page-title noselect">
    Account Recovery
  </div>
  {#if emailSent}
    <Info />
  {:else}
    <div class="page-subtitle error margin noselect">
      Your account was blocked due to the large number of failed login attempts
    </div> 
    <div class="page-subtitle margin noselect">
      Please provide your email address to unblock your account
    </div>  
    <Form
      { isLoading }
      email={data.email}
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
  .error {
    color: #ff2700;
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
