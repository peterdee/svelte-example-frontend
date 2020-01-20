<script>
  import { afterUpdate } from 'svelte';

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
  const handleForm = () => {
    const { email = '', password = '' } = loginData;
    if (!(email && password)) {
      highlight.email = (!email && 'error') || '';
      highlight.password = (!password && 'error') || '';
      return formError = 'Please provide the necessary data!';
    }

    highlight.email = highlight.password = 'success';
    isLoading = true;

    // TODO: send request
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
  }

  // afterUpdate(() => console.log('afterUpdate', emailHighlight, passwordHighlight));
</script>

<div class="page-wrap">
  <div class="margin page-title noselect">
    Login
  </div>
  <LoginForm
    email={loginData.email}
    password={loginData.password}
    emailHighlight={ emailHighlight }
    { isLoading }
    { passwordHighlight }
    on:handle-form={handleForm}
    on:handle-input={handleInput}
  />
</div>

<style>
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
