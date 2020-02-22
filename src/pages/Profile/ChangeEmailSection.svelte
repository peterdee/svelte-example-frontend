<script>
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';

  import ChangeEmailForm from './ChangeEmailForm.svelte';

  import { getTokens } from '../../utilities/tokens';
  import { matchingInfo, refreshTokens } from '../../utilities/refresh-tokens';

  export let email = '';
  export let isLoading = false;

  $: data = {
    email,
  };
  let formMessage = {
    message: '',
    type: '',
  };
  let highlight = {
    email: '',
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
   * @returns {Promise<void>}
   */
  const handleForm = async () => {
    // check the data
    const keys = Object.keys(data);
    formMessage.type = 'error';
    if (keys.some((key = '') => !data[key])) {
      keys.forEach((key = '') => highlight[key] = (!data[key] && 'error') || '');
      return formMessage.message = 'Please provide the necessary data!';
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
      await axios({
        data,
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/change-email/send-link',
      });

      formMessage = {
        message: 'Verification link was sent!',
        type: 'info',
      };
      return handleLoader(false);
    } catch (error) {
      handleLoader(false);
      formMessage.type = 'error';
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;
      if (status === 400) {
        if (info === 'INVALID_DATA' || info === 'MISSING_DATA') {
          const errorType = info.split('_')[0].toLowerCase();
          const fields = data[errorType] || [];
          fields.forEach((field = '') => highlight[field] = 'error');
          return formMessage.message = `Provided data is ${errorType}!`;
        }
      }
      if (status === 401 && matchingInfo.includes(info)) {
        return refreshTokens();
      }
      if (status === 403 && info === 'EMAIL_ALREADY_IN_USE') {
        keys.forEach((key = '') => highlight[key] = 'error');
        return formMessage.message = 'Email address is already in use!';
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
   * @returns {void}
   */
  const handleInput = ({ detail: { name = '', value = '' } = {} }) => {
    data[name] = value;
    formMessage = {
      message: '',
      type: '',
    };
    return highlight[name] = '';
  };
</script>

<div class="section-title margin noselect">
  Change email address
</div>
<ChangeEmailForm
  { formMessage }
  { isLoading }
  email={data.email}
  emailHighlight={highlight.email}
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
