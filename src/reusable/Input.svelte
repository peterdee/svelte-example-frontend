<script>
  import { createEventDispatcher } from 'svelte';

  export let disabled = false;
  export let highlight = '';
  export let name = 'input';
  export let placeholder = '';
  export let type = 'text';

  const dispatch = createEventDispatcher();

  // highlighting
  $: highlightInput = (highlight === 'error' || highlight === 'success') ? highlight : '';

  // handle input
  const handleInput = (event) => dispatch('handle-input', event);

  // input ID 
  const id = `input-${name}`;
</script>

<input
  class="{`${highlightInput} noselect`}"
  on:input={handleInput}
  { disabled }
  { id }
  { name }
  { placeholder }
  { type }
/>

<style>
  input {
    background-color: #f7f7f7;
    border: none;
    border-bottom: 3px solid #e0e0e0;
    border-radius: 5px;
    font-size: 16px;
    height: 3em;
    padding: 0 15px;
    transition: border-bottom 250ms ease, background-color 250ms ease;
    width: 100%;
  }
  input:disabled {
    background-color: #e0e0e0;
    cursor: default;
    outline: none;
    transition: background-color 250ms ease;
  }
  input:focus {
    border-bottom: 3px solid #333;
    outline: none;
    transition: border-bottom 250ms ease;
  }
  .error {
    border-bottom: 3px solid #ff2700;
    transition: border-bottom 250ms ease;
  }
  .success {
    border-bottom: 3px solid #00ff95;
    transition: border-bottom 250ms ease;
  }
</style>
