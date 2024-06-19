import * as d3 from "d3";
import React from "react";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { DATASET_2 } from "./mockData";
import "./style.css";


export default function D3_6() {
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
    .attr("id", (d) => `${d.data.name}-circle`)
    .attr("r", 30)
    .attr("fill", "red")
  // .on("click", onClickOfNode);

  var nodeElement2 = nodeElement
    .data(nodes.filter((e) => e.type !== "parent"))
    .enter()
    .append("circle")
    .attr("id", (d) => `${d.data.name}-innerCircle`)
    .attr("class", "innerCircle")
    .attr("r", 13)
    .attr("stroke", "black")
    .attr("fill", "white")
    .style("cursor", "pointer")
    .on("click", onClickOfCount);

  var count = nodeElement
    .data(nodes.filter((e) => e.type !== "parent"))
    .enter()
    .append("text")
    .attr("id", (d) => `${d.data.name}-count`)
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

  function onClickOfCollapse(e, data) {
    //remove the packed node
    SVGElement.selectAll(".outerCircle").remove();
    SVGElement.selectAll(".child").remove();
    SVGElement.selectAll(".path").remove();
    SVGElement.selectAll(".collapse").remove();
    SVGElement.selectAll(".childLabel").remove();
    SVGElement.selectAll(".expand").remove();
    //display the exiting node
    SVGElement.select(`#${data.data.name}-circle`).style("display", "block");
    SVGElement.select(`#${data.data.name}-innerCircle`).style(
      "display",
      "block"
    );
    SVGElement.select(`#${data.data.name}-count`).style("display", "block");
  }

  function onClickOfCount(e, data) {
    // remove the clicked node and display the other nodes
    nodes.forEach((node) => {
      if (node.id === data.id) {
        SVGElement.select(`#${node.data.name}-circle`).style("display", "none");
        SVGElement.select(`#${node.data.name}-innerCircle`).style(
          "display",
          "none"
        );
        SVGElement.select(`#${node.data.name}-count`).style("display", "none");
      } else {
        SVGElement.select(`#${node.data.name}-circle`).style(
          "display",
          "block"
        );
        SVGElement.select(`#${node.data.name}-innerCircle`).style(
          "display",
          "block"
        );
        SVGElement.select(`#${node.data.name}-count`).style("display", "block");
      }
    });

    // remove the existing created
    SVGElement.selectAll(".outerCircle").remove();
    SVGElement.selectAll(".child").remove();
    SVGElement.selectAll(".path").remove();
    SVGElement.selectAll(".collapse").remove();
    SVGElement.selectAll(".childLabel").remove();
    SVGElement.selectAll(".expand").remove();

    var packLayout = d3.pack().size([500, 500]).padding(50);
    var rootNode = d3.hierarchy(data?.data).sum(function (d) {
      return d.value || 1;
    });

    packLayout(rootNode);
    console.log('rootNode', rootNode)
    console.log('rootNode-descendants', rootNode.descendants())

    //changing the x and y of pack content at the position of clicked Node
    rootNode.x = data.x;
    rootNode.y = data.y;

    rootNode.children.forEach((d) => {
      d.x = d.x + d.parent.x - d.parent.r;
      d.y = d.y + d.parent.y - d.parent.r;
    });

    SVGElement.selectAll("outerCircle")
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
    const childXY = rootNode.descendants().filter((e)=>e.depth === 1)
    const parentXY = nodes.filter((e)=>e.type === 'parent')
    const createpaths = childXY.map((e) => {
      return {
        targetX : parentXY[0].x,
        targetY : parentXY[0].y,
        sourceX : e.x,
        sourceY : e.y
      }
      
    })
    console.log('createpaths', createpaths)

    // path generation
    var lineGenerator = d3.line();
    SVGElement.selectAll(".path")
      .data(createpaths || [])
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
      .attr("fill", "none")
    //pack children

    SVGElement.selectAll(".child")
      .data(rootNode.descendants().slice(1))
      .enter()
      .append("circle")
      .attr("class", "child")
      .attr("fill", "#a54646")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r);

    SVGElement.selectAll(".childLabel")
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
    SVGElement.selectAll(".collapse")
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

    SVGElement.selectAll("collapse")
      .data(rootNode.ancestors())
      .enter()
      .append("image")
      .attr("class", "expand")
      .attr("width", 16)
      .attr("height", 16)
      .attr("xlink:href", "/src/images/expand.svg")
      .attr("x", (d) => d.x + d.r - 8)
      .attr("y", (d) => d.y - 8)
      .style("cursor", "pointer")
      .on("click", onClickOfCollapse);

    SVGElement.selectAll('circle')
      .data(nodes.filter((e) => e.type === 'parent'))
    .raise()
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
