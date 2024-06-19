import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { DATASET_2 } from "./mockData";

function D3() {
  const container = React.useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const nodes = DATASET_2.nodes;
  const edges = DATASET_2.edges;
  // Zoom functionality, scroll in & scroll out

  let zoom = d3.zoom().on("zoom", (e) => {
    d3.select("#hybridSVG").select("#g-section").attr("transform", e.transform);
  });

  const initZoom = () => {
    d3.select("#hybridSVG").call(zoom);
  };

  //Drag functionality

  var dragDrop = d3
    .drag()
    .on("start", (e, d) => {
      if (!e.active) simulation.alphaTarget(0.3).restart();
      d.fx = e.x;
      d.fy = e.y;
      // fix all other nodes except the current one
      nodes
        .filter((n) => n.id !== d.id)
        .forEach((n) => {
          n.fx = n.x;
          n.fy = n.y;
          n.fixed = true;
        });
    })
    .on("drag", (e, d) => {
      d.fx = e.x;
      d.fy = e.y;
    })
    .on("end", (e, d) => {
      if (!e.active) simulation.alphaTarget(0);
      d.fx = e.x;
      d.fy = e.y;
      // release all other nodes except the current one
      nodes
        .filter((n) => n.id !== d.id)
        .forEach((n) => {
          n.fx = n.x;
          n.fy = n.y;
          n.fixed = false;
        });
    });

  // function handleImageClick() {
  //   const imageData = d3.select(this).datum();
  //   let filter_link = DATASET_2.edges.filter(
  //     (e) =>
  //       e.source.id === imageData.id ||
  //       (e.target.id === imageData.id && e.source.type !== "parent")
  //   );
  //   nodes.map((e) => {
  //     filter_link.forEach((link) => {
  //       if (e.id === link.target.id) {
  //         e.show = !e.show;
  //       }
  //     });
  //     return e;
  //   });

  //   simulation
  //     .nodes(nodes.filter((e) => e.show))
  //     .force("link", d3.forceLink(DATASET_2.edges));

  //   // Update nodes
  //   nodeElement = nodeElement.data(nodes.filter((e) => e.show));
  //   // nodeElement.enter().append("circle").attr("class", "circle");
  //   // nodeElement.exit().remove();

  //   // Resume the force simulation
  //   // Access the properties of imageData
  // }
  const SVGElement = d3.select("#g-section");

  // draw connection line

  var linkElements = SVGElement.selectAll("path.link")
    .data(DATASET_2.edges)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "transparent")
    .attr("stroke", "#637fbc")
    .attr("stroke-width", "3px");

  // draw nodes
  var nodeElement = SVGElement.selectAll("circle.node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 30)
    .attr("fill", "red")
    .on("click", onClickOfNode);
  // .data(DATASET_2.nodes.filter((e) => e.show))
  // .enter()
  // .append("clipPath")
  // .attr("id", (d) => `circle-clip-${d.id}`)
  // .append("circle")
  // .attr("id", (d) => `circle-${d.id}`)
  // .attr("r", 30);

  // apply images on the circle

  const renderCircleImage = SVGElement.selectAll("image");
  // .data(DATASET_2.nodes.filter((e) => e.show))
  // .enter()
  // .append("image")
  // .attr("xlink:href", "https://picsum.photos/200/300")
  // .attr("width", 100)
  // .attr("height", 100)
  // .call(dragDrop)
  // .attr("clip-path", (d) => `url(#circle-clip-${d.id})`)
  // .on("click", () => {
  //   // d3.select("#g-section").selectAll("circle").remove();
  //   handleImageClick;
  // });

  // Add labels

  const label = SVGElement.selectAll("text")
    .data(DATASET_2.nodes)
    .enter()
    .append("text")
    .text((d) => d.data.name)
    .style("text-anchor", "middle")
    .style("font-weight", "600");

  function onClickOfNode() {
    const imageData = d3.select(this).datum();
    let filter_link = DATASET_2.edges
    // nodes.map((e) => {
    //   filter_link.forEach((link) => {
    //     if (e.id === link.target.id) {
    //       e.show = !e.show;
    //     }
    //   });
    //   return e;
    // });
    console.log(nodes, "text");
    simulation.alpha(1).restart();

    updateSimulation();
  }
  function updateGraph() {
    // Filter out nodes to show only those with 'show' property set to true
    // const visibleNodes = nodes.filter((e) => e.show);

    // Filter out links to show only those with 'show' property set to true
    // const visibleLinks = DATASET_2.edges.filter(
    //   (e) =>
    //     e.show &&
    //     (e.source.show || e.source.type === "parent") &&
    //     (e.target.show || e.target.type === "parent")
    // );

    nodeElement = SVGElement.selectAll("circle.node").data(
      nodes,
      (d) => d.id
    );

    // Remove nodes that should no longer be shown
    nodeElement.exit().remove();

    // Add new nodes
    const nodeEnter = nodeElement
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 30)
      .attr("fill", "red")
      .on("click", onClickOfNode);

    nodeElement = nodeEnter.merge(nodeElement);

    linkElements = SVGElement.selectAll("path.link").data(
      edges,
      (d) => d.id
    );

    // Remove links that should no longer be shown
    linkElements.exit().remove();

    // Add new links
    const linkEnter = linkElements
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "transparent")
      .attr("stroke", "#637fbc")
      .attr("stroke-width", "3px");

    linkElements = linkEnter.merge(linkElements);

    simulation.nodes(nodes);
    simulation.force(
      "link",
      d3
        .forceLink(edges)
        .id((d) => d.id)
        .distance(300)
    );
    simulation.alpha(1).restart();
  }

  // draw curved line , it give path value

  function linkArc(d) {
    var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
    return (
      "M" +
      d.source.x +
      "," +
      d.source.y +
      "A" +
      dr +
      "," +
      dr +
      " 0 0,1 " +
      d.target.x +
      "," +
      d.target.y
    );
  }

  const tickFn = () => {
    // positioning to the node element
    nodeElement.attr("cx", (node) => node.x).attr("cy", (node) => node.y);
    // positioning to the image element
    renderCircleImage
      .attr("x", (node) => {
        return node.x - 50;
      })
      .attr("y", (node) => node.y - 50);

    //create path to the node element
    linkElements.attr("d", linkArc);

    //positioning the label
    label
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y + 40;
      });
  };

  // to apply force layout - auto layout

  var simulation = d3
    .forceSimulation()
    .force("charge", d3.forceManyBody().strength(-0.1)) // repulsion btw the node, -ve repulse +ve attract each other
    .force("center", d3.forceCenter(width / 2, height / 2)) // center
    .force("collide", d3.forceCollide().radius(200));

  function updateSimulation() {
    updateGraph();
    simulation
      .nodes(nodes)
      .force(
        "link",
        d3
          .forceLink(DATASET_2?.edges)
          .id((link) => link.id)
          .distance(300) // distance btw the node & link
      )
      .on("tick", tickFn);
  }

  updateSimulation();
  useEffectOnce(() => {
    initZoom();
  });

  return (
    <div style={{ margin: "50px", background: "#0002" }}>
      <div style={{ width: "100%", height: "80vh", position: "relative" }}>
        <svg
          id="hybridSVG"
          ref={container}
          viewBox="0 0 1500 900"
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
            // background: "red",
          }}
        >
          <g id="g-section"></g>
        </svg>
      </div>
    </div>
  );
}

export default D3;
