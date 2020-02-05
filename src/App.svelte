<script>
  import { Router } from 'svelte-router-spa';

  import { store } from './store';

  import Footer from './components/Footer.svelte';
  import Header from './components/Header.svelte';
  import { routes } from './router';

  $: showHeader = $store.nav.showHeader;
</script>

{#if showHeader}
  <Header />
{/if}
<main class={`main ${showHeader ? 'with-header' : 'without-header'}`}>
  <Router { routes } />
</main>
<Footer />

<style>
  .main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .with-header {
    min-height: calc(100vh - 110px);
  }
  .without-header {
    min-height: calc(100vh - 30px);
  }
</style>
