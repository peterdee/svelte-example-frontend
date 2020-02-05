<script>
  import { store } from '../store';

  $: loggedIn = $store.auth.loggedIn;
</script>

<header class="header-wrap noselect">
  <div class="header-boundaries">
    <div class="header-left">
      <div class="header-logo"></div>
      <div class="header-branding">
        BlogPost
      </div>
    </div>
    <div>
      {#if loggedIn}
        <nav>Logged in</nav>
      {/if}
    </div>
  </div>
</header>

<style>
  .header-boundaries {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 80px;
    justify-content: space-between;
    margin: 0 35px;
    width: 100%;
  }
  .header-branding {
    color: #ff3e00;
    font-size: 32px;
    font-weight: 100;
    margin-left: 10px;
  }
  .header-left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .header-logo {
    background: url(../assets/logo.png) no-repeat center;
    border-radius: 50%;
    height: 50px;
    width: 50px;
  }
  .header-wrap {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
</style>
