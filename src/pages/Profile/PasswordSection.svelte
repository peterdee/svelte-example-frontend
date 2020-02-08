<script>
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';
  import { navigateTo } from 'svelte-router-spa';

  import PasswordForm from './PasswordForm.svelte';

  export let isLoading = false;

  let data = {
    confirmNewPassword: '',
    newPassword: '',
    oldPassword: '',
  };
  let formError = '';
  let highlight = {
    confirmNewPassword: '',
    newPassword: '',
    oldPassword: '',
  };
  
  const dispatch = createEventDispatcher();

  /**
   * Switch loader
   * @param isVisible {boolean} - should the loader be visible
   * @returns {void}
   */
  const handleLoader = (isVisible = false) => dispatch('switch-loader', isVisible);

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
      highlight.confirmNewPassword = highlight.newPassword = 'error';
      return formError = 'Password confirmation is incorrect!';
    }

    // highlight inputs, start loading
    formError = '';
    keys.forEach((key = '') => highlight[key] = 'success');
    handleLoader(true);

    try {
      await axios({
        data,
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/change-password',
      });
      
      handleLoader(false);
    } catch (error) {
      // remove the loader
      handleLoader(false);

      console.log(error);
    };
  }

  /**
   * Handle text inputs
   * @param name {string} - input name
   * @param value {number|string} - input value
   * @returns {*}
   */
  const handleInput = ({ detail: { name = '', value = '' } = {} }) => {
    data[name] = value;
    highlight[name] = '';
    return formError = '';
  }
</script>

<div class="section-title">
  Update password
</div>
<PasswordForm
  { formError }
  { isLoading }
  confirmNewPasswordHighlight={highlight.confirmNewPassword}
  newPasswordHighlight={highlight.newPassword}
  oldPasswordHighlight={highlight.oldPassword}
  on:handle-form={handleForm}
  on:handle-input={handleInput}
/>

<style>
  .section-title {
    font-weight: bold;
  }
</style>
