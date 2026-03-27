const en = {
	meta: {
		name: 'English',
		flag: '🇬🇧',
	},

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
		operation: 'Operation',
	},

	nav: {
		dataStructures: 'Data Structures',
		sortingAlgorithms: 'Sorting Algorithms',
		about: 'About',
	},

	footer: {
		copyright: 'Visual tool for learning data structures and sorting algorithms.',
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
		common: {
			initial: 'Initial',
		},
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

	steps: {
		dataStructures: {
			common: {
				startData: 'Start',
				endData: 'End',
				createRootData: 'Create root node {nodeId} with value {value}',
				createLeafData: 'Create leaf node {nodeId} with value {value} as {direction} child of {parentId}',
				compareData: "Compare value {value} with node {comparisonId}'s {comparisonValue}",
				traverseData: 'Traverse {direction} from node {fromId} to node {toId}',
				dropData: 'Drop value {value} from node {fromId} due to {reason}',
				foundData: 'Found value {value} at node {nodeId}',
				markToDeleteData: 'Mark node {nodeId} with value {value} to delete',
				deleteData: 'Delete node {nodeId} with value {value}',
				replaceWithChildData: 'Replace node {oldNodeId} with its {direction} child node {newNodeId} having value {newValue}',
				replaceWithInorderSuccessorData:
					'Replace node {oldNodeId} with its inorder successor node {successorNodeId} having value {successorValue}',
				relinkSuccessorChildData:
					'Relink child node {childNodeId} with value {childValue} from successor to parent node {newParentNodeId} with value {newParentValue}',
				foundInorderSuccessorData: 'Found inorder successor node {successorId} with value {successorValue} for node {nodeId}',
				caseAnalysisData: 'Case {caseNumber}: {description}',
			},
			avlTree: {
				updateHeightBalanceData: 'Update height and balance of node {nodeId} to H:{height}, B:{balance}',
				rotateLeftData: 'Rotate left at root {oldRootId}, new root {newRootId}',
				rotateRightData: 'Rotate right at root {oldRootId}, new root {newRootId}',
			},
			rbTree: {
				colorNodeData: 'Color node {nodeId} {color}',
				rotateLeftData: 'RB rotate left at root {oldRootId}, new root {newRootId}',
				rotateRightData: 'RB rotate right at root {oldRootId}, new root {newRootId}',
				fixupData: 'Fixup at node {nodeId}: {reason}',
			},
			heap: {
				appendData: 'Append value {value} to end of heap',
				compareWithParentNeedsSwapData: 'Comparing node {nodeId} with parent {parentId} - needs swap',
				compareWithParentCorrectData: 'Comparing node {nodeId} with parent {parentId} - in correct position',
				replaceRootWithLastData: 'Replace root {rootValue} with last node {lastValue}',
				compareWithChildrenHasLargestData: 'Comparing node {nodeId} with children, largest is {largestChildId}',
				compareWithChildrenCorrectData: 'Node {nodeId} is already in correct position',
				findLargestChildData: 'Found largest child: node {largestChildId} with value {largestChildValue}',
				swapData: 'Swap node {fromId} (value {fromValue}) with node {toId} (value {toValue})',
			},
			linkedList: {
				createHeadData: 'Create head node {nodeId} with value {value}',
				insertAtHeadData: 'Insert node {nodeId} with value {value} at head',
				insertAtTailData: 'Insert node {nodeId} with value {value} at tail',
				compareData: "Compare search value {searchValue} with node {currentId}'s value {currentValue} at position {position}",
				traverseNextData: 'Traverse from node {fromId} to next node {toId}',
				traverseToTailData: 'Traverse to tail starting from node {fromId}',
				foundData: 'Found value {value} at node {nodeId} at position {position}',
				notFoundData: 'Value {value} not found in list',
				markToDeleteData: 'Mark node {nodeId} with value {value} for deletion',
				removeHeadData: 'Remove head node',
				removeNodeData: 'Remove node {nodeId}',
				emptyListData: 'List is empty',
			},
			bTree: {
				markOverfullData: 'Node {nodeId} is overfull: {currentCount} values (max {maxCount})',
				splitData: 'Split node {nodeId}: move {middleValue} up (left: {leftNodeId}, right: {rightNodeId})',
				promoteMiddleAsNewRootData: 'Promote {middleValue} as new root',
				promoteMiddleIntoParentData: 'Promote {middleValue} into parent ({targetNodeId})',
				chooseBranchData: 'Choose child {childIndex} (node {childId}) for value {value}',
				chooseBranchBetweenData:
					'Choose child {childIndex} (node {childId}) for value {value} (between {lowerBound} and {upperBound})',
				chooseBranchGreaterThanData: 'Choose child {childIndex} (node {childId}) for value {value} (greater than {lowerBound})',
				chooseBranchLessThanData: 'Choose child {childIndex} (node {childId}) for value {value} (less than {upperBound})',
				insertValueData: 'Insert value {value} into node {nodeId}',
				removeValueData: 'Remove value {value} from node {nodeId}',
				replaceValueData: 'Replace value {oldValue} with {newValue} ({replacementSource}) in node {nodeId}',
				borrowFromLeftData:
					'Borrow value {borrowedValue} from left sibling {siblingId} through parent value {parentValue} to node {childId}',
				borrowFromRightData:
					'Borrow value {borrowedValue} from right sibling {siblingId} through parent value {parentValue} to node {childId}',
				mergeChildrenData: 'Merge node {leftChildId} and node {rightChildId} with parent value {parentValue}',
				findInorderReplacementPredecessorData: 'Found predecessor value {replacementValue} in node {childId} for node {nodeId}',
				findInorderReplacementSuccessorData: 'Found successor value {replacementValue} in node {childId} for node {nodeId}',
			},
			stack: {
				pushData: 'Push value {value} onto stack',
				popData: 'Pop value {value} from stack',
				peekData: 'Peek top value {value}',
				emptyData: 'Stack is empty',
			},
			queue: {
				enqueueData: 'Enqueue value {value} to queue',
				dequeueData: 'Dequeue value {value} from queue',
				peekData: 'Peek front value {value}',
				emptyData: 'Queue is empty',
			},
		},
	},

	sorting: {
		views: {
			bigPicture: 'Big Picture',
			detailed: 'Detailed',
		},
		controls: {
			shuffle: 'Shuffle',
		},
		code: {
			title: 'Algorithm Code',
			python: 'Python',
			javascript: 'JavaScript',
			c: 'C',
		},
		steps: {
			common: {
				initialArray: 'Initial array',
				finalArray: 'Final array',
			},
			bubble: {
				start: 'Start bubble sort',
				outerIteration: 'Outer iteration i={i}',
				innerIteration: 'Inner iteration j={j}',
				compare: 'Compare arr[{j}] and arr[{nextJ}]',
				swap: 'Swap indices {j} and {nextJ}',
			},
			insertion: {
				start: 'Start insertion sort: first element is already sorted',
				outerIteration: 'Start sorting element at index {i}',
				compare: 'Compare element at index {j} with previous element',
				swap: 'Swap elements at indices {j} and {previousJ}',
			},
			selection: {
				start: 'Start selection sort',
				outerIteration: 'Start searching minimum for position {i}',
				scan: 'Scan j={j} against current minimum',
				compare: 'Compare arr[{j}] with current minimum arr[{minIndex}]',
				newMinimum: 'New minimum found at index {minIndex}',
				swap: 'Swap index {i} with minimum index {minIndex}',
			},
			heap: {
				basic: {
					compareRootLeftRight: 'Compare {root} with {left} and {right}',
					compareRootLeft: 'Compare {root} with left child {left}',
					compareRootRight: 'Compare {root} with right child {right}',
					heapifySwap: 'Heapify swap {root} and {largest}',
					moveMaxToIndex: 'Move max value to index {end}',
				},
				detailed: {
					heapifyStart: 'Compare {root} with left child {left}',
					compareLeft: 'Is left child {left} larger than root {root}?',
					leftLarger: 'Left child {left} is larger, update largest',
					compareRight: 'Is right child {right} larger than current largest {largest}?',
					rightLarger: 'Right child {right} is larger, update largest',
					swapRootWithLargest: 'Swap root {root} with larger child {largest}',
					callHeapifyRecursive: 'Call heapify recursively on index {largest}',
					endHeapify: 'End heapify for root {root}',
					startHeapSort: 'Start heap sort',
					buildHeapAtIndex: 'Build heap starting at index {i}',
					moveMaxToIndex: 'Move max value to index {end}',
					heapifyAfterExtractingMax: 'Heapify root after extracting max',
					heapSortComplete: 'Heap sort complete',
				},
			},
			merge: {
				basic: {
					compare: 'Compare arr[{leftPos}] and arr[{rightPos}]',
					shift: 'Shift element from {from} to {to}',
				},
				detailed: {
					startMerging: 'Start merging leftArr[{left}..{mid}] and rightArr[{rightStart}..{right}]',
					compare: 'Compare leftArr[{leftPos}] and rightArr[{rightPos}]',
					moveLeftToOutput: 'Move leftArr[{leftPos}] to output position {i}',
					moveRightToOutput: 'Move rightArr[{rightPos}] to output position {i}',
					insertRemainingLeft: 'Insert remaining left item at position {leftPos}',
					insertRemainingRight: 'Insert remaining right item at position {i}',
					startMergeSortSegment: 'Start merge_sort on arr[{left}..{right}]',
					divideSegment: 'Divide arr[{left}..{right}] into arr[{left}..{mid}] and arr[{rightStart}..{right}]',
					mergeSortLeftSegment: 'Merge sort arr[{left}..{mid}]',
					mergeSortRightSegment: 'Merge sort arr[{rightStart}..{right}]',
					finishedMergeSortSegment: 'Finished merge_sort on arr[{left}..{right}]',
				},
			},
			quick: {
				basic: {
					compareWithPivot: 'Compare arr[{j}] with pivot',
					moveIntoLeftPartition: 'Move arr[{j}] into left partition',
					placePivot: 'Place pivot at index {pivotIndex}',
				},
				detailed: {
					partitionStart: 'Partition arr[{low}..{high}] with pivot arr[{high}]',
					compareWithPivotAtHigh: 'Compare arr[{j}] with pivot arr[{high}]',
					moveIntoLeftPartitionAtIndex: 'Move arr[{j}] into left partition at index {i}',
					allComparedPlacePivot: 'All elements compared. Place pivot in final position at index {pivotIndex}',
					placePivot: 'Place pivot at index {pivotIndex}',
					partitionDone: 'Partition done for arr[{low}..{high}] with pivot index {pivotIndex}',
					quickSortSegment: 'Quick sort arr[{low}..{high}]',
					singleElementSorted: 'Single-element segment arr[{low}] is sorted',
					recurseLeft: 'Recurse left on arr[{low}..{high}]',
					recurseRight: 'Recurse right on arr[{low}..{high}]',
					finishedQuickSortSegment: 'Finished quick_sort on arr[{low}..{high}]',
				},
			},
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
