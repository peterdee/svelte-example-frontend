<script>
  import { createEventDispatcher } from 'svelte';

  import Button from '../../reusable/Button.svelte';
  import Input from '../../reusable/Input.svelte';

  export let emailHighlight = '';
  export let isLoading = false;

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
  .email-form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .margin {
    margin-bottom: 15px;
  }
</style>
