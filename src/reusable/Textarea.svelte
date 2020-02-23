<script>
  import { createEventDispatcher } from 'svelte';

  export let disabled = false;
  export let highlight = '';
  export let name = 'textarea';
  export let placeholder = '';
  export let value = '';

  const dispatch = createEventDispatcher();
  const id = `textarea-${name}`;

  // highlighting
  $: highlightTextarea = (highlight === 'error' || highlight === 'success') ? highlight : '';

  /**
   * Handle textarea
   * @param event {object} - event object
   * @returns {void}
   */
  const handleInput = (event = {}) => dispatch('handle-input', event);
</script>

<textarea
  { disabled }
  { id }
  { name }
  { placeholder }
  { value }
  on:input={handleInput}
  class="{`${highlightTextarea} noselect`}"
></textarea>

<style>
  .error {
    border-bottom: 3px solid #ff2700;
    transition: border-bottom 250ms ease;
  }
  .success {
    border-bottom: 3px solid #00ff95;
    transition: border-bottom 250ms ease;
  }
  textarea {
    background-color: #f7f7f7;
    border: none;
    border-bottom: 3px solid #e0e0e0;
    border-radius: 5px;
    font-size: 16px;
    height: 6em;
    padding: 0 15px;
    resize: none;
    transition: border-bottom 250ms ease, background-color 250ms ease;
    width: 100%;
  }
  textarea:disabled {
    background-color: #e0e0e0;
    cursor: default;
    outline: none;
    transition: background-color 250ms ease;
  }
  textarea:focus {
    border-bottom: 3px solid #333;
    outline: none;
    transition: border-bottom 250ms ease;
  }
</style>
