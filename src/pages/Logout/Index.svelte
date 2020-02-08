<script>
  import axios from 'axios';
  import { navigateTo } from 'svelte-router-spa';
  import { onMount } from 'svelte';

  import Loader from '../../reusable/Loader.svelte';

  import { deleteTokens, getTokens } from '../../utilities/tokens';
  import { store } from '../../store';

  let isLoading = true;

  // make sure that the header is not displayed
  store.setShowHeader(false);
  
  /**
   * Handle logging out from a single device
   * @returns {Promise<void>}
   */
  const logout = async () => {
    const { accessToken = '', refreshToken = '' } = getTokens();
    store.setLoggedIn(false);
    deleteTokens();
    try {
      await axios({
        data: { refreshToken },
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/logout',
      });
      isLoading = false;
      return navigateTo('/');
    } catch {
      isLoading = false;
      return navigateTo('/');
    }
  };

  /**
   * Perform logout on component mounting
   * @returns {Promise<void>}
   */
  onMount(() => logout());
</script>

<Loader { isLoading } />
