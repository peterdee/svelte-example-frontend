<script>
  import { Router } from 'svelte-router-spa';

  import Footer from './components/Footer.svelte';
  import { routes } from './router';
</script>

<main>
  <Router { routes } />
</main>
<Footer />

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: calc(100vh - 30px);
  }
</style>
