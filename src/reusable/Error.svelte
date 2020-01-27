<script>
  import { fade } from 'svelte/transition';

  export let duration = 250;
  export let message = '';
</script>

<div class="error-block noselect">
  {#if message}
    <span transition:fade="{{ duration }}">
      { message }
    </span>
  {/if}
</div>

<style>
  .error-block {
    height: 26px;
    margin: 15px 0 15px;
    text-align: center;
    width: 100%;
  }
  .error-block > span {
    color: #ff2700;
    font-size: 18px;
  }
</style>
