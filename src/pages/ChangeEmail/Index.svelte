<script>
  import axios from 'axios';
  import { navigateTo } from 'svelte-router-spa';
  import { onMount } from 'svelte';

  import { getTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  import Error from '../../reusable/Error.svelte';
  import Loader from '../../reusable/Loader.svelte';

  export let currentRoute = {};
  export let params; // this is not used, investigate the router module

  let codeIsVerified = false;
  let formError = '';
  let isLoading = true;

  const { namedParams: { code = '' } = {} } = currentRoute;

  // make sure that the header is hidden
  store.setShowHeader(false);

  /**
   * Verify the code
   * @returns {Promise<void>}
   */
  onMount(async () => {
    try {
      await axios({
        data: {
          code,
        },
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/verify-email',
      });
      
      isLoading = false;
      return codeIsVerified = true;
    } catch (error) {
      isLoading = false;
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;
      if (status === 400 && (info === 'INVALID_DATA' || info === 'MISSING_DATA')) {
        return formError = `Code is ${info.split('_')[0].toLowerCase()}!`;
      }
      if (info === 'ACCESS_DENIED' && status === 401) {
        return formError = 'Access denied!';
      }
      if (status === 403) {
        if (info === 'EMAIL_ALREADY_VERIFIED') return formError = 'Email is already verified!';
        if (info === 'EXPIRED_VERIFICATION_CODE') return formError = 'Verification code is expired!';
        if (info === 'INVALID_VERIFICATION_CODE') return formError = 'Verification code is invalid!';
      }

      if (info === 'INTERNAL_SERVER_ERROR' && status === 500) {
        return formError = 'Oops! Something went wrong...';
      }

      return formError = 'Access denied!';
    }
  });
</script>

<div class="page-wrap noselect">
  <Loader { isLoading } />
  <div class="margin page-title">
    Email Verification
  </div>
  {#if codeIsVerified}
    <div class="result-title center margin">
      Success!
    </div>
    <div class="center">
      Your email address is now verified!
    </div>
  {/if}
  <Error message={formError} />
  <div class="center margin">
    <a
      class={ isLoading ? 'disable-link' : '' }
      href="/"
    >
      Back
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
  .result-title {
    color: #009255; 
    font-size: 1em;
    font-weight: 100;
    text-transform: uppercase;
  }
</style>
