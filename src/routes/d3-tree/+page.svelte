<script>
// @ts-nocheck

  import * as d3 from "d3";
  import { onMount } from "svelte";
  import { treeData } from "$lib/treeData";

  let container;

  onMount(() => {
    const width = 600;
    const height = 400;

    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([width, height]);
    treeLayout(root);

    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Links
    svg.selectAll("line")
      .data(root.links())
      .enter()
      .append("line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "black");

    // Nodes
    svg.selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 20)
      .attr("fill", "lightblue");

    svg.selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y + 5)
      .attr("text-anchor", "middle")
      .text(d => d.data.name);
  });
</script>

<div bind:this={container}></div>
