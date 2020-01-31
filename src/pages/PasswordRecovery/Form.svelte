<script>
  import { createEventDispatcher } from 'svelte';

  import Button from '../../reusable/Button.svelte';
  import Input from '../../reusable/Input.svelte';
  
  export let confirmNewPasswordHighlight = '';
  export let isLoading = false;
  export let newPasswordHighlight = '';

  const dispatch = createEventDispatcher();

  // handle form submit
  const handleForm = () => dispatch('handle-form');

  // handle text inputs
  const handleInput = ({ detail: { target: { name = '', value = '' } = {} } = {} }) => dispatch('handle-input', {
    name,
    value,
  });
</script>

<form
  class="password-form"
  on:submit|preventDefault={handleForm}
>
  <div class="margin">
    <Input
      disabled={isLoading}
      highlight={newPasswordHighlight}
      name="newPassword"
      placeholder="New Password"
      type="password"
      on:handle-input={handleInput}
    />
  </div>
  <div class="margin">
    <Input
      disabled={isLoading}
      highlight={confirmNewPasswordHighlight}
      name="confirmNewPassword"
      placeholder="Confirm New Password"
      type="password"
      on:handle-input={handleInput}
    />
  </div>
  <Button
    disabled={isLoading}
    text="Submit"
    type="submit"
  />
</form>

<style>
  .password-form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .margin {
    margin-bottom: 15px;
  }
</style>
