<script>
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';
  import { navigateTo } from 'svelte-router-spa';

  import { getTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  import Button from '../../reusable/Button.svelte';
  import Info from '../../reusable/Info.svelte';

  export let avatarLink = '';
  
  const defaultAvatar = './assets/avatar.png';
  let files = [];
  let formMessage = {
    message: '',
    type: '',
  };

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

    // create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // send the request
    try {
      handleLoader(true);
      await axios({
        data: formData,
        headers: {
          'X-ACCESS-TOKEN': getTokens().accessToken,
          'Content-Type': 'multipart/formdata',
        },
        method: 'PATCH',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/avatar',
      });

      // if everything is OK
      formMessage = {
        message: 'Avatar uploaded!',
        type: 'success',
      };
      avatarLink = URL.createObjectURL(file);
      return handleLoader(false);
    } catch (error) {
      // remove the loader
      handleLoader(false);
      formMessage.type = 'error';

      // handle error response
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;
      if (status === 400) {
        if (info === 'MISSING_FILE')  return formMessage.message = 'Missing the file!';
        if (info === 'INVALID_FILE_SIZE')  return formMessage.message = 'Maximum file size is 50KB!';
        if (info === 'INVALID_FILE_TYPE')  return formMessage.message = 'Please select a JPEG or PNG file!';
      }
      if (status === 401 && info === 'INVALID_TOKEN' || info === 'MISSING_TOKEN' || info === 'TOKEN_EXPIRED') {
        return refreshTokens();
      }
      
      if (info === 'INTERNAL_SERVER_ERROR' && status === 500) {
        return formMessage.message = 'Oops! Something went wrong...';
      }

      return formMessage.message = 'Access denied!';
    }
  }

  /**
   * Handle avatar deleting
   * @returns {Promise<void>}
   */
  const handleClick = async () => {
    // send the request
    try {
      handleLoader(true);
      await axios({
        headers: {
          'X-ACCESS-TOKEN': getTokens().accessToken,
        },
        method: 'DELETE',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/avatar',
      });

      // if everything is OK
      formMessage = {
        message: 'Avatar deleted!',
        type: 'success',
      };
      avatarLink = defaultAvatar;
      files = [];
      return handleLoader(false);
    } catch (error) {
      // remove the loader
      handleLoader(false);
      formMessage.type = 'error';

      // handle error response
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;
      if (status === 401 && info === 'INVALID_TOKEN' || info === 'MISSING_TOKEN' || info === 'TOKEN_EXPIRED') {
        return refreshTokens();
      }
      
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
      accept=".jpeg,.jpg,.png"
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
    font-weight: 400;
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
