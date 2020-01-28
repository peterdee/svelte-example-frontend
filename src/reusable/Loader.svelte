<script>
  import { fade } from 'svelte/transition';

  export let duration = 250;
  export let isLoading = false;
</script>

{#if isLoading}
  <div
    class="loader-background"
    transition:fade="{{ duration }}"
  >
    <div class="centered">
      <div id="preloader">
        <div id="loader"></div>
      </div>
    </div>
  </div>
{/if}

<style>
  .loader-background {
    background-color: rgba(255, 255, 255, 0.75);
    height: 100vh;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
  }
.centered {
  margin: auto auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
#preloader {
  position: fixed;
  top: 30%;
  left: 30%;
  width: 40%;
  height: 40%;
}
#loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color:  rgba(55, 55, 55, 0.336);
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
#loader:before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: rgba(80, 80, 80, 0.699);
  -webkit-animation: spin 3s linear infinite;
  animation: spin 3s linear infinite;
}
#loader:after {
  content: "";
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: rgb(125, 125, 125);
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
