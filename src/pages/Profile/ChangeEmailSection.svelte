<script>
  import ChangeEmailForm from './ChangeEmailForm.svelte';

  export let email = '';
  export let isLoading = false;

  $: data = {
    email,
  };
  let formMessage = {
    message: '',
    type: '',
  };
  let highlight = {
    email: '',
  };
  
  /**
   * Handle form submit
   * @returns {*}
   */
  const handleForm = async () => {
    // check the data

    try {

    } catch (error) {
      // remove the loader
      isLoading = false;
    };
  }

  /**
   * Handle text inputs
   * @param name {string} - input name
   * @param value {number|string} - input value
   * @returns {*}
   */
  const handleInput = ({ detail: { name = '', value = '' } = {} }) => {
    data[name] = value;
    highlight[name] = '';
    formMessage = {
      message: '',
      type: '',
    };
  }
</script>

<div class="section-title margin noselect">
  Change email address
</div>
<ChangeEmailForm
  { formMessage }
  { isLoading }
  email={data.email}
  emailHighlight={highlight.email}
  on:handle-form={handleForm}
  on:handle-input={handleInput}
/>

<style>
  .margin {
    margin-bottom: 15px;
  }
  .section-title {
    font-weight: bold;
  }
</style>
