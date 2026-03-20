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
		bubbleSort: 'Bubble sort',
		selectionSort: 'Selection sort',
		insertionSort: 'Insertion sort',
		mergeSort: 'Merge sort',
		quickSort: 'Quick sort',
		heapSort: 'Heap sort',
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

	steps: {
		dataStructures: {
			common: {
				startData: 'Začátek',
				endData: 'Konec',
				createRootData: 'Vytvořit kořenový uzel {nodeId} s hodnotou {value}',
				createLeafData: 'Vytvořit listový uzel {nodeId} s hodnotou {value} jako {direction} potomek uzlu {parentId}',
				compareData: 'Porovnat hodnotu {value} s uzlem {comparisonId} (hodnota {comparisonValue})',
				traverseData: 'Přejít {direction} z uzlu {fromId} do uzlu {toId}',
				dropData: 'Zahodit hodnotu {value} z uzlu {fromId} z důvodu {reason}',
				foundData: 'Nalezena hodnota {value} v uzlu {nodeId}',
				markToDeleteData: 'Označit uzel {nodeId} s hodnotou {value} ke smazání',
				deleteData: 'Smazat uzel {nodeId} s hodnotou {value}',
				replaceWithChildData: 'Nahradit uzel {oldNodeId} jeho {direction} potomkem {newNodeId} s hodnotou {newValue}',
				replaceWithInorderSuccessorData:
					'Nahradit uzel {oldNodeId} jeho inorder následníkem {successorNodeId} s hodnotou {successorValue}',
				relinkSuccessorChildData:
					'Přepojit potomka {childNodeId} s hodnotou {childValue} z následníka na rodičovský uzel {newParentNodeId} s hodnotou {newParentValue}',
				foundInorderSuccessorData: 'Nalezen inorder následník {successorId} s hodnotou {successorValue} pro uzel {nodeId}',
				caseAnalysisData: 'Případ {caseNumber}: {description}',
			},
			avlTree: {
				updateHeightBalanceData: 'Aktualizovat výšku a vyvážení uzlu {nodeId} na H:{height}, B:{balance}',
				rotateLeftData: 'Rotace doleva v kořeni {oldRootId}, nový kořen {newRootId}',
				rotateRightData: 'Rotace doprava v kořeni {oldRootId}, nový kořen {newRootId}',
			},
			rbTree: {
				colorNodeData: 'Obarvit uzel {nodeId} na {color}',
				rotateLeftData: 'RB rotace doleva v kořeni {oldRootId}, nový kořen {newRootId}',
				rotateRightData: 'RB rotace doprava v kořeni {oldRootId}, nový kořen {newRootId}',
				fixupData: 'Oprava v uzlu {nodeId}: {reason}',
			},
			heap: {
				appendData: 'Přidat hodnotu {value} na konec haldy',
				compareWithParentNeedsSwapData: 'Porovnání uzlu {nodeId} s rodičem {parentId} - je potřeba prohodit',
				compareWithParentCorrectData: 'Porovnání uzlu {nodeId} s rodičem {parentId} - správná pozice',
				replaceRootWithLastData: 'Nahradit kořen {rootValue} posledním uzlem {lastValue}',
				compareWithChildrenHasLargestData: 'Porovnání uzlu {nodeId} s potomky, největší je {largestChildId}',
				compareWithChildrenCorrectData: 'Uzel {nodeId} je již na správné pozici',
				findLargestChildData: 'Nalezen největší potomek: uzel {largestChildId} s hodnotou {largestChildValue}',
				swapData: 'Prohodit uzel {fromId} (hodnota {fromValue}) s uzlem {toId} (hodnota {toValue})',
			},
			linkedList: {
				createHeadData: 'Vytvořit hlavový uzel {nodeId} s hodnotou {value}',
				insertAtHeadData: 'Vložit uzel {nodeId} s hodnotou {value} na začátek',
				insertAtTailData: 'Vložit uzel {nodeId} s hodnotou {value} na konec',
				compareData: 'Porovnat hledanou hodnotu {searchValue} s hodnotou {currentValue} v uzlu {currentId} na pozici {position}',
				traverseNextData: 'Přejít z uzlu {fromId} na následující uzel {toId}',
				traverseToTailData: 'Přejít na konec seznamu od uzlu {fromId}',
				foundData: 'Nalezena hodnota {value} v uzlu {nodeId} na pozici {position}',
				notFoundData: 'Hodnota {value} nebyla v seznamu nalezena',
				markToDeleteData: 'Označit uzel {nodeId} s hodnotou {value} ke smazání',
				removeHeadData: 'Odstranit hlavový uzel',
				removeNodeData: 'Odstranit uzel {nodeId}',
				emptyListData: 'Seznam je prázdný',
			},
			bTree: {
				markOverfullData: 'Uzel {nodeId} je přeplněný: {currentCount} hodnot (max {maxCount})',
				splitData: 'Rozdělit uzel {nodeId}: posunout {middleValue} nahoru (levý: {leftNodeId}, pravý: {rightNodeId})',
				promoteMiddleAsNewRootData: 'Povýšit {middleValue} na nový kořen',
				promoteMiddleIntoParentData: 'Povýšit {middleValue} do rodiče ({targetNodeId})',
				chooseBranchData: 'Vybrat potomka {childIndex} (uzel {childId}) pro hodnotu {value}',
				chooseBranchBetweenData:
					'Vybrat potomka {childIndex} (uzel {childId}) pro hodnotu {value} (mezi {lowerBound} a {upperBound})',
				chooseBranchGreaterThanData: 'Vybrat potomka {childIndex} (uzel {childId}) pro hodnotu {value} (větší než {lowerBound})',
				chooseBranchLessThanData: 'Vybrat potomka {childIndex} (uzel {childId}) pro hodnotu {value} (menší než {upperBound})',
				insertValueData: 'Vložit hodnotu {value} do uzlu {nodeId}',
				removeValueData: 'Odebrat hodnotu {value} z uzlu {nodeId}',
				replaceValueData: 'Nahradit hodnotu {oldValue} hodnotou {newValue} ({replacementSource}) v uzlu {nodeId}',
				borrowFromLeftData:
					'Vypůjčit hodnotu {borrowedValue} z levého sourozence {siblingId} přes rodičovskou hodnotu {parentValue} do uzlu {childId}',
				borrowFromRightData:
					'Vypůjčit hodnotu {borrowedValue} z pravého sourozence {siblingId} přes rodičovskou hodnotu {parentValue} do uzlu {childId}',
				mergeChildrenData: 'Sloučit uzel {leftChildId} a uzel {rightChildId} s rodičovskou hodnotou {parentValue}',
				findInorderReplacementPredecessorData: 'Nalezena hodnota předchůdce {replacementValue} v uzlu {childId} pro uzel {nodeId}',
				findInorderReplacementSuccessorData: 'Nalezena hodnota následníka {replacementValue} v uzlu {childId} pro uzel {nodeId}',
			},
			stack: {
				pushData: 'Vložit hodnotu {value} na zásobník',
				popData: 'Odebrat hodnotu {value} ze zásobníku',
				peekData: 'Nahlédnout na horní hodnotu {value}',
				emptyData: 'Zásobník je prázdný',
			},
			queue: {
				enqueueData: 'Zařadit hodnotu {value} do fronty',
				dequeueData: 'Vyřadit hodnotu {value} z fronty',
				peekData: 'Nahlédnout na čelní hodnotu {value}',
				emptyData: 'Fronta je prázdná',
			},
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
		steps: {
			common: {
				initialArray: 'Počáteční pole',
				finalArray: 'Konečné pole',
			},
			bubble: {
				start: 'Začátek bubble sortu',
				outerIteration: 'Vnější iterace i={i}',
				innerIteration: 'Vnitřní iterace j={j}',
				compare: 'Porovnat arr[{j}] a arr[{nextJ}]',
				swap: 'Prohodit indexy {j} a {nextJ}',
			},
			insertion: {
				start: 'Začátek insertion sortu: první prvek je již seřazen',
				outerIteration: 'Začít řadit prvek na indexu {i}',
				compare: 'Porovnat prvek na indexu {j} s předchozím prvkem',
				swap: 'Prohodit prvky na indexech {j} a {previousJ}',
			},
			selection: {
				start: 'Začátek selection sortu',
				outerIteration: 'Začít hledat minimum pro pozici {i}',
				scan: 'Procházet j={j} proti aktuálnímu minimu',
				compare: 'Porovnat arr[{j}] s aktuálním minimem arr[{minIndex}]',
				newMinimum: 'Nalezeno nové minimum na indexu {minIndex}',
				swap: 'Prohodit index {i} s minimálním indexem {minIndex}',
			},
			heap: {
				basic: {
					compareRootLeftRight: 'Porovnat {root} s {left} a {right}',
					compareRootLeft: 'Porovnat {root} s levým potomkem {left}',
					compareRootRight: 'Porovnat {root} s pravým potomkem {right}',
					heapifySwap: 'Heapify prohození {root} a {largest}',
					moveMaxToIndex: 'Přesunout maximum na index {end}',
				},
				detailed: {
					heapifyStart: 'Porovnat {root} s levým potomkem {left}',
					compareLeft: 'Je levý potomek {left} větší než kořen {root}?',
					leftLarger: 'Levý potomek {left} je větší, aktualizovat largest',
					compareRight: 'Je pravý potomek {right} větší než aktuální largest {largest}?',
					rightLarger: 'Pravý potomek {right} je větší, aktualizovat largest',
					swapRootWithLargest: 'Prohodit kořen {root} s větším potomkem {largest}',
					callHeapifyRecursive: 'Rekurzivně zavolat heapify na indexu {largest}',
					endHeapify: 'Konec heapify pro kořen {root}',
					startHeapSort: 'Začátek heap sortu',
					buildHeapAtIndex: 'Budovat haldu od indexu {i}',
					moveMaxToIndex: 'Přesunout maximum na index {end}',
					heapifyAfterExtractingMax: 'Heapify kořene po vyjmutí maxima',
					heapSortComplete: 'Heap sort dokončen',
				},
			},
			merge: {
				basic: {
					compare: 'Porovnat arr[{leftPos}] a arr[{rightPos}]',
					shift: 'Posunout prvek z {from} na {to}',
				},
				detailed: {
					startMerging: 'Začít slučovat leftArr[{left}..{mid}] a rightArr[{rightStart}..{right}]',
					compare: 'Porovnat leftArr[{leftPos}] a rightArr[{rightPos}]',
					moveLeftToOutput: 'Přesunout leftArr[{leftPos}] na výstupní pozici {i}',
					moveRightToOutput: 'Přesunout rightArr[{rightPos}] na výstupní pozici {i}',
					insertRemainingLeft: 'Vložit zbývající levý prvek na pozici {leftPos}',
					insertRemainingRight: 'Vložit zbývající pravý prvek na pozici {i}',
					startMergeSortSegment: 'Začátek merge_sort na arr[{left}..{right}]',
					divideSegment: 'Rozdělit arr[{left}..{right}] na arr[{left}..{mid}] a arr[{rightStart}..{right}]',
					mergeSortLeftSegment: 'Merge sort arr[{left}..{mid}]',
					mergeSortRightSegment: 'Merge sort arr[{rightStart}..{right}]',
					finishedMergeSortSegment: 'Dokončen merge_sort na arr[{left}..{right}]',
				},
			},
			quick: {
				basic: {
					compareWithPivot: 'Porovnat arr[{j}] s pivotem',
					moveIntoLeftPartition: 'Přesunout arr[{j}] do levé části',
					placePivot: 'Umístit pivot na index {pivotIndex}',
				},
				detailed: {
					partitionStart: 'Rozdělit arr[{low}..{high}] s pivotem arr[{high}]',
					compareWithPivotAtHigh: 'Porovnat arr[{j}] s pivotem arr[{high}]',
					moveIntoLeftPartitionAtIndex: 'Přesunout arr[{j}] do levé části na index {i}',
					allComparedPlacePivot: 'Všechny prvky porovnány. Umístit pivot na finální pozici {pivotIndex}',
					placePivot: 'Umístit pivot na index {pivotIndex}',
					partitionDone: 'Rozdělení dokončeno pro arr[{low}..{high}] s pivot indexem {pivotIndex}',
					quickSortSegment: 'Quick sort arr[{low}..{high}]',
					singleElementSorted: 'Jednoprvkový segment arr[{low}] je seřazen',
					recurseLeft: 'Rekurze vlevo na arr[{low}..{high}]',
					recurseRight: 'Rekurze vpravo na arr[{low}..{high}]',
					finishedQuickSortSegment: 'Dokončen quick_sort na arr[{low}..{high}]',
				},
			},
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
