<script>
  import axios from 'axios';
  import { navigateTo } from 'svelte-router-spa';
  import { onMount } from 'svelte';

  import DetailsForm from './DetailsForm.svelte';
  import Loader from '../../reusable/Loader.svelte';

  import { deleteTokens, getTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  let formError = '';
  let highlight = {
    avatarLink: '',
    email: '',
    firstName: '',
    lastName: '',
  };
  let isLoading = true;
  let profile = {
    avatarLink: '',
    created: null,
    email: '',
    emailIsVerified: false,
    firstName: '',
    lastName: '',
    role: '',
  };

  // make sure that the header is displayed
  store.setShowHeader(true);

  /**
   * Handle form submit
   * @returns {*}
   */
  const handleForm = async () => {
    // check the data

    try {

    } catch (error) {
      // remove the loader
      isLoading = false;
    };
  }

  /**
   * Handle text inputs
   * @param name {string} - input name
   * @param value {number|string} - input value
   * @returns {*}
   */
  const handleInput = ({ detail: { name = '', value = '' } = {} }) => {
    profile[name] = value;
    highlight[name] = '';
    formError = '';
  }

  /**
   * Load profile data
   * @returns {Promise<void>}
   */
  const loadProfileData = async () => {
    const { accessToken = '' } = getTokens();
    try {
      const { data: { data: loadedProfile = {} } = {} } = await axios({
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        method: 'GET',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/account',
      });
      profile = { ...loadedProfile };
      return isLoading = false;
    } catch (error) {
      isLoading = false;
      return console.log(error);
    }
  };

  /**
   * On component mounting
   * @returns {Promise<void>}
   */
  onMount(() => loadProfileData());
</script>

{#if isLoading}
  <Loader { isLoading } />
{:else}
  <div class="content-wrap">
    <div class="content content-width">
      <div class="page-title mb-1">
        Profile
      </div>
      <div class="section-title">
        Update personal details
      </div>
      <DetailsForm
        { isLoading }
        firstName={profile.firstName}
        lastName={profile.lastName}
        firstNameHighlight={highlight.firstName}
        lastNameHighlight={highlight.lastName}
        on:handle-form={handleForm}
        on:handle-input={handleInput}
      />
    </div>
  </div>
{/if}

<style>
  .section-title {
    font-weight: bold;
  }
</style>
