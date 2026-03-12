const en = {
	common: {
		run: 'Run',
		pause: 'Pause',
		reset: 'Reset',
		speed: 'Speed',
		steps: 'Steps',
		step: 'Step',
		previous: 'Previous',
		next: 'Next',
		back: 'Back',
		insert: 'Insert',
		remove: 'Remove',
		find: 'Find',
	},

	nav: {
		dataStructures: 'Data Structures',
		sortingAlgorithms: 'Sorting Algorithms',
		about: 'About',
	},

	footer: {
		copyright: '© 2026 Treeline. Visual tool for learning data structures and sorting algorithms.',
	},

	dataStructures: {
		binarySearchTree: 'Binary Search Tree',
		avlTree: 'AVL Tree',
		redBlackTree: 'Red-Black Tree',
		bTree: 'B-Tree',
		heap: 'Heap',
		linkedList: 'Linked List',
		stack: 'Stack',
		queue: 'Queue',
	},

	sortingAlgorithms: {
		bubbleSort: 'Bubble Sort',
		selectionSort: 'Selection Sort',
		insertionSort: 'Insertion Sort',
		mergeSort: 'Merge Sort',
		quickSort: 'Quick Sort',
		heapSort: 'Heap Sort',
	},

	controls: {
		tree: {
			title: 'Tree Controls',
			insertRandom: 'Insert Random Node',
		},
		heap: {
			title: 'Heap Controls',
			insertRandom: 'Insert Random Node',
			extractRoot: 'Extract Root',
		},
		linkedList: {
			title: 'Linked List Controls',
			insertRandomHead: 'Insert Random Head',
			insertRandomTail: 'Insert Random Tail',
			insertHead: 'Insert Head',
			insertTail: 'Insert Tail',
		},
		stack: {
			title: 'Stack Controls',
			push: 'Push',
			pushRandom: 'Push Random',
			pop: 'Pop',
			peek: 'Peek',
		},
		queue: {
			title: 'Queue Controls',
			enqueue: 'Enqueue',
			enqueueRandom: 'Enqueue Random',
			dequeue: 'Dequeue',
			peek: 'Peek',
		},
		operation: {
			title: 'Operation Controls',
			info: 'Operation Info',
		},
	},

	sorting: {
		views: {
			bigPicture: 'Big Picture',
			detailed: 'Detailed',
		},
		controls: {
			shuffle: 'Shuffle {count} Keys',
			shuffle16: 'Shuffle 16',
			stepBack: 'Step Back',
			stepForward: 'Step Forward',
		},
		code: {
			title: 'Algorithm Code',
			python: 'Python',
			javascript: 'JavaScript',
			c: 'C',
		},
		noSteps: 'No steps available for this array.',
	},

	description: {
		title: 'Description',
		noJs: 'Description content loads dynamically and JavaScript is currently disabled.',
		readRaw: 'You can still read the raw description here:',
		notFound: 'Description file {filename} not found or could not be loaded.',
	},
};

export type Translation = typeof en;
export default en;
