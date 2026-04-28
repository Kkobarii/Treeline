[![Deploy to GitHub Pages](https://github.com/Kkobarii/Treeline/actions/workflows/deploy.yml/badge.svg)](https://github.com/Kkobarii/Treeline/actions/workflows/deploy.yml)

# Treeline

Treeline is an interactive learning app for data structures, sorting, and searching algorithms.
It's built with SvelteKit, TypeScript, and Vite, and is localized in English and Czech.

The app focuses on step-by-step visualization rather than static diagrams. You can build structures, run operations, replay sorting steps, compare algorithms across datasets, and inspect the explanation pages that describe each topic in more detail.

This is the project for my Master's thesis (_Interactive Tool for Visualizing Algorithms and Data Structures_), and it's open source under the MIT License. Contributions are welcome!

## Run It Locally

From the project root:

```sh
npm install
npm run dev
```

Then open the local address shown by Vite, usually http://localhost:5173.

Useful scripts:

```sh
npm run build
npm run preview
npm run check
```

## How To Use

### Data Structure Views

Each data structure page has three main control areas:

- **Structure controls**: reset or randomize the structure.
- **Node controls**: enter a value and apply structure-specific actions.
- **Operation controls**: move through the recorded steps of the current operation.

Per structure, the available actions are:

- Binary Search Tree, AVL Tree, Red-Black Tree, and B-Tree: insert a random node or enter a value to insert, remove, or find.
- Heap: insert a random value or enter a value to insert, then extract the root.
- Linked List: insert at head or tail, using either a random value or a manual value, then find or remove a value.
- Stack: push a random or manual value, then pop or peek.
- Queue: enqueue a random or manual value, then dequeue or peek.

### Sorting Algorithm Views

Each sorting algorithm has two views:

- **Big Picture**: a compact bar visualization with playback controls.
- **Detailed**: a step-by-step view with pseudocode highlighting and language selection.

Controls in the sorting views:

- Choose the array profile from the dataset dropdown.
- Shuffle to regenerate the current array.
- Move backward and forward through steps.
- Run or pause playback.
- Adjust playback speed with the slider.
- In the detailed view, switch the code language between Python, JavaScript, and C.

### Comparison View

The comparison page runs the sorting algorithms across multiple dataset profiles.

- Start or stop the full comparison.
- Run a single algorithm row.
- Run a single dataset column.
- On smaller screens, choose the active dataset from the dropdown.
- Watch the comparison and swap counts appear after each run finishes.

### Searching Algorithm View

The searching page reuses the detailed playback layout and adds search-specific inputs.

- Switch between Linear Search and Binary Search.
- Set the target value.
- Shuffle the base array.
- Play, pause, or step through the algorithm.
- Adjust the animation speed.

## Included Content

### Data Structures

- Binary Search Tree
- AVL Tree
- Red-Black Tree
- B-Tree
- Heap
- Linked List
- Stack
- Queue

### Sorting Algorithms

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort

### Searching Algorithms

- Linear Search
- Binary Search

### Dataset Profiles

- Random
- Almost Sorted
- Reverse Sorted
- Duplicates
- Sawtooth
- Pyramid
- Discontinuous

### Code Languages For Detailed Sorting Views

- Python
- JavaScript
- C

## Project Notes

This was a project I worked on for so long and of course this README is the last thing I do. I think it turned out well and I'm happy with the result (and I hope my opponents will be too). If you're reading this, thanks for checking it out! If you have any feedback or suggestions, please let me know. If you find any bugs, make an issue! And if you want to contribute, that would be awesome as well!
