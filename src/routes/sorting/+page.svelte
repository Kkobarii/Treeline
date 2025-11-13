<script>
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';

	import { bubbleSortPseudocode } from '$lib/samplePseudocode';

	// Fake unsorted data
	let numbers = $state([7, 2, 9, 4, 1, 6]);

	// Current pseudocode line (simulate highlighting)
	let currentLine = 2; // highlight "if A[j] > A[j+1]"

	// Toggle between "bars" and "numbers" mode
	let mode = 'bars';

	function swap() {
		let tmp = numbers[0];
		numbers[0] = numbers[4];
		numbers[4] = tmp;
	}
</script>

<h1 class="mb-4 text-2xl font-bold">Sorting Visualization Prototype</h1>

<div class="flex gap-8">
	<!-- Visualization -->
	<div class="flex-1 rounded border bg-gray-50 p-4">
		<h2 class="mb-2 text-lg font-semibold">Visualization</h2>
		{#if mode === 'bars'}
			<!-- Bars mode -->
			<div class="flex h-64 items-end gap-2">
				{#each numbers as num, i (num)}
					<div
						class="w-8 bg-blue-400"
						animate:flip={{
							duration: 400,
							easing: cubicInOut,
						}}
						style="height: {num * 20}px">
					</div>
				{/each}
			</div>
		{:else if mode === 'numbers'}
			<!-- Numbers mode -->
			<div class="flex gap-4 text-xl">
				{#each numbers as num}
					<div class="rounded bg-blue-100 px-3 py-2 shadow">{num}</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Pseudocode -->
	<div class="w-72 rounded border bg-white p-4">
		<h2 class="mb-2 text-lg font-semibold">Pseudocode</h2>
		<div class="text-sm">
			{#each bubbleSortPseudocode as line, i}
				<div
					class="rounded px-2 py-1
          {i === currentLine ? 'bg-yellow-200 font-bold' : ''}">
					{line}
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Controls -->
<div class="mt-6 flex gap-4">
	<button
		class="rounded bg-blue-500 px-4 py-2 text-white"
		onclick={() => (mode = 'bars')}>
		Bars Mode
	</button>
	<button
		class="rounded bg-green-500 px-4 py-2 text-white"
		onclick={() => (mode = 'numbers')}>
		Numbers Mode
	</button>
	<button
		class="rounded bg-red-500 px-4 py-2 text-white"
		onclick={swap}>
		Swap
	</button>
</div>
