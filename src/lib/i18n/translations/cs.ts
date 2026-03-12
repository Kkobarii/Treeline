import type { Translation } from './en';

const cs: Translation = {
	common: {
		run: 'Spustit',
		pause: 'Pozastavit',
		reset: 'Resetovat',
		speed: 'Rychlost',
		steps: 'Kroky',
		step: 'Krok',
		previous: 'Předchozí',
		next: 'Další',
		back: 'Zpět',
		insert: 'Vložit',
		remove: 'Odebrat',
		find: 'Najít',
	},

	nav: {
		dataStructures: 'Datové struktury',
		sortingAlgorithms: 'Třídicí algoritmy',
		about: 'O aplikaci',
	},

	footer: {
		copyright: '© 2026 Treeline. Vizuální nástroj pro výuku datových struktur a třídicích algoritmů.',
	},

	dataStructures: {
		binarySearchTree: 'Binární vyhledávací strom',
		avlTree: 'AVL strom',
		redBlackTree: 'Červeno-černý strom',
		bTree: 'B-strom',
		heap: 'Halda',
		linkedList: 'Spojový seznam',
		stack: 'Zásobník',
		queue: 'Fronta',
	},

	sortingAlgorithms: {
		bubbleSort: 'Bublinkové třídění',
		selectionSort: 'Třídění výběrem',
		insertionSort: 'Třídění vkládáním',
		mergeSort: 'Třídění slučováním',
		quickSort: 'Rychlé třídění',
		heapSort: 'Třídění haldou',
	},

	controls: {
		tree: {
			title: 'Ovládání stromu',
			insertRandom: 'Vložit náhodný uzel',
		},
		heap: {
			title: 'Ovládání haldy',
			insertRandom: 'Vložit náhodný uzel',
			extractRoot: 'Extrahovat kořen',
		},
		linkedList: {
			title: 'Ovládání spojového seznamu',
			insertRandomHead: 'Vložit náhodnou hlavu',
			insertRandomTail: 'Vložit náhodný konec',
			insertHead: 'Vložit hlavu',
			insertTail: 'Vložit konec',
		},
		stack: {
			title: 'Ovládání zásobníku',
			push: 'Vložit',
			pushRandom: 'Vložit náhodně',
			pop: 'Odebrat',
			peek: 'Nahlédnout',
		},
		queue: {
			title: 'Ovládání fronty',
			enqueue: 'Zařadit',
			enqueueRandom: 'Zařadit náhodně',
			dequeue: 'Vyřadit',
			peek: 'Nahlédnout',
		},
		operation: {
			title: 'Ovládání operací',
			info: 'Informace o operaci',
		},
	},

	sorting: {
		views: {
			bigPicture: 'Přehled',
			detailed: 'Detailní',
		},
		controls: {
			shuffle: 'Zamíchat {count} klíčů',
			shuffle16: 'Zamíchat 16',
			stepBack: 'Krok zpět',
			stepForward: 'Krok vpřed',
		},
		code: {
			title: 'Kód algoritmu',
			python: 'Python',
			javascript: 'JavaScript',
			c: 'C',
		},
		noSteps: 'Žádné kroky nejsou k dispozici pro toto pole.',
	},

	description: {
		title: 'Popis',
		noJs: 'Obsah popisu se načítá dynamicky a JavaScript je momentálně vypnutý.',
		readRaw: 'Stále si můžete přečíst surový popis zde:',
		notFound: 'Soubor s popisem {filename} nebyl nalezen nebo ho nebylo možné načíst.',
	},
};

export default cs;
