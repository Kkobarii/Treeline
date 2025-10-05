<script lang="ts">
// @ts-nocheck

  import { onMount } from "svelte";
  import { Network } from "vis-network/standalone";
  import { BinaryTree } from "$lib/structures/binaryTree";
  import { treeToGraph } from "$lib/utils/trees";
  import { clampInput, enforceMinMax } from "$lib/utils/utils";
  import { OperationManager } from "$lib/animation/operationManager";

  let container;
  let tree = new BinaryTree<number>();
  let network = null;
  let manualValue: number = 0;
  let {nodes, edges} = treeToGraph(tree.root);
  let operationManager = new OperationManager(network);

  onMount(() => {
    network = new Network(container, { nodes, edges }, {
      layout: {
        hierarchical: {
          direction: "UD",  // top to bottom
          sortMethod: "directed",
          shakeTowards: "roots",
          levelSeparation: 100
        }
      },
      physics: true,
      nodes: {
        shape: "box",
        color: "#9fd4ff",
        font: { color: "black", size: 30 },
      },
    });

    network.on("selectNode", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        let node = undefined;
        for (let n of nodes) {
          if (n.id === nodeId) {
            node = n;
            break;
          }
        }
        console.log("Selected node:", node);
        manualValue = node ? node.label : 0;
      }
    });

    operationManager = new OperationManager(network);
  });
  
  function resetTree() {
    tree = new BinaryTree<number>();
    let graph = treeToGraph(tree.root);
    nodes = graph.nodes;
    edges = graph.edges;
    network.setData({ nodes, edges });
    operationManager = new OperationManager(network);
  }

  function doOperation(op, value: number) {
    let data;
    switch (op) {
      case "insert":
        data = tree.insert(value);
        break;
      case "remove":
        data = tree.remove(value);
        break;
      case "find":
        data = tree.find(value);
        break;
      default:
        console.error("Unknown operation:", op);
    }
    console.log(data);
    operationManager.newOperation(data);
  }
</script>

<h1 class="text-2xl font-bold mb-4">Binary Tree Prototype</h1>
<div class ="mb-4 display: flex">

  <div bind:this={container} style="width: 1200px; height: 600px; border: 1px solid lightgray;" on:selectNode={(obj) => {console.log(obj)}} ></div>

  <div class="ml-4 mr-4 p-4 bg-gray-100 rounded w-100">
    <div>
      <h2 class="text-xl font-semibold mb-2">Tree Controls</h2>
      <div>
        <button class="px-4 py-2 rounded bg-gray-500 text-white" on:click={() => doOperation("insert", Math.floor(Math.random() * 1000))}>
          Insert Random Node
        </button>
        <button class="px-4 py-2 rounded bg-gray-500 text-white ml-2" on:click={resetTree}>
          Reset Tree
        </button>
      </div>

      <div class="mt-4">
        <input type="number" class="border p-2 rounded w-15"
          bind:value={manualValue} max="999" min="0" on:keyup={(e) => enforceMinMax(e.target)} />
        <button class="px-4 py-2 rounded bg-gray-500 text-white ml-2" on:click={() => doOperation("insert", manualValue)}>
          Insert
        </button>
        <button class="px-4 py-2 rounded bg-gray-500 text-white ml-2" on:click={() => doOperation("remove", manualValue)}>
          Remove
        </button>
        <button class="px-4 py-2 rounded bg-gray-500 text-white ml-2" on:click={() => doOperation("find", manualValue)}>
          Find
        </button>
      </div>
    </div>

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Operation Controls</h2>
      <div>
        <button class="px-4 py-2 rounded bg-gray-500 text-white" on:click={() => operationManager.undo()}>
          Undo
        </button>
        <button class="px-4 py-2 rounded bg-gray-500 text-white ml-2" on:click={() => operationManager.redo()}>
          Redo
        </button>
        <button class="px-4 py-2 rounded bg-gray-500 text-white ml-2" on:click={() => operationManager.undo()}>
          Undo Operation
        </button>
      </div>
    </div>

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Operation Info</h2>
      <div>
        <p>Current Operation: {operationManager.getCurrentOperation()?.operation}</p>
        <p>Operation History:</p>
        <ul>
          {#each operationManager.getOperationHistory() as op}
            <li>{op.operation}</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>
