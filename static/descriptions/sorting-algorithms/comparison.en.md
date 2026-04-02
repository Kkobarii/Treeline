# Sorting Algorithm Comparison

This view presents a comparative matrix of sorting algorithms evaluated across multiple input distributions. It is designed to illustrate several fundamental observations about sorting behaviour.

## Purpose

The matrix allows direct visual comparison of how different algorithms respond to the same inputs. Each row represents one algorithm; each column represents one class of input data. By running all simulations simultaneously, the viewer can observe relative performance and termination order.

The following points are demonstrated:

- **No universally optimal algorithm exists.** Each algorithm exhibits strengths and weaknesses depending on the structure of the input.
- **Asymptotic complexity is not the sole criterion.** An algorithm with worse worst-case complexity may outperform a theoretically superior one on particular inputs.
- **Input distribution is as consequential as algorithm selection.** Nearly sorted, reversed, and duplicate-heavy inputs can shift relative performance rankings substantially.
- **Stability matters.** Algorithms that preserve the relative order of equal elements (stable algorithms) are preferable in applications where secondary sort keys must be maintained.

## Properties of an Ideal Sorting Algorithm

An ideal in-place comparison sort would satisfy all of the following:

1. **Stable**: equal keys retain their original relative order.
2. **In-place**: requires only O(1) auxiliary memory.
3. **Optimal comparisons**: performs O(n log n) key comparisons in the worst case.
4. **Minimal data movement**: executes O(n) swaps or assignments in the worst case.
5. **Adaptive**: achieves O(n) time on nearly sorted or low-entropy input.

No known algorithm satisfies all five properties simultaneously. The choice of sorting algorithm is therefore always a trade-off dictated by the constraints of the application.

## Input Data Sets

The comparison uses six representative input distributions:

- **Random**: uniformly shuffled elements.
- **Almost Sorted**: a sorted sequence with a small number of adjacent transpositions.
- **Reverse Sorted**: elements in descending order, representing a common worst case.
- **Duplicates**: a small number of distinct values repeated throughout the array.
- **Sawtooth**: a repeating ascending pattern, producing periodic local order.
- **Pyramid**: values ascending to a central peak then descending, creating a symmetric structure.
