<script>
  import { navigateTo } from 'svelte-router-spa';

  import { store } from '../store';

  $: loggedIn = $store.auth.loggedIn;

  let showOptions = false;

  const clickListener = (event = {}) => {
    event.preventDefault();
    const { target: { parentElement: { id = '' } = {} } = {} } = event;
    return showOptions = id && id === 'options';
  };

  const toggleOptions = () => {
    showOptions = !showOptions;
    return window.addEventListener('click', clickListener, { once: true });
  }
</script>

<header class="header-wrap noselect">
  <div class="header-boundaries">
    <div
      class="header-left pointer"
      on:click={() => navigateTo('/')}
    >
      <div class="header-logo"></div>
      <div class="header-branding">
        BlogPost
      </div>
    </div>
    <div class="header-left">
      {#if loggedIn}
        <div class="margin-right">
          <a href="/my-posts">My posts</a>
        </div>
        <div class="margin-right">
          <a href="/favorites">Favorites</a>
        </div>
        <div>
          <div
            class="check pointer"
            on:click|stopPropagation={toggleOptions}
          ></div>
          {#if showOptions}
            <div
              class="options"
              id="options"
            >
              <div class="options-item">
                <a href="/profile">My profile</a>
              </div>
              <div class="options-divider"></div>
              <div class="options-item">
                <a href="/logout">Logout</a>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <div>
          <a href="/login">Login</a>  
        </div>
        <div class="margin-left">
          <a href="/registration">Registration</a>  
        </div>
      {/if}
    </div>
  </div>
</header>

<style>
  .check {
    background: url(../assets/check.png) no-repeat center;
    height: 50px;
    width: 50px;
  }
  .header-boundaries {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 80px;
    justify-content: space-between;
    max-width: 768px;
    padding: 0 35px;
    width: 100%;
  }
  .header-branding {
    color: #ff3e00;
    font-size: 32px;
    font-weight: 100;
    margin-left: 10px;
  }
  .header-left {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .header-logo {
    background: url(../assets/logo.gif) no-repeat center;
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
  .margin-left {
    margin-left: 15px;
  }
  .margin-right {
    margin-right: 15px;
  }
  .options {
    background-color: #f0f0f0;
    border-radius: 5px;
    cursor: default;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 1;
  }
  .options-divider {
    background-color: #aaa;
    height: 1px;
    width: 100%;
  }
  .options-item {
    padding: 15px;
    text-align: center;
  }
  .pointer {
    cursor: pointer;
  }
</style>
