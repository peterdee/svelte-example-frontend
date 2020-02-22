<script>
  import { createEventDispatcher } from 'svelte';

  import Button from '../../reusable/Button.svelte';
  import Info from '../../reusable/Info.svelte';
  import Input from '../../reusable/Input.svelte';

  export let firstName = '';
  export let firstNameHighlight = '';
  export let formMessage = {
    message: '',
    type: '',
  };
  export let isLoading = false;
  export let lastName = '';
  export let lastNameHighlight = '';

  const dispatch = createEventDispatcher();

  // handle form submit
  const handleForm = () => dispatch('handle-form');

  // handle text inputs
  const handleInput = ({ detail: { target: { name = '', value = '' } = {} } = {} }) => dispatch(
    'handle-input',
    {
      name,
      value,
    },
  );
</script>

<form
  class="details-form"
  on:submit|preventDefault={handleForm}
>
  <div class="margin">
    <Input
      disabled={isLoading}
      highlight={firstNameHighlight}
      name="firstName"
      placeholder="First Name"
      type="text"
      value={firstName}
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
      value={lastName}
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
  .details-form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 349px;
  }
  .margin {
    margin-bottom: 15px;
  }
</style>
