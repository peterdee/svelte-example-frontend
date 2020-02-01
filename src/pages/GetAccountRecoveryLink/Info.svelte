<script>
  import { navigateTo } from 'svelte-router-spa';

  import { getTokens } from '../../utilities/tokens';

  // redirect to index if the token is there
  if (getTokens().accessToken) {
    navigateTo('/');
  }
</script>

<div class="result-title center margin noselect">
  Success!
</div>
<div class="center noselect">
  Please follow the instructions in the email to continue!
</div>

<style>
  .center {
    text-align: center;
  }
  .margin {
    margin-bottom: 15px;
  }
  .result-title {
    color: #009255; 
    font-size: 1em;
    font-weight: 100;
    text-transform: uppercase;
  }
</style>
