<script>
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';
  import { navigateTo } from 'svelte-router-spa';

  import { deleteTokens, getTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  import Button from '../../reusable/Button.svelte';
  import Info from '../../reusable/Info.svelte';

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
   * Handle account deleting
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
        method: 'DELETE',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/account',
      });

      // log the user out, redirect to the index in 5 seconds
      deleteTokens();
      formMessage = {
        message: 'Account deleted! Redirecting in 5 seconds...',
        type: 'success',
      };
      handleLoader(false);
      store.setLoggedIn(false);
      return setTimeout(() => navigateTo('/'), 5000);
    } catch (error) {
      // remove the loader
      handleLoader(false);

      // handle error response
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;

      // TODO: handle the 401 error (token-related)

      formMessage.type = 'error';
      if (info === 'INTERNAL_SERVER_ERROR' && status === 500) {
        return formMessage.message = 'Oops! Something went wrong...';
      }

      return formMessage.message = 'Access denied!';
    }
  };

  let files = [];
  let imageLink = '';
  let selectorType = '';

  $: if (files.length > 0) {
    console.log(files[0]);
    imageLink = URL.createObjectURL(files[0]);
  }
</script>

<div class="section-title margin">
  Avatar
</div>
<div class="section">
  <div class="image-upload">
    <label for="file-selector">
      <img
        alt="{selectorType}"
        class="image"
        src="{imageLink}"
      />
    </label>
    <input
      class="input"
      id="file-selector"
      type="file"
      bind:files
    />
  </div>
  <Button
    disabled={isLoading}
    text="Delete avatar"
    type="button"
    on:handle-click={handleClick}
  />
  <Info
    message={formMessage.message}
    type={formMessage.type}
  />
</div>

<style>
  .image {
    border-radius: 50%;
    height: 100%;
    margin: 0 auto;
    max-height: 150px;
    max-width: 150px;
    width: 100%;
  }
  .input {
    display: none;
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
</style>
