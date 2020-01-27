<script>
  export let disabled = false;
  export let size = 'auto';
  export let text = '';
  export let type = 'button';

  // button size
  const buttonSize = size === 'small' || size === 'medium' || size === 'large' ? size : '';
</script>

<button
  class={`noselect ${buttonSize}`}
  { disabled }
  { type }
>
  { text }
</button>

<style>
  button {
    background-color: #b0b0b0;
    border: none;
    border-bottom: 3px solid #909090;
    border-radius: 5px;
    color: #fff;
    font-size: 16px;
    height: 3em;
    padding: 0 15px;
    text-align: center;
    text-transform: uppercase;
    transition: background-color 500ms ease, border-bottom 250ms ease;
    width: 100%;
  }
  button:focus, button:hover {
    background-color: #909090;
    transition: background-color 500ms ease;
  }
  button:focus {
    outline: none;
  }
  button:hover {
    cursor: pointer;
  }
  button:disabled {
    background-color: #909090;
    border-bottom: 3px solid #909090;
    cursor: default;
    transition: background-color 500ms ease, border-bottom 250ms ease;
  }
  .large {
    width: 500px;
  }
  .medium {
    width: 325px;
  }
  .small {
    width: 150px;
  }
</style>
