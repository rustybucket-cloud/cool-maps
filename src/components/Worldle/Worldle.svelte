<script>
  export let countries
  export let country

  import GameForm from "../GameForm/GameForm.svelte"
  import Select from "../GameForm/Select.svelte"

  let guess = 0
  let guesses = Array(5)

  let distances = Array(5)
  const angles = []

  let error

  let loading = false
  let isCorrect = false
  let gameOver = false

  function judgeGuess(e) {
    e.preventDefault()
    const guessVal = guesses[guess]
    if (!guessVal) return
  
    const url = `/api/worldle?guess=${guessVal}&country=${country}`
    loading = true
    fetch(url)
      .then((req) => req.json())
      .then((data) => {
        const distance = data.distance
        distances[guess] = distance
        angles.push(data.angle)
        guess++
        loading = false

        if (distance === 0) {
          isCorrect = true
          return
        }

        if (guess === guesses.length) {
          gameOver = true
        }
      })
  }

  function getDistanceText() {
    const distance = distances.reduce((prev, curr) => prev + curr, 0)
    if (distance === 0) return 'First guess! Great job!'
    return `Total Distance: ${distance} km`
  }

  function resetGame() {
    guess = 0
    isCorrect = false
    gameOver = false
    guesses = guesses.fill("")
    distances = distances.fill(null)
  }

  let answer
  async function showAnswer() {
    try {
      const req = await fetch(`https://restcountries.com/v3.1/alpha/${country}`)
      const data = await req.json()
      answer = data?.[0]?.name?.common
    } catch (err) {
      error = "Unable to get answer"
      console.log(err)
    }
  }

  let canDismiss = isCorrect || Boolean(answer)
  function handlePageClick() {
    if (canDismiss) {
      gameOver = false
      answer = null
      isCorrect = false
      loading = false
    }
  }
</script>

{#if error}
  <div class="w-screen h-screen absolute inset-0 flex justify-center items-center">
    <p class="text-rose-500 text-2xl bg-white p-5">{error}</p>
  </div>
{/if}
<GameForm buttonText="Guess" handleSubmit={judgeGuess}>
  {#each distances as distance,index}
    <div class="flex gap-4">
      <Select bind:value={guesses[index]} isDisabled={guess !== index}>
        <option value="" disabled selected hidden>Select One</option>
        {#each countries as country}
          {#if guesses.indexOf(country) === -1 || guesses.indexOf(country) === index}
            <option value={country}>{country}</option>
          {/if}
        {/each}
      </Select>
      {#if distance}
        <div>
          <p>{distance}km</p>
          <img src="/icons/arrow-up.svg" alt="" style={`rotate: ${angles[index]}deg;`} class="h-5 mx-auto ease-in"  />
        </div>
      {/if}
    </div>
  {/each}
</GameForm>
{#if loading || isCorrect || gameOver}
  <div class="w-screen h-screen absolute inset-0 flex justify-center items-center screen">
    <div class="w-screen h-screen bg-white opacity-40 absolute inset-0" />
    {#if loading}
      <img src="/icons/spinner.svg" alt="a spinning icon" class="h-20 w-20 z-10 loadingSpinner">
    {:else if isCorrect}
      <div class="bg-black text-white w-full min-h-20 py-5 mx-5 flex flex-col justify-center items-center z-10 max-w-4xl rounded-md">
        <h2 class="text-2xl">Correct!</h2>
        <p>{getDistanceText()}</p>
      </div>
    {:else if gameOver}
      <div class="bg-black text-white w-full min-h-20 mx-5 py-5 flex gap-3 flex-col justify-center items-center z-10 max-w-4xl rounded-md" on:click={handlePageClick} on:keydown={handlePageClick}>
        <h2 class="text-2xl">Sorry! You're out of guesses.</h2>
        <div class="flex gap-2">
          {#if answer}
            <p class="text-lg">{answer}</p>
          {:else}
            <button class="bg-teal-600 p-2 text-white hover:bg-teal-200 hover:text-black" on:click={resetGame}>Try Again</button>
            <button class="bg-teal-600 p-2 text-white hover:bg-teal-200 hover:text-black" on:click={showAnswer}>Reveal The Answer</button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  @keyframes spin {
    from { transform: rotate(0deg); }
    from { transform: rotate(359deg); }
  }
  .loadingSpinner {
    animation: spin 1s linear infinite;
  }
</style>