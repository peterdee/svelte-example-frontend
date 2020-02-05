<script>
  import { store } from '../store';

  $: loggedIn = $store.auth.loggedIn;
</script>

<header class="header-wrap">
  <div>
    BlogPost
  </div>
  {#if loggedIn}
    <nav>Logged in</nav>
  {/if}
</header>

<style>
  .header-wrap {
    display: flex;
    flex-direction: row;
    height: 60px;
    justify-content: flex-start;
    width: 100%;
  }
</style>
