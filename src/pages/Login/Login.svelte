<script>
  import { afterUpdate } from 'svelte';

  import Input from '../../reusable/Input.svelte';

  let email = '';
  let emailHighlight = '';
  let isLoading = false;
  let password = '';
  let passwordHighlight = '';

  /**
   * Handle form submit
   */
  const handleLogin = () => {
    if (!(email && password)) {
      emailHighlight = (!email && 'error') || '';
      passwordHighlight = (!password && 'error') || '';
    }
  }

  afterUpdate(() => console.log('afterUpdate', emailHighlight, passwordHighlight));
</script>

<div class="page-wrap">
  <div class="margin page-title noselect">
    Login
  </div>
  <form
    class="login-form"
    on:submit|preventDefault={handleLogin}
  >
    <div class="margin">
      <Input
        disabled={isLoading}
        highlight={emailHighlight}
        name="email"
        placeholder="Email"
        type="text"
        bind:value={email}
      />
    </div>
    <div class="margin">
      <Input
        disabled={isLoading}
        highlight={passwordHighlight}
        name="password"
        placeholder="Password"
        type="password"
        bind:value={password}
      />
    </div>
    <button type="submit">Submit</button>
  </form>
</div>

<style>
  .login-form, .page-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .margin {
    margin-bottom: 15px;
  }
  .page-title {
    font-size: 2em;
    font-weight: 100;
    text-align: center;
    text-transform: uppercase;
  }
  .page-wrap {
    margin: auto auto;
    width: 325px;
  }
</style>
