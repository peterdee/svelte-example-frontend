<script>
  import axios from 'axios';

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
    const { email = '', password = '' } = loginData;
    if (!(email && password)) {
      highlight.email = (!email && 'error') || '';
      highlight.password = (!password && 'error') || '';
      return formError = 'Please provide the necessary data!';
    }

    highlight.email = highlight.password = 'success';
    isLoading = true;

    try {
      const response = await axios({
        data: { ...loginData },
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/login',
      });
      console.log('response', response);
    } catch (error) {
      console.log(error);
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
