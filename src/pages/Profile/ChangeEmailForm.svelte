<script>
  import { createEventDispatcher } from 'svelte';

  import Button from '../../reusable/Button.svelte';
  import Info from '../../reusable/Info.svelte';
  import Input from '../../reusable/Input.svelte';

  export let email = '';
  export let emailHighlight = '';
  export let formMessage = {
    message: '',
    type: '',
  };
  export let isLoading = false;

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
  class="email-form"
  on:submit|preventDefault={handleForm}
>
  <div class="margin">
    <Input
      disabled={isLoading}
      highlight={emailHighlight}
      name="email"
      placeholder="Email"
      type="email"
      value={email}
      on:handle-input={handleInput}
    />
  </div>
  <Button
    disabled={isLoading}
    text="Change"
    type="submit"
  />
  <Info
    message={formMessage.message}
    type={formMessage.type}
  />
</form>

<style>
  .email-form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 349px;
  }
  .margin {
    margin-bottom: 15px;
  }
</style>
