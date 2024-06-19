import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { DATASET_2 } from "./mockData";
import "./style.css";
export default function D3_3() {
  const container = React.useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const nodes = DATASET_2.nodes;
  const childNodes = DATASET_2.nodes.filter((e) => e.type !== "parent");
  const edges = DATASET_2.edges;
  // Zoom functionality, scroll in & scroll out

  let zoom = d3.zoom().on("zoom", (e) => {
    d3.select("#hybridSVG").select("#g-section").attr("transform", e.transform);
  });

  const initZoom = () => {
    d3.select("#hybridSVG").call(zoom);
  };

  //Drag functionality

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
  var nodeElement = SVGElement.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 30)
    .attr("fill", "red");
  // .on("click", onClickOfNode);

  var nodeElement2 = nodeElement
    .data(nodes.filter((e) => e.type !== "parent"))
    .enter()
    .append("circle")
    .attr("id", (d) => {
      return d.id + "innerCircle";
    })
    .attr("class", "innerCircle")
    .attr("r", 10)
    .attr("stroke", "black")
    .attr("fill", "white")
    .style("cursor", "pointer")
    .on("click", onClickOfCount);

  var count = nodeElement
    .data(nodes.filter((e) => e.type !== "parent"))
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("dy", 5) // Adjust the vertical position of the text
    .text((d) => d?.data?.children?.length)
    .on("click", onClickOfCount)
    .style("cursor", "pointer")
    .style("font-size", "17px");

  // apply images on the circle
  const label = SVGElement.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text((d) => d.data.name)
    .style("text-anchor", "middle")
    .style("font-weight", "600");

  function onClickOfCount(e, data) {
    console.log('e', e)
    console.log('data', data)
    data?.data?.children.map((e, i) => {
      e.value = 1;
      return e;
    });
    data.show = !data.show;
    if (data.show) {
      SVGElement.selectAll(".d3pack").remove();
      var packLayout = d3.pack().size([200, 300]);
      var rootNode = d3.hierarchy(data?.data);

      rootNode.sum(function (d, i) {
        return d.value;
      });

      packLayout(rootNode);
      SVGElement.selectAll(".d3pack")
        .data(rootNode.descendants())
        .join("circle")
        .attr("class", "d3pack")
        .attr("fill", "#0000005e")
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        })
        .attr("r", function (d) {
          return d.y;
        });
    } else {
      SVGElement.selectAll(".d3pack").remove();
    }
  }

  function onClickOfNode() {
    const imageData = d3.select(this).datum();
    let filter_link = DATASET_2.edges;
    console.log(nodes, "text");
    simulation.alpha(1).restart();

    updateSimulation();
  }

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
    nodeElement2
      .attr("cx", (node) => node.x + 25)
      .attr("cy", (node) => node.y + -15);
    count.attr("x", (node) => node.x + 25).attr("y", (node) => node.y + -15);

    //create path to the node element
    linkElements.attr("d", (d) =>
      d3.line()([
        [d.source.x, d.source.y],
        [d.target.x, d.target.y],
      ])
    );


    //positioning the label
    label
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y + 50;
      });

    // console.log('temp', temp)
  };

  // to apply force layout - auto layout

  var simulation = d3
    .forceSimulation()
    .force("charge", d3.forceManyBody().strength(-0.1)) // repulsion btw the node, -ve repulse +ve attract each other
    .force("center", d3.forceCenter(width / 2, height / 2)) // center
    .force("collide", d3.forceCollide().radius(200));

  function updateSimulation() {
    // updateGraph();
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
          }}
        >
          <g id="g-section"></g>
        </svg>
      </div>
    </div>
  );
}
