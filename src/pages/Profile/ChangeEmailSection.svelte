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
    

    try {

    } catch (error) {
      // remove the loader
      isLoading = false;
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
