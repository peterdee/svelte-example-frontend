<script>
  import { navigateTo } from 'svelte-router-spa';

  import { getTokens } from '../../utilities/tokens';

  export let email = '';

  // redirect to index if the token is there
  if (getTokens().accessToken) {
    navigateTo('/');
  }
</script>

<div class="page-wrap">
  Success! Sent email to { email }
</div>

<style>
  .page-wrap {

  }
</style>
