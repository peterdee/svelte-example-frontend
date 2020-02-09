<script>
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';
  import { navigateTo } from 'svelte-router-spa';

  import PasswordForm from './PasswordForm.svelte';

  import { getTokens, storeTokens } from '../../utilities/tokens';

  export let isLoading = false;

  let data = {
    confirmNewPassword: '',
    newPassword: '',
    oldPassword: '',
  };
  let formMessage = {
    message: '',
    type: '',
  };
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
    formMessage.type = 'error';
    if (keys.some((key = '') => !data[key])) {
      keys.forEach((key = '') => highlight[key] = (!data[key] && 'error') || '');
      return formMessage.message = 'Please provide the necessary data!';
    }

    // check the passwords
    if (data.confirmNewPassword !== data.newPassword) {
      highlight.confirmNewPassword = highlight.newPassword = 'error';
      return formMessage.message = 'Password confirmation is incorrect!';
    }

    const { accessToken = '' } = getTokens();

    // highlight inputs, start loading
    formMessage = {
      message: '',
      type: '',
    };
    keys.forEach((key = '') => highlight[key] = 'success');
    handleLoader(true);

    try {
      const response = await axios({
        data: {
          newPassword: data.newPassword,
          oldPassword: data.oldPassword,
        },
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        method: 'PATCH',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/change-password',
      });
      const { data: { data: { tokens: { access = '', refresh = '' } = {} } = {} } = {} } = response;
      
      // make sure that everything's in place
      if (!(access && refresh)) {
        keys.forEach((key = '') => highlight[key] = '');
        return formMessage = {
          message: 'Access denied!',
          type: 'error',
        };
      }

      // disable the loader
      handleLoader(false);

      // store tokens
      storeTokens({ accessToken: access, refreshToken: refresh });

      // show the message
      return formMessage = {
        message: 'Password successfully changed!',
        type: 'success',
      };
    } catch (error) {
      // remove the loader
      handleLoader(false);

      // handle error response
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;
      formMessage.type = 'error';
      if (info === 'INVALID_DATA' && status === 400) {
        const { invalid = [] } = data;
        invalid.forEach((field = '') => highlight[field] = 'error');
        return formMessage.message = 'Invalid data!';
      }
      if (info === 'MISSING_DATA' && status === 400) {
        const { missing = [] } = data;
        missing.forEach((field = '') => highlight[field] = 'error');
        return formMessage.message = 'Missing data!';
      }
      if (info === 'OLD_PASSWORD_IS_INVALID' && status === 400) {
        highlight.oldPassword = 'error';
        return formMessage.message = 'Old password is invalid!';
      }

      keys.forEach((key = '') => highlight[key] = '');
      if (info === 'INTERNAL_SERVER_ERROR' && status === 500) {
        return formMessage.message = 'Oops! Something went wrong...';
      }

      return formMessage.message = 'Access denied!';
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
    formMessage = {
      message: '',
      type: '',
    };
    return highlight[name] = '';
  }
</script>

<div class="margin section-title noselect">
  Update password
</div>
<PasswordForm
  { formMessage }
  { isLoading }
  confirmNewPasswordHighlight={highlight.confirmNewPassword}
  newPasswordHighlight={highlight.newPassword}
  oldPasswordHighlight={highlight.oldPassword}
  on:handle-form={handleForm}
  on:handle-input={handleInput}
/>

<style>
  .margin {
    margin-bottom: 15px;
  }
  .section-title {
    font-weight: bold;
  }
</style>
