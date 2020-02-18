<script>
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';
  import { navigateTo } from 'svelte-router-spa';

  import { deleteTokens, getTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  import Button from '../../reusable/Button.svelte';
  import Info from '../../reusable/Info.svelte';

  export let avatarLink = '';
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

  const dispatch = createEventDispatcher();
  
  /**
   * Switch loader
   * @param isVisible {boolean} - should the loader be visible
   * @returns {void}
   */
  const handleLoader = (isVisible = false) => dispatch('switch-loader', isVisible);

  /**
   * Handle file selection
   * @param event {object} - event object 
   * @returns {Promise<void>}
   */
  const handleFileSelection = async (event = {}) => {
    const [file] = event.target.files;   
    files[0] = file;
    event.target.value = null;
    formMessage = {
      message: '',
      type: 'error',
    };

    // check file type
    if (!acceptedTypes.includes(file.type)) {
      return formMessage.message = 'Please use JPEG or PNG file!';
    }

    // check file size
    if (file.size > 50000) return formMessage.message = 'Maximum file size is 50KB!';

    formMessage = {
      message: 'Uploading the file...',
      type: 'info',
    };

    // get the token and show the loader
    const { accessToken = '' } = getTokens();

    // create FormData
    const formData = new FormData();
    formData.append('file', file);

    // show the loader
    handleLoader(true);
    
    // send the request
    try {
      await axios({
        data: formData,
        headers: {
          'X-ACCESS-TOKEN': accessToken,
          'Content-Type': 'multipart/formdata',
        },
        method: 'PATCH',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/avatar',
      });

      formMessage = {
        message: 'Avatar uploaded!',
        type: 'success',
      };
      avatarLink = URL.createObjectURL(file);
      return handleLoader(false);
    } catch (error) {
      // remove the loader
      handleLoader(false);

      // handle error response
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;
    }
  }

  /**
   * Handle avatar deleting
   * @returns {Promise<void>}
   */
  const handleClick = async () => {
    // get the token and show the loader
    const { accessToken = '' } = getTokens();

    // show the loader
    handleLoader(true);
    
    // send the request
    try {
      await axios({
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        method: 'DELETE',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/avatar',
      });

      formMessage = {
        message: 'Avatar deleted!',
        type: 'success',
      };
      avatarLink = './assets/avatar.png';
      files = [];
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
      <div
        class="avatar"
        style={`background-image: url(${avatarLink});`}
      ></div>
    </label>
    <input
      class="input"
      id="file-selector"
      type="file"
      on:change={handleFileSelection}
    />
  </div>
  <div
    class="delete"
    title="Delete avatar"
    on:click={handleClick}
  >
    ✖
  </div>
</div>
<div class="section">
  <Info
    message={formMessage.message}
    type={formMessage.type}
  />
</div>

<style>
  .avatar {
    background-repeat:no-repeat;
    background-size: cover;
    border-radius: 50%;
    cursor: pointer;
    height: 150px;
    width: 150px;
  }
  .delete {
    cursor: pointer;
    font-size: 20px;
    font-weight: 600;
    height: 24px;
  }
  .input {
    display: none;
  }
  .section {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    max-width: 349px;
    width: 100%;
  }
  .section-title {
    font-weight: bold;
    margin-bottom: 15px;
  }
</style>
