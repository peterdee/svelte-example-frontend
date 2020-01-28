<script>
  import { createEventDispatcher } from 'svelte';

  import Button from '../../reusable/Button.svelte';
  import Input from '../../reusable/Input.svelte';

  export let confirmPasswordHighlight = '';
  export let emailHighlight = '';
  export let firstNameHighlight = '';
  export let isLoading = false;
  export let lastNameHighlight = '';
  export let passwordHighlight = '';

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
  class="registration-form"
  on:submit|preventDefault={handleForm}
>
  <div class="margin">
    <Input
      disabled={isLoading}
      highlight={emailHighlight}
      name="email"
      placeholder="Email"
      type="email"
      on:handle-input={handleInput}
    />
  </div>
  <div class="margin">
    <Input
      disabled={isLoading}
      highlight={firstNameHighlight}
      name="firstName"
      placeholder="First Name"
      type="text"
      on:handle-input={handleInput}
    />
  </div>
  <div class="margin">
    <Input
      disabled={isLoading}
      highlight={lastNameHighlight}
      name="lastName"
      placeholder="Last Name"
      type="text"
      on:handle-input={handleInput}
    />
  </div>
  <div class="margin">
    <Input
      disabled={isLoading}
      highlight={passwordHighlight}
      name="password"
      placeholder="Password"
      type="password"
      on:handle-input={handleInput}
    />
  </div>
    <div class="margin">
    <Input
      disabled={isLoading}
      highlight={confirmPasswordHighlight}
      name="confirmPassword"
      placeholder="Confirm Password"
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
  .registration-form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .margin {
    margin-bottom: 15px;
  }
</style>
