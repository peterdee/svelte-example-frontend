<script>
  import axios from 'axios';
  import { navigateTo } from 'svelte-router-spa';

  import { getTokens, storeTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  import Error from '../../reusable/Error.svelte';
  import Loader from '../../reusable/Loader.svelte';
  import RegistrationForm from './RegistrationForm.svelte';

  let formError = '';
  let highlight = {
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  };
  let isLoading = false;
  let registrationData = {
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
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
    const keys = Object.keys(registrationData);
    if (keys.some((key = '') => !registrationData[key])) {
      keys.forEach((key = '') => highlight[key] = (!registrationData[key] && 'error') || '');
      return formError = 'Please provide the necessary data!';
    }

    // check the passwords
    if (registrationData.confirmPassword !== registrationData.password) {
      highlight.confirmPassword = highlight.password = 'error';
      return formError = 'Password confirmation is incorrect!';
    }

    // highlight inputs, start loading
    formError = '';
    keys.forEach((key = '') => highlight[key] = 'success');
    isLoading = true;

    // send the login request
    try {
      const response = await axios({
        data: { ...registrationData },
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/registration',
      });
      const { data: { data: { role = '', tokens: { access = '', refresh = '' } } = {} } = {} } = response;
      
      // stop the loader
      isLoading = false;

      // make sure that everything's in place
      if (!(access && refresh && role)) {
        keys.forEach((key = '') => highlight[key] = '');
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
      if (info === 'EMAIL_ALREADY_IN_USE' && status === 400) {
        highlight.email = 'error';
        return formError = 'Email address already in use!';
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

      keys.forEach((key = '') => highlight[key] = '');
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
    registrationData[name] = value;
    highlight[name] = '';
    formError = '';
  }
</script>

<div class="page-wrap">
  <Loader { isLoading } />
  <div class="margin page-title noselect">
    Registration
  </div>
  <RegistrationForm
    { isLoading }
    confirmPasswordHighlight={highlight.confirmPassword}
    emailHighlight={highlight.email}
    firstNameHighlight={highlight.firstName}
    lastNameHighlight={highlight.lastName}
    passwordHighlight={highlight.password}
    on:handle-form={handleForm}
    on:handle-input={handleInput}
  />
  <Error message={formError} />
  <div class="center margin noselect">
    <a
      class={ isLoading ? 'disable-link' : '' }
      href="/login"
    >
      Already have an account?
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
