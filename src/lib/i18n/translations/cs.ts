import type { Translation } from './en';

const cs: Translation = {
	meta: {
		name: 'Čeština',
		flag: '🇨🇿',
	},

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
		copyright: 'Vizuální nástroj pro výuku datových struktur a třídicích algoritmů.',
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
			insertRandomHead: 'Vložit na začátek náhodně',
			insertRandomTail: 'Vložit na konec náhodně',
			insertHead: 'Vložit na začátek',
			insertTail: 'Vložit na konec',
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
			detailed: 'Detail',
		},
		controls: {
			shuffle: 'Zamíchat {count} klíčů',
			shuffle16: 'Zamíchat',
			stepBack: 'Krok zpět',
			stepForward: 'Krok vpřed',
		},
		code: {
			title: 'Kód algoritmu',
			python: 'Python',
			javascript: 'JavaScript',
			c: 'C',
		},
		noSteps: 'Pro toto pole nejsou k dispozici žádné kroky.',
	},

	description: {
		title: 'Popis',
		noJs: 'Obsah popisu se načítá dynamicky a JavaScript je momentálně vypnutý.',
		readRaw: 'Stále si můžete přečíst popis zde:',
		notFound: 'Soubor s popisem {filename} nebyl nalezen nebo ho nebylo možné načíst.',
	},
};

export default cs;
