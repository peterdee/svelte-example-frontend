<script>
  import axios from 'axios';
  import { navigateTo } from 'svelte-router-spa';
  import { onMount } from 'svelte';

  import DetailsSection from './DetailsSection.svelte';
  import Error from '../../reusable/Error.svelte';
  import Loader from '../../reusable/Loader.svelte';
  import PasswordSection from './PasswordSection.svelte';

  import { deleteTokens, getTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  let isLoading = true;
  let loadError = '';
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
      formError = 'Error!';
      return console.log(error);
    }
  };

  /**
   * Switch the loader from children components
   * @param detail {boolean} - event detail
   * @returns {void}
   */
  const switchLoader = ({ detail = false }) => isLoading = detail;

  /**
   * On component mounting
   * @returns {Promise<void>}
   */
  onMount(() => loadProfileData());
</script>

<Loader { isLoading } />
{#if loadError}
  <Error message={loadError} />
{:else}
  <div class="content-wrap">
    <div class="content content-width">
      <div class="content-title mb-1">
        Profile
      </div>
      <DetailsSection
        { isLoading }
        firstName={profile.firstName}
        lastName={profile.lastName}
      />
      <PasswordSection
        { isLoading }
        on:switch-loader={switchLoader}
      />
    </div>
  </div>
{/if}

<style>

</style>
