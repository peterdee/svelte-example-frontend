<script>
  import { store } from '../store';

  $: loggedIn = $store.auth.loggedIn;

  let showOptions = false;

  const toggleOptions = () => showOptions = !showOptions;

  window.onclick = (event) => {
    const { target: { id = '' } = {} } = event;
    showOptions = ((!id || id !== 'options') && !showOptions) || showOptions;
  };
</script>

<header class="header-wrap noselect">
  <div class="header-boundaries">
    <div class="header-left">
      <div class="header-logo"></div>
      <div class="header-branding">
        BlogPost
      </div>
    </div>
    <div class="header-left">
      {#if loggedIn}
        <div>
          <div
            class="cog-logo"
            on:click={toggleOptions}
          ></div>
          {#if showOptions}
            <div
              class="options"
              id="options"
            >
              <div>
                <a href="/account">Account</a>
              </div>
              <div>
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
  .cog-logo {
    background: url(../assets/gear.png) no-repeat center;
    border-radius: 50%;
    cursor: pointer;
    height: 50px;
    width: 50px;
  }
  .header-boundaries {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 80px;
    justify-content: space-between;
    margin: 0 35px;
    max-width: 768px;
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
  .options {
    background-color: #f0f0f0;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    position: absolute;
    z-index: 1;
  }
</style>
