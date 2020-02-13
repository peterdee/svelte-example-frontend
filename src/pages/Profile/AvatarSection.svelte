<script>
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';
  import { navigateTo } from 'svelte-router-spa';

  import { deleteTokens, getTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  import Button from '../../reusable/Button.svelte';
  import Info from '../../reusable/Info.svelte';

  export let imageLink = '';
  export let isLoading = false;
  
  let files = [];
  let formMessage = {
    message: '',
    type: '',
  };
  let localLoading = false;

  const acceptedTypes = [
    'image/jpeg',
    'image/png',
  ];

  // automatically upload the file if it was selected
  $: if (files.length > 0) {
    handleFileSelection();
  }
  
  /**
   * Switch loader
   * @param isVisible {boolean} - should the loader be visible
   * @returns {void}
   */
  const handleLoader = (isVisible = false) => dispatch('switch-loader', isVisible);

  const handleFileSelection = () => {
    console.log(files[0])
    const [file] = files;
    formMessage = {
        message: '',
        type: 'error',
    };

    // check file type
    if (!acceptedTypes.includes(file.type)) return formMessage.message = 'Please use JPEG or PNG file!';

    // check file size
    if (file.size > 50000) return formMessage.message = 'Maximum file size is 50KB!';

    formMessage = {
        message: 'Uploading the file...',
        type: 'info',
    };
    return imageLink = URL.createObjectURL(files[0]);
  }

  const dispatch = createEventDispatcher();

  /**
   * Handle avatar deleting
   * @returns {Promise<void>}
   */
  const handleClick = async () => {
    // get the token and show the loader
    const { accessToken = '' } = getTokens();
    handleLoader(true);
    try {
      // send the request
      // await axios({
      //   headers: {
      //     'X-ACCESS-TOKEN': accessToken,
      //   },
      //   method: 'DELETE',
      //   url: 'https://express-mongo-node.herokuapp.com/api/v1/account',
      // });

      formMessage = {
        message: 'Avatar uploaded!',
        type: 'success',
      };
      return handleLoader(false);
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
</script>

<div class="section-title margin">
  Avatar
</div>
<div class="section">
  <div class="image-upload">
    <label for="file-selector">
      <img
        alt="Avatar"
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
