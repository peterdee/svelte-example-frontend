<script>
  import DetailsForm from './DetailsForm.svelte';

  export let firstName = '';
  export let isLoading = false;
  export let lastName = '';

  let formMessage = {
    message: '',
    type: '',
  };
  let highlight = {
    firstName: '',
    lastName: '',
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
    profile[name] = value;
    highlight[name] = '';
    formMessage = {
      message: '',
      type: '',
    };
  }
</script>

<div class="section-title margin noselect">
  Update personal details
</div>
<DetailsForm
  { isLoading }
  { firstName }
  { formMessage }
  { lastName}
  firstNameHighlight={highlight.firstName}
  lastNameHighlight={highlight.lastName}
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
