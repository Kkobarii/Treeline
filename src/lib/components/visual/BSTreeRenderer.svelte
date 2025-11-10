<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Network, type Edge, type Node, type Options } from 'vis-network';
	import { DataSet } from 'vis-data';
	import { bsTreetoGraph, getDummyNodeId } from '$lib/utils/graphs';
	import { computeLayoutForTree } from '$lib/visual/utils/layoutHelpers';
	import type { BSTree } from '$lib/structures/bsTree';
	import { NetworkAnimator } from '$lib/visual/networkAnimator';

	// exported for parent to bind:this and call methods on the component instance
	let container: HTMLElement | null = null;

	let nodes: DataSet<Node>;
	let edges: DataSet<Edge>;
	let network: Network;
	let animator: NetworkAnimator | null = null;

	const nodeOptions = {
		shape: 'box',
		color: '#9fd4ff',
		font: { color: 'black', size: 30 },
	};

	const infoNodeOptions = {
		shape: 'ellipse',
		color: '#aaaaaa',
		font: { color: 'black', size: 15 },
		id: 'info-node',
		aboveOffset: 50,
	} as const;

	const infoNodeId = infoNodeOptions.id;

	const dummyNodeOptions = {
		shape: 'ellipse',
		color: 'transparent',
		font: { color: 'transparent', size: 1 },
	};

	const options: Options = {
		layout: {
			hierarchical: {
				direction: 'UD',
				sortMethod: 'directed',
				shakeTowards: 'roots',
				levelSeparation: 100,
			},
		},
		physics: false,
		interaction: { dragNodes: false },
		nodes: nodeOptions,
	};

	// allow parent to pass an OperationManager so the renderer can wire node selection
	export let operationManager: any | undefined;

	onMount(() => {
		({ nodes, edges } = bsTreetoGraph(null));
		network = new Network(container!, { nodes, edges }, options);

		animator = new NetworkAnimator({ network, nodes, edges, infoNodeOptions, nodeOptions });
		animator.createInfoNode();

		// wire node selection to update operationManager if provided
		network.on('selectNode', params => {
			if (params.nodes.length === 1 && operationManager) {
				const node = nodes.get(params.nodes[0]) as Node;
				let label = node.label!;
				operationManager.updateCurrentValue(parseInt(label));
			}
		});
	});

	onDestroy(() => {
		try {
			network?.destroy();
		} catch (e) {
			// ignore
		}
	});

	// Renderer API methods (component instance methods)
	export function ensureTree(tree: BSTree) {
		const newData = bsTreetoGraph(tree.root);

		// update existing nodes or add new ones
		for (const n of newData.nodes.get()) {
			if (nodes.get(n.id!)) {
				nodes.update(n);
			} else {
				nodes.add(n);
				animator?.animateNodeGrowth(n.id!);
			}
		}

		// remove nodes that are no longer present (except info node)
		const newNodeIds = new Set(newData.nodes.get().map(n => n.id));
		for (const existingNode of nodes.get()) {
			if (!newNodeIds.has(existingNode.id) && existingNode.id !== infoNodeId) {
				nodes.remove(existingNode.id!);
			} else if (existingNode.id !== infoNodeId && !existingNode.id.toString().startsWith('dummy-')) {
				// types from vis-network are a bit loose here; coerce to any to update font size
				nodes.update([{ id: existingNode.id!, font: { size: (options.nodes as any).font.size } } as any]);
			}
		}

		// rebuild edges from authoritative graph
		edges.clear();
		for (const e of newData.edges.get()) {
			if (!edges.get(e.id!)) edges.add(e);
		}

		clearDisconnectedDummyNodes();
	}

	export function addNode(nodeId: number, value: number, parentId?: number, direction?: 'left' | 'right') {
		if (nodes.get(nodeId)) return;

		nodes.add({ id: nodeId, title: `Node ${nodeId}`, label: `${value}` });

		if (parentId !== undefined && direction !== undefined) {
			const edgeId = `edge-${parentId}-${direction}`;
			nodes.remove(getDummyNodeId(parentId, direction));
			edges.remove(edgeId);
			edges.add({ id: edgeId, from: parentId, to: nodeId });

			if (direction === 'left') {
				// ensure right dummy exists after reposition
				nodes.remove(getDummyNodeId(parentId, 'right'));
				nodes.add({ id: getDummyNodeId(parentId, 'right'), color: 'transparent' });
			}
		}

		// add transparent dummy children so layout keeps spacing
		if (!nodes.get(getDummyNodeId(nodeId, 'left'))) nodes.add({ id: getDummyNodeId(nodeId, 'left'), color: 'transparent' } as any);
		if (!nodes.get(getDummyNodeId(nodeId, 'right'))) nodes.add({ id: getDummyNodeId(nodeId, 'right'), color: 'transparent' } as any);
		edges.add({ id: `edge-${nodeId}-left`, from: nodeId, to: getDummyNodeId(nodeId, 'left'), dashes: true });
		edges.add({ id: `edge-${nodeId}-right`, from: nodeId, to: getDummyNodeId(nodeId, 'right'), dashes: true });
	}

	export function removeNode(nodeId: number | string, parentId?: number, direction?: 'left' | 'right') {
		const connectedEdges = network.getConnectedEdges(nodeId);
		edges.remove(connectedEdges);
		nodes.remove(nodeId);

		if (typeof nodeId === 'number') {
			if (nodes.get(getDummyNodeId(nodeId, 'left'))) nodes.remove(getDummyNodeId(nodeId, 'left'));
			if (nodes.get(getDummyNodeId(nodeId, 'right'))) nodes.remove(getDummyNodeId(nodeId, 'right'));
		}

		if (parentId === undefined || direction === undefined) return;

		addDummyNode(parentId, direction);
	}

	export function addDummyNode(parentId: number, direction: 'left' | 'right') {
		nodes.add({ id: getDummyNodeId(parentId, direction), color: 'transparent' });
		edges.add({ id: `edge-${parentId}-${direction}`, from: parentId, to: getDummyNodeId(parentId, direction), dashes: true });

		if (direction === 'left') {
			const rightChildEdgeId = `edge-${parentId}-right`;
			const rightChildEdge: any = edges.get(rightChildEdgeId as any);
			if (!rightChildEdge || !(rightChildEdge as any).to) return;

			const node = nodes.get((rightChildEdge as any).to as number) as any;
			if (!node) return;

			nodes.remove(node.id!);
			nodes.add(node);
		}
	}

	export function linkNode(parentId: number, childId: number) {
		let parentNode = nodes.get(parentId);
		if (!parentNode) return;

		let childNode = nodes.get(childId);
		if (!childNode) return;

		const direction = childNode.value! < parentNode.value! ? 'left' : 'right';
		const edgeId = `edge-${parentId}-${direction}`;

		nodes.remove(getDummyNodeId(parentId, direction));
		edges.remove(edgeId);

		edges.add({ id: edgeId, from: parentId, to: childId });
	}

	export function unlinkNode(parentId: number, childId: number) {
		let parentNode = nodes.get(parentId);
		if (!parentNode) return;

		let childNode = nodes.get(childId);
		if (!childNode) return;

		let childEdges = network.getConnectedEdges(childId);

		for (const edgeId of childEdges) {
			const edge = edges.get(edgeId);
			if (edge && edge.from === parentId) {
				// set edge as transparent
				edges.update({ id: edgeId, hidden: true });
				console.log('Unlinked edge', edgeId);
				break;
			}
		}
	}

	export function clearDisconnectedDummyNodes() {
		const toRemove: string[] = [];
		for (const node of nodes.get()) {
			if (typeof node.id === 'string' && node.id.startsWith('dummy-')) {
				const connected = network.getConnectedNodes(node.id);
				if (connected.length === 0) toRemove.push(node.id as string);
			}
		}
		if (toRemove.length) nodes.remove(toRemove);
	}

	export function removeColoring() {
		const updated: Node[] = [];
		for (const node of nodes.get()) {
			if (node.id === infoNodeId || node.id.toString().startsWith('dummy-')) continue;
			updated.push({ id: node.id!, color: options.nodes!.color });
		}
		nodes.update(updated);
	}

	export function animateFit(): Promise<void> {
		return animator ? animator.animateFit() : Promise.resolve();
	}

	export function animateNodeGrowth(nodeId: number | string) {
		return animator?.animateNodeGrowth(nodeId) ?? Promise.resolve();
	}
	export function animateNodeShrink(nodeId: number | string) {
		return animator?.animateNodeShrink(nodeId) ?? Promise.resolve();
	}

	export function animateNodeOpacityChange(nodeId: number | string, from: number, to: number) {
		return animator?.animateNodeOpacityChange(nodeId, from, to) ?? Promise.resolve();
	}

	export function animateLegsGrowth(nodeId: number | string) {
		return animator?.animateLegsGrowth(nodeId) ?? Promise.resolve();
	}
	export function animateLegsShrink(nodeId: number | string) {
		return animator?.animateLegsShrink(nodeId) ?? Promise.resolve();
	}

	export function setNodeColor(nodeId: number | string, color: string) {
		animator?.setNodeColor(nodeId, color);
	}

	export function resetNodeColor(nodeId: number | string) {
		animator?.resetNodeColor(nodeId);
	}

	export function animateAnnotateNode(text: string, nodeId: number | string) {
		return animator?.animateAnnotateNode(text, nodeId) ?? Promise.resolve();
	}

	export function changeInfoNodeAnnotation(text: string) {
		return animator?.changeInfoNodeAnnotation(text) ?? Promise.resolve();
	}

	export function hideInfoNode() {
		animator?.hideInfoNode();
	}

	export function snapNodeAbove(nodeId: number | string, parentId: number) {
		animator?.snapNodeAbove(nodeId, parentId);
	}

	export function snapNodeTo(nodeId: number | string, x: number, y: number) {
		animator?.snapNodeTo(nodeId, x, y);
	}

	export function getPositionAbove(nodeId: number | string) {
		const pos = network.getPosition(nodeId as any);
		return { x: pos.x, y: pos.y - (infoNodeOptions.aboveOffset ?? 50) };
	}

	export function getPosition(nodeId: number | string) {
		return network.getPosition(nodeId as any);
	}

	export function animateNodeMovement(nodeId: number | string, from: any, to: any) {
		return animator?.animateNodeMovement(nodeId, from, to) ?? Promise.resolve();
	}
</script>

<div
	bind:this={container}
	class="h-full w-full rounded border border-gray-300">
</div>
