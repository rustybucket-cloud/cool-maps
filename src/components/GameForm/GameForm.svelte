<script>
  export let buttonText
  export let handleSubmit
</script>

<form class="grid gap-2 w-full px-5" on:submit={handleSubmit}>
  <slot></slot>
  <button type="submit" class="bg-teal-600 p-2 text-white hover:bg-teal-200 hover:text-black">{buttonText}</button>
</form>