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

  // if the email address was passed
  const { namedParams: { code = '' } = {} } = currentRoute;

  // make sure that the header is hidden
  store.setShowHeader(false);

  /**
   * Verify the code
   * @returns {void}
   */
  onMount(async () => {
    // send the request
    try {
      await axios({
        data: {
          code,
        },
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/verify-email',
      });
      
      // stop the loader
      isLoading = false;

      // show the info page
      return codeIsVerified = true;
    } catch (error) {
      // remove the loader
      isLoading = false;

      // handle error response
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;
      if (info === 'INVALID_DATA' && status === 400) {
        return formError = 'Invalid data!';
      }
      if (info === 'MISSING_DATA' && status === 400) {
        return formError = 'Missing data!';
      }
      if (info === 'ACCESS_DENIED' && status === 401) {
        return formError = 'Access denied!';
      }
      if (info === 'EXPIRED_RECOVERY_CODE' && status === 403) {
        return formError = 'Recovery code expired!';
      }
      if (info === 'INVALID_RECOVERY_CODE' && status === 403) {
        return formError = 'Recovery code is invalid!';
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
