<script>
  import { Navigate } from 'svelte-router-spa';
</script>

<div class="page-wrap">
  <h1>Index</h1>
  <p><Navigate to="login">Login</Navigate></p>
  <p><Navigate to="registration">Registration</Navigate></p>
</div>

<style>
  h1 {
    color: #ff3e00;
    font-size: 2em;
    font-weight: 100;
    text-transform: uppercase;
  }
  .page-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    margin: 0 auto;
  }
</style>
