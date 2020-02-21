<script>
  import axios from 'axios';
  import { navigateTo } from 'svelte-router-spa';
  import { onMount } from 'svelte';

  import AvatarSection from './AvatarSection.svelte';
  import DeleteAccountSection from './DeleteAccountSection.svelte';
  import DetailsSection from './DetailsSection.svelte';
  import EmailStatusSection from './EmailStatusSection.svelte';
  import Error from '../../reusable/Error.svelte';
  import Loader from '../../reusable/Loader.svelte';
  import PasswordSection from './PasswordSection.svelte';

  import { getTokens } from '../../utilities/tokens';
  import { matchingInfo, refreshTokens } from '../../utilities/refresh-tokens';
  import { store } from '../../store';

  const defaultAvatar = './assets/avatar.png';
  let isLoading = true;
  let loadError = '';
  let profile = {
    about: '',
    avatarLink: defaultAvatar,
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
    try {
      const { data: { data: loadedProfile = {} } = {} } = await axios({
        headers: {
          'X-ACCESS-TOKEN': getTokens().accessToken,
        },
        method: 'GET',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/account',
      });
      profile = { ...loadedProfile };
      if (!profile.avatarLink) {
        profile.avatarLink = defaultAvatar;
      }
      return isLoading = false;
    } catch (error) {
      const { response: { data: { data = {}, info = '', status = null } = {} } = {} } = error;
      if (status === 401 && matchingInfo.includes(info)) {
        return refreshTokens();
      }

      isLoading = false;
      return loadError = 'Oops! Something went wrong...';
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
      <div class="content-title mb-1 noselect">
        Profile
      </div>
      <AvatarSection
        avatarLink={profile.avatarLink}
        on:switch-loader={switchLoader}
      />
      <EmailStatusSection
        { isLoading }
        emailIsVerified={profile.emailIsVerified}
        on:switch-loader={switchLoader}
      />
      <DetailsSection
        { isLoading }
        about={profile.about}
        firstName={profile.firstName}
        lastName={profile.lastName}
        on:switch-loader={switchLoader}
      />
      <PasswordSection
        { isLoading }
        on:switch-loader={switchLoader}
      />
      <DeleteAccountSection
        { isLoading }
        on:switch-loader={switchLoader}
      />
    </div>
  </div>
{/if}
