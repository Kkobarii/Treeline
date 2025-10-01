<script>
  import { bubbleSortPseudocode } from "$lib/samplePseudocode";
    import { flip } from "svelte/animate";
    import { cubicInOut } from "svelte/easing";

  // Fake unsorted data
  let numbers = $state([7, 2, 9, 4, 1, 6]);

  // Current pseudocode line (simulate highlighting)
  let currentLine = 2; // highlight "if A[j] > A[j+1]"

  // Toggle between "bars" and "numbers" mode
  let mode = "bars";

  function swap() {
    let tmp = numbers[0];
    numbers[0] = numbers[4];
    numbers[4] = tmp;
  }
</script>

<h1 class="text-2xl font-bold mb-4">Sorting Visualization Prototype</h1>

<div class="flex gap-8">
  <!-- Visualization -->
  <div class="flex-1 border p-4 rounded bg-gray-50">
    <h2 class="text-lg font-semibold mb-2">Visualization</h2>
    {#if mode === "bars"}
      <!-- Bars mode -->
      <div class="flex items-end gap-2 h-64">
        {#each numbers as num, i (num)}
          <div class="bg-blue-400 w-8"
               animate:flip={{
                 duration: 400,
                 easing: cubicInOut
               }}
               style="height: {num * 20}px"
               ></div>
        {/each}
      </div>
    {:else if mode === "numbers"}
      <!-- Numbers mode -->
      <div class="flex gap-4 text-xl">
        {#each numbers as num}
          <div class="px-3 py-2 bg-blue-100 rounded shadow">{num}</div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Pseudocode -->
  <div class="w-72 border p-4 rounded bg-white">
    <h2 class="text-lg font-semibold mb-2">Pseudocode</h2>
    <div class="text-sm">
      {#each bubbleSortPseudocode as line, i}
        <div class="px-2 py-1 rounded
          {i === currentLine ? 'bg-yellow-200 font-bold' : ''}"
          >{line}</div>
      {/each}
    </div>
  </div>
</div>

<!-- Controls -->
<div class="mt-6 flex gap-4">
  <button class="px-4 py-2 rounded bg-blue-500 text-white"
          onclick={() => mode = "bars"}>
    Bars Mode
  </button>
  <button class="px-4 py-2 rounded bg-green-500 text-white"
          onclick={() => mode = "numbers"}>
    Numbers Mode
  </button>
  <button class="px-4 py-2 rounded bg-red-500 text-white"
          onclick={swap}>
    Swap
  </button>
</div>
