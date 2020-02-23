<script>
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';

  import { getTokens } from '../../utilities/tokens';
  import { matchingInfo, refreshTokens } from '../../utilities/refresh-tokens';

  import DetailsForm from './DetailsForm.svelte';

  export let about = '';
  export let firstName = '';
  export let isLoading = false;
  export let lastName = '';

  $: data = {
    about,
    firstName,
    lastName,
  };
  let formMessage = {
    message: '',
    type: '',
  };
  let highlight = {
    about: '',
    firstName: '',
    lastName: '',
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
    const noAbout = keys.filter((key) => key !== 'about');
    formMessage.type = 'error';
    if (noAbout.some((key = '') => !data[key])) {
      noAbout.forEach((key = '') => highlight[key] = (!data[key] && 'error') || '');
      return formMessage.message = 'Please provide the necessary data!';
    }

    formMessage = {
      message: '',
      type: '',
    };
    handleLoader(true);
    keys.forEach((key = '') => highlight[key] = 'success');

    try {
      await axios({
        data,
        headers: {
          'X-ACCESS-TOKEN': getTokens().accessToken,
        },
        method: 'PATCH',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/account',
      });

      formMessage = {
        message: 'Personal details updated!',
        type: 'success',
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
          return formMessage.message = `Data is ${errorType}!`;
        }
      }
      if (status === 401 && matchingInfo.includes(info)) {
        return refreshTokens();
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
  }
</script>

<div class="section-title margin noselect">
  Update personal details
</div>
<DetailsForm
  { about }
  { firstName }
  { formMessage }
  { isLoading }
  { lastName}
  aboutHighlight={highlight.about}
  firstNameHighlight={highlight.firstName}
  lastNameHighlight={highlight.lastName}
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
