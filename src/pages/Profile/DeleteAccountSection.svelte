<script>
  import { createEventDispatcher } from 'svelte';

  import Button from '../../reusable/Button.svelte';
  import Info from '../../reusable/Info.svelte';

  export let isLoading = false;

  let formMessage = {
    message: '',
    type: '',
  };
  
  const dispatch = createEventDispatcher();

  /**
   * Switch loader
   * @param isVisible {boolean} - should the loader be visible
   * @returns {void}
   */
  const handleLoader = (isVisible = false) => dispatch('switch-loader', isVisible);

  const handleClick = () => {
    handleLoader(true);

  };
</script>

<div class="section-title margin">
  Delete account
</div>
<div class="section">
  <Button
    disabled={isLoading}
    text="Delete account"
    type="submit"
  />
  <Info
    message={formMessage.message}
    type={formMessage.type}
  />
</div>

<style>
  .margin {
    margin-bottom: 15px;
  }
  .section {
    max-width: 349px;
    width: 100%;
  }
  .section-title {
    font-weight: bold;
  }
</style>
