import * as d3 from "d3";
import React, { useEffect } from "react";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { DATASET_2 } from "./mockData";
import "./style.css";
import { Generategraph, calcTranslationExact } from "./helpers";
import collapse from "../images/collapse.png";
export default function D3_9() {
  const container = React.useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const nodes = DATASET_2.nodes;
  // Zoom functionality, scroll in & scroll out

  let zoom = d3.zoom().on("zoom", (e) => {
    d3.select("#hybridSVG").select("#g-section").attr("transform", e.transform);
  });

  const initZoom = () => {
    d3.select("#hybridSVG").call(zoom);
  };

  let graph = Generategraph(onClickOfCount, DATASET_2);

  function onClickOfCollapse(e, data) {
    //remove the packed node
    graph.SVGElement.selectAll(".outerCircle").remove();
    graph.SVGElement.selectAll(".child").remove();
    graph.SVGElement.selectAll(".path").remove();
    graph.SVGElement.selectAll(".collapse").remove();
    graph.SVGElement.selectAll(".childLabel").remove();
    graph.SVGElement.selectAll(".expand").remove();
    //display the exiting node
    graph.SVGElement.select(`#${data.data.name}-circle`).style(
      "display",
      "block"
    );
    graph.SVGElement.select(`#${data.data.name}-innerCircle`).style(
      "display",
      "block"
    );
    graph.SVGElement.select(`#${data.data.name}-count`).style(
      "display",
      "block"
    );
  }

  function onClickOfCount(e, data) {
    // remove the clicked node and display the other nodes
    graph.SVGElement.selectAll(".outerCircle").remove();
    graph.SVGElement.selectAll(".child").remove();
    graph.SVGElement.selectAll(".path").remove();
    graph.SVGElement.selectAll(".collapse").remove();
    graph.SVGElement.selectAll(".childLabel").remove();
    graph.SVGElement.selectAll(".expand").remove();

    nodes.forEach((node) => {
      if (node.id === data.id) {
        graph.SVGElement.select(`#${node.data.name}-circle`).style(
          "display",
          "none"
        );
        graph.SVGElement.select(`#${node.data.name}-innerCircle`).style(
          "display",
          "none"
        );
        graph.SVGElement.select(`#${node.data.name}-count`).style(
          "display",
          "none"
        );
      } else {
        graph.SVGElement.select(`#${node.data.name}-circle`).style(
          "display",
          "block"
        );
        graph.SVGElement.select(`#${node.data.name}-innerCircle`).style(
          "display",
          "block"
        );
        graph.SVGElement.select(`#${node.data.name}-count`).style(
          "display",
          "block"
        );
      }
    });

    var packLayout = d3.pack().size([300, 300]).padding(50);
    var rootNode = d3.hierarchy(data?.data).sum(function (d) {
      return d.value || 1;
    });

    packLayout(rootNode);

    //changing the x and y of pack content at the position of clicked Node
    rootNode.x = data.x;
    rootNode.y = data.y;

    rootNode.children.forEach((d) => {
      d.x = d.x + d.parent.x - d.parent.r;
      d.y = d.y + d.parent.y - d.parent.r;
    });

    graph.SVGElement.selectAll("outerCircle")
      .data(rootNode.ancestors())
      .enter()
      .append("circle")
      .attr("class", "outerCircle")
      .attr("fill", (d) => (d.depth ? "#a54646" : "#ff8181"))
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r);

    const edges = data?.edges?.map((link) => {
      const sourceNode = rootNode
        .descendants()
        .find((node) => node.data.name === link.source);
      const targetNode = rootNode
        .descendants()
        .find((node) => node.data.name === link.target);
      return {
        sourceX: sourceNode.x,
        sourceY: sourceNode.y,
        targetX: targetNode.x,
        targetY: targetNode.y,
      };
    });

    const childXY = rootNode.descendants().filter((e) => e.depth === 1);
    const parentXY = nodes.filter((e) => e.type === "parent");
    const createpaths = childXY.map((e) => {
      return {
        targetX: parentXY[0].x,
        targetY: parentXY[0].y,
        sourceX: e.x,
        sourceY: e.y,
      };
    });

    // path generation
    var lineGenerator = d3.line();
    graph.SVGElement.selectAll(".path")
      .data(edges || [])
      .enter()
      .append("path")
      .attr("class", "path")
      .attr("d", function (d) {
        // Generate the path coordinates using line generator
        return lineGenerator([
          [d.sourceX, d.sourceY],
          [d.targetX, d.targetY],
        ]);
      })
      .attr("stroke", "black")
      .style("cursor", "pointer")
      .style("stroke-width", "4px")
      .style("stroke-dasharray", "4 2")
      .attr("fill", "none");
    //pack children

    graph.SVGElement.selectAll(".child")
      .data(rootNode.descendants().slice(1))
      .enter()
      .append("circle")
      .attr("class", "child")
      .attr("fill", "#a54646")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r);

    graph.SVGElement.selectAll(".childLabel")
      .data(rootNode.descendants().slice(1))
      .enter()
      .append("text")
      .attr("class", "childLabel")
      .text((d) => d.data.name)
      .style("text-anchor", "middle")
      .style("font-weight", "600")
      .style("font-size", "20px")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + d.r + 20);

    // collapse button
    graph.SVGElement.selectAll(".collapse")
      .data(rootNode.ancestors())
      .enter()
      .append("circle")
      .attr("class", "collapse")
      .attr("r", 15)
      .attr("stroke", "black")
      .attr("fill", "white")
      .style("cursor", "pointer")
      .attr("cx", (d) => d.x + d.r)
      .attr("cy", (d) => d.y)
      .on("click", onClickOfCollapse);

    graph.SVGElement.selectAll("collapse")
      .data(rootNode.ancestors())
      .enter()
      .append("image")
      .attr("class", "expand")
      .attr("width", 25)
      .attr("height", 25)
      .attr("xlink:href", collapse)
      .attr("x", (d) => d.x + d.r - 11)
      .attr("y", (d) => d.y - 12)
      .style("cursor", "pointer")
      .on("click", onClickOfCollapse);

    graph.parentNode.raise();
  }

  const tickFn = () => {
    // positioning to the node element
    graph.parentNode.attr("cx", (node) => node.x).attr("cy", (node) => node.y);
    graph.parentImageElement
      .attr("x", (d) => d.x - 24.5)
      .attr("y", (d) => d.y - 26.5);
    graph.childNode
      .attr("cx", (node) => node.x + 25)
      .attr("cy", (node) => node.y + -15);
    graph.childNodeCount
      .attr("x", (node) => node.x + 25)
      .attr("y", (node) => node.y + -15);

    //create path to the node element
    graph.SVGElement.selectAll(".link").attr("d", (d) => {
      return (
        "M" +
        d.source.x +
        "," +
        d.source.y +
        "L" +
        d.target.x +
        "," +
        d.target.y
      );
    });

    //positioning the label
    graph.label
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y + 50;
      });
  };

  // to apply force layout - auto layout

  var simulation = d3
    .forceSimulation()
    .force("charge", d3.forceManyBody().strength(-100)) // repulsion btw the node, -ve repulse +ve attract each other
    .force("center", d3.forceCenter(width / 2, height / 2)) // center
    .force(
      "collide",
      d3
        .forceCollide()
        .strength(10)
        .radius((d) => d.value + 100)
        .iterations(1)
    );

  function updateSimulation() {
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
  useEffect(() => {
    graph.SVGElement.selectAll("g.link-group").remove();
    graph.SVGElement.selectAll(".Allcircle").remove();
    graph.SVGElement.selectAll(".imageElement").remove();
    graph.SVGElement.selectAll(".innerCircle").remove().exit();
    graph.SVGElement.selectAll(".innerCircleCount").remove();
  }, []);

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
          }}
        >
          <g id="g-section"></g>
        </svg>
      </div>
    </div>
  );
}
