<script>
  import { createEventDispatcher } from 'svelte';

  import Button from '../../reusable/Button.svelte';
  import Info from '../../reusable/Info.svelte';
  import Input from '../../reusable/Input.svelte';

  export let confirmNewPasswordHighlight = '';
  export let formMessage = {
    message: '',
    type: '',
  };
  export let isLoading = false;
  export let newPasswordHighlight = '';
  export let oldPasswordHighlight = '';

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
  class="password-form margin"
  on:submit|preventDefault={handleForm}
>
  <div class="margin">
    <Input
      disabled={isLoading}
      highlight={oldPasswordHighlight}
      name="oldPassword"
      placeholder="Old Password"
      type="password"
      on:handle-input={handleInput}
    />
  </div>
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
    text="Update"
    type="submit"
  />
  <Info
    message={formMessage.message}
    type={formMessage.type}
  />
</form>

<style>
  .password-form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 349px;
  }
  .margin {
    margin-bottom: 15px;
  }
</style>
