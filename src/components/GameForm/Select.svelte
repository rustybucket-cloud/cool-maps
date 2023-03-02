<script>
  export let value
  export let isDisabled
</script>

<label class="w-full">
  <select bind:value={value} disabled={isDisabled} class="w-full p-2">
    <option value="" disabled selected hidden>Select One</option>
    <slot></slot>
  </select>
</label>