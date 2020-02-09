<script>
  // possible types
  const types = {
    error: 'error',
    success: 'success',
  };

  export let message = '';
  export let type = types.error;

  // determine the message color
  $: color = Object.keys(types).includes(type) ? type : types.error;
</script>

<div class={`info-block noselect ${message ? color : ''}`}>
  { message }
</div>

<style>
  .info-block {
    color: transparent;
    font-size: 18px;
    height: 24px;
    margin: 15px 0 15px;
    text-align: center;
    transition: color 250ms ease;
    width: 100%;
  }
  .error {
    color: #ff2700;
  }
  .success {
    color: #009255; 
  }
</style>
