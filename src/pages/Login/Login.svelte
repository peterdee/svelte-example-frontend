<script>
  import axios from 'axios';
  import { navigateTo } from 'svelte-router-spa';

  import { getTokens, storeTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  import Error from '../../reusable/Error.svelte';
  import Loader from '../../reusable/Loader.svelte';
  import LoginForm from './LoginForm.svelte';

  let formError = '';
  let highlight = {
    email: '',
    password: '',
  };
  let isLoading = false;
  let loginData = {
    email: '',
    password: '',
  };

  // make sure that the header is hidden
  store.setShowHeader(false);

  // redirect to index if the token is there
  if (getTokens().accessToken) {
    navigateTo('/');
  }

  /**
   * Handle form submit
   */
  const handleForm = async () => {
    // check the data
    const { email = '', password = '' } = loginData;
    if (!(email && password)) {
      highlight.email = (!email && 'error') || '';
      highlight.password = (!password && 'error') || '';
      return formError = 'Please provide the necessary data!';
    }

    // highlight inputs, start loading
    formError = '';
    highlight.email = highlight.password = 'success';
    isLoading = true;

    // send the login request
    try {
      const response = await axios({
        data: { ...loginData },
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/login',
      });
      const { data: { data: { role = '', tokens: { access = '', refresh = '' } } = {} } = {} } = response;
      
      // stop the loader
      isLoading = false;

      // make sure that everything's in place
      if (!(access && refresh && role)) {
        highlight.email = highlight.password = '';
        return formError = 'Access denied!';
      }

      // store tokens
      storeTokens({ accessToken: access, refreshToken: refresh });

      // save data in the application store
      store.setLoggedIn(true);
      store.setRole(role);

      // redirect to the index
      return navigateTo('/');
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
        highlight.email = highlight.password = 'error';
        return formError = 'Access denied!';
      }
      if (info === 'ACCOUNT_IS_BLOCKED' && status === 403) {
        highlight.email = highlight.password = 'error';
        formError = 'This account is blocked!';
        return navigateTo(`/get-account-recovery-link/${loginData.email}`);
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
    loginData[name] = value;
    highlight[name] = '';
    formError = '';
  }
</script>

<div class="page-wrap">
  <Loader { isLoading } />
  <div class="margin page-title noselect">
    Login
  </div>
  <LoginForm
    { isLoading }
    emailHighlight={highlight.email}
    passwordHighlight={highlight.password}
    on:handle-form={handleForm}
    on:handle-input={handleInput}
  />
  <Error message={formError} />
  <div class="center margin noselect">
    <a
      class={ isLoading ? 'disable-link' : '' }
      href={`/get-password-recovery-link/${loginData.email}`}
    >
      Forgot your password?
    </a>
  </div>
  <div class="center margin noselect">
    <a
      class={ isLoading ? 'disable-link' : '' }
      href="/registration"
    >
      Don't have an account?
    </a>
  </div>
  <div class="center margin noselect">
    <a
      class={ isLoading ? 'disable-link' : '' }
      href="/"
    >
      Back to Index
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
  .page-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: auto auto;
    width: 325px;
  }
</style>
