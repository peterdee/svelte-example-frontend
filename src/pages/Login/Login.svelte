<script>
  import axios from 'axios';
  import { Navigate } from 'svelte-router-spa';

  import Error from '../../reusable/Error.svelte';
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
      isLoading = false;

      // make sure that everything's in place
      if (!(access && refresh && role)) {
        highlight.email = highlight.password = '';
        return formError = 'Access denied!';
      }

      // TODO: save tokens to the localStorage, save role to the application store

    } catch (error) {
      isLoading = false;
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
      if (info === 'INTERNAL_SERVER_ERROR' && status === 500) {
        highlight.email = highlight.password = '';
        return formError = 'Oops! Something went wrong...';
      }
      
      highlight.email = highlight.password = '';
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
      href="/password-recovery"
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
