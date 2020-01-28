<script>
  export let message = '';
</script>

<div class={`error-block noselect ${message ? 'error-color' : ''}`}>
  { message }
</div>

<style>
  .error-block {
    color: transparent;
    height: 24px;
    margin: 15px 0 15px;
    text-align: center;
    transition: color 250ms ease;
    width: 100%;
  }
  .error-color {
    color: #ff2700;
    font-size: 18px;
  }
</style>
