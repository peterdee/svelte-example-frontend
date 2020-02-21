<script>
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';
  import { navigateTo } from 'svelte-router-spa';

  import { getTokens } from '../../utilities/tokens';
  import { matchingInfo, refreshTokens } from '../../utilities/refresh-tokens';
  import { store } from '../../store';

  import Button from '../../reusable/Button.svelte';
  import Info from '../../reusable/Info.svelte';

  export let emailIsVerified = false;
  export let isLoading = false;

  let formMessage = {
    message: '',
    type: '',
  };
  
  const dispatch = createEventDispatcher();

  /**
   * Switch loader
   * @param isVisible {boolean} - should the loader be visible
   * @returns {void}
   */
  const handleLoader = (isVisible = false) => dispatch('switch-loader', isVisible);

  /**
   * Handle email verification request
   * @returns {Promise<void>}
   */
  const handleClick = async () => {
    // get the token and show the loader
    const { accessToken = '' } = getTokens();
    handleLoader(true);
    try {
      // send the request
      await axios({
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        method: 'GET',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/verify-email',
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
      if (status === 400 && info === 'EMAIL_ALREADY_VERIFIED') {
        return formMessage.message = 'Email is already verified!';
      }
      if (status === 401 && matchingInfo.includes(info)) {
        return refreshTokens();
      }

      formMessage.type = 'error';
      if (info === 'INTERNAL_SERVER_ERROR' && status === 500) {
        return formMessage.message = 'Oops! Something went wrong...';
      }

      return formMessage.message = 'Access denied!';
    }
  };
</script>

<div class="section-title margin noselect">
  Email Verification Status
</div>
<div class="section">
  {#if !emailIsVerified}
    <div class="error section-title margin noselect">
      Email is not verified!
    </div>
    <Button
      disabled={isLoading}
      text="Verify"
      type="button"
      on:handle-click={handleClick}
    />
  {:else}
    <div class="success section-title margin noselect">
      Email is verified!
    </div>
  {/if}
  <Info
    message={formMessage.message}
    type={formMessage.type}
  />
</div>

<style>
  .error {
    color: #ff2700;
  }
  .margin {
    margin-bottom: 15px;
  }
  .section {
    max-width: 349px;
    width: 100%;
  }
  .section-title {
    font-weight: bold;
  }
  .success {
    color: #009255; 
  }
</style>
