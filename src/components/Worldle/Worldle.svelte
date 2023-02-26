<script>
  export let countries
  export let country

  const names = countries?.map((country) => country.name?.common)?.sort() || []
  let guess = 0
  const guesses = Array(5)

  const distances = Array(5)
  const angles = []

  let loading = false
  
  function judgeGuess() {
    const guessVal = guesses[guess]
    if (!guessVal) return
    const url = `/api/worldle?guess=${guessVal}&country=${country[0].ccn3}`
    loading = true
    fetch(url)
      .then((req) => req.json())
      .then((data) => {
        distances[guess] = data.distance
        angles.push(data.angle)
        guess++
        loading = false
      })
  }
</script>

<form class="grid gap-2 w-full px-5">
  {#each distances as distance,index}
    <div class="flex gap-4">
      <label class="w-full">
        <select bind:value={guesses[index]} disabled={guess !== index} class="w-full p-2">
          <option value="" disabled selected hidden>Select One</option>
          {#each names as country}
            {#if guesses.indexOf(country) === -1 || guesses.indexOf(country) === index}
              <option value={country}>{country}</option>
            {/if}
          {/each}
        </select>
      </label>
      {#if distance}
        <div>
          <p>{distance}km</p>
          <img src="/icons/arrow-up.svg" alt="" style={`rotate: ${angles[index]}deg;`} class="h-5 mx-auto ease-in"  />
        </div>
      {/if}
    </div>
  {/each}
  <button type="button" class="bg-teal-600 p-2 text-white hover:bg-teal-200 hover:text-black" on:click={judgeGuess}>
    Guess
  </button>
</form>
{#if loading} 
  <div class="w-screen h-screen bg-black opacity-30 absolute inset-0" />    
{/if}
