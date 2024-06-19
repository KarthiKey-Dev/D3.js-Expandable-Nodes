import * as d3 from "d3";
import React, { useEffect } from "react";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { DATASET_3 } from "./mockData";
import "./style.css";
import { Generategraph, calcTranslationExact } from "./helpers";
import collapse from '../images/collapse.png'
import pod from "../images/podSvg.svg";
import IP from "../images/ip.svg";
import SVC from "../images/svc.svg";

export default function D3_10() {
  const container = React.useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const nodes = DATASET_3.nodes;
  // Zoom functionality, scroll in & scroll out
 useEffect(() => {
    const SVGElement = d3.select("#g-section");
    SVGElement.selectAll("*").remove();
  }, []);
  let zoom = d3.zoom().on("zoom", (e) => {
    d3.select("#hybridSVG").select("#g-section").attr("transform", e.transform);
  });

  const initZoom = () => {
    d3.select("#hybridSVG").call(zoom);
  };

  let graph = Generategraph(onClickOfCount, DATASET_3);

  function onClickOfCollapse(e, data) {
    graph.SVGElement.selectAll(".outerCircle").remove();
    graph.SVGElement.selectAll(".child").remove();
    graph.SVGElement.selectAll(".path").remove();
    graph.SVGElement.selectAll(".collapse").remove();
    graph.SVGElement.selectAll(".collapseCircle").remove();
    graph.SVGElement.selectAll(".childLabel").remove();
    graph.SVGElement.selectAll(".expand").remove();
    graph.SVGElement.selectAll(".childImageElement").remove();
    graph.SVGElement.select(`#${data.data.name}-circle`).style("display", "block");
    graph.SVGElement.select(`#${data.data.name}-innerCircle`).style("display", "block");
    graph.SVGElement.select(`#${data.data.name}-count`).style("display", "block");
  }

  function onClickOfCount(event, data) {
    console.log('data', data)
    // remove the clicked node and display the other nodes
   
    graph.SVGElement.selectAll(".outerCircle").remove();
    graph.SVGElement.selectAll(".child").remove();
    graph.SVGElement.selectAll(".path").remove();
    graph.SVGElement.selectAll(".collapse").remove();
    graph.SVGElement.selectAll(".childLabel").remove();
    graph.SVGElement.selectAll(".expand").remove();
    graph.SVGElement.selectAll(".childImageElement").remove();
    graph.SVGElement.selectAll(".collapseCircle").remove();
    let final= {}
    if (data.data.children.length > 3)
    {
      const temp = data.data.children
      console.log('temp', temp)
      const length = data.data.children.length
      const initialNodes = temp.slice(0, 3)
      console.log('initialNodes', initialNodes)
      final = { name : data.data.name,children: [...initialNodes, { name: "", type: "number", length: length - 3 }] }
      console.log('final', final)
      }
    nodes.forEach(node => {
      if (node.id === data.id) {
        graph.SVGElement.select(`#${node.data.name}-circle`).style("display", "none");
        graph.SVGElement.select(`#${node.data.name}-innerCircle`).style("display", "none");
        graph.SVGElement.select(`#${node.data.name}-count`).style("display", "none");
      } else {
        graph.SVGElement.select(`#${node.data.name}-circle`).style("display", "block");
        graph.SVGElement.select(`#${node.data.name}-innerCircle`).style("display", "block");
        graph.SVGElement.select(`#${node.data.name}-count`).style("display", "block");
      }
    });
    const dia = data.data.children.length * 10;
    const packLayout = d3
      .pack()
      .size([300 + dia, dia + 300])
      .padding(50);
    
    // const rootNode = d3.hierarchy(data?.data).sum(d => {
    //   console.log('d-sum', d)
    //   return d.value || 1;
    // });
    
    const rootNode = d3.hierarchy(final).sum(d => {
      return d.value || 1;
    });

    packLayout(rootNode);
    console.log('rootNode', rootNode)

    rootNode.x = data.x;
    rootNode.y = data.y;

    rootNode.children.forEach(d => {
      d.x = d.x + d.parent.x - d.parent.r;
      d.y = d.y + d.parent.y - d.parent.r;
    });

    graph.SVGElement.selectAll("outerCircle")
      .data(rootNode.ancestors())
      .enter()
      .append("circle")
      .attr("class", "outerCircle")
      .style("stroke-width", "4px")
      .attr("stroke", "#3065C6")
      .style("stroke-dasharray", "4, 2")
      .attr("fill", "#E0E8FF")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.r);

    const childXY = rootNode.descendants().filter(d => d.depth === 1);
    const parentXY = nodes?.filter(t => t.type === "parent");
    const createpaths = childXY.map(p => {
      return {
        targetX: parentXY[0].x,
        targetY: parentXY[0].y,
        sourceX: p.x,
        sourceY: p.y
      };
    });

    // path generation
    const lineGenerator = d3.line();
    graph.SVGElement.selectAll(".path")
      .data(createpaths || [])
      .enter()
      .append("path")
      .attr("class", "path")
      .attr("d", d => {
        // Generate the path coordinates using line generator
        return lineGenerator([
          [d.sourceX, d.sourceY],
          [d.targetX, d.targetY]
        ]);
      })
      .attr("stroke", "#637fbc")
      .style("stroke-dasharray", "4, 2")
      .attr("stroke-width", "1px")
      .attr("fill", "transparent");
    
    const circlePackChildElement = graph.SVGElement.selectAll(".child")
      .data(rootNode.descendants().slice(1))
      .enter()
      .append("g")
      .attr("class", "child");

    circlePackChildElement
      .append("circle")
      .attr("id", d => `packChild-${d.data.name}`)
      .attr("fill", "#ffffff")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => {
        if (d.r > 80) {
          // eslint-disable-next-line no-param-reassign
          d.r = 60;
        }
        return d.r;
      });

    
    circlePackChildElement
      .append("image")
      .attr("x", d => d.x - d.r * 0.75) // Adjust the x position as per your requirement
      .attr("y", d => d.y - d.r * 0.75) // Adjust the y position as per your requirement
      .attr("width", d => d.r * 1.5)
      .attr("height", d => d.r * 1.5)
      .on("mouseenter", (e, d) => {
        d3.select(`#packChild-${d.data.name}`)
          .transition()
          .duration(200)
          .ease(d3.easeQuadOut)
          .attr("fill", "#bfd4ff")
      })
      .on("mouseleave", (e, d) => {
        d3.select(`#packChild-${d.data.name}`)
          .transition()
          .duration(200)
          .ease(d3.easeQuadOut)
          .attr("fill", "#fff");
      })
      .attr("xlink:href", d => {
        console.log('d', d)
        switch (d.data.type) {
          case "pod":
            return pod;
          case "SVC":
            return SVC;
          case "IP":
            return IP;
          default:
          // code block
        }
      });

    graph.SVGElement.selectAll(".childLabel")
      .data(rootNode.descendants().slice(1))
      .enter()
      .append("text")
      .attr("class", "childLabel")
      .text(d => d.data.name)
      .style("text-anchor", "middle")
      .style("font-weight", "600")
      .style("font-size", "20px")
      .attr("x", d => d.x)
      .attr("y", d => d.y + d.r + 20);

    // collapse button
    graph.SVGElement.selectAll(".collapse")
      .data(rootNode.ancestors())
      .enter()
      .append("circle")
      .attr("class", "collapseCircle")
      .attr("r", 15)
      .attr("stroke", "black")
      .attr("fill", "white")
      .style("cursor", "pointer")
      .attr("cx", d => d.x + d.r)
      .attr("cy", d => d.y)
      // eslint-disable-next-line no-use-before-define
      .on("click", onClickOfCollapse);

    graph.SVGElement.selectAll("collapse")
      .data(rootNode.ancestors())
      .enter()
      .append("image")
      .attr("class", "expand")
      .attr("width", 25)
      .attr("height", 25)
      .attr("xlink:href", collapse)
      .attr("x", d => d.x + d.r - 11)
      .attr("y", d => d.y - 12)
      .style("cursor", "pointer")
      // eslint-disable-next-line no-use-before-define
      .on("click", onClickOfCollapse);

    graph.SVGElement.select("#parent-circle").raise();

    graph.SVGElement.select("#workload-image").raise();
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

     graph.SVGElement.selectAll("path.link").attr("d", d => {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const qx = dy * d.linknum * 0.2; // linknum is defined above
      const qy = -dx * d.linknum * 0.2;
      const qx1 = d.source.x + dx / 2 + qx;
      const qy1 = d.source.y + dy / 2 + qy;
      if (d.linknum > 1) {
        return `M${d.source.x} ${d.source.y} C${d.source.x} ${d.source.y} ${qx1} ${qy1} ${d.target.x} ${d.target.y}`;
      }
      return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
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
 
    const force = d3
    .forceSimulation(DATASET_3.nodes)
    .force("charge", d3.forceManyBody().strength(-400)) // repulsion btw the node, -ve repulse +ve attract each other
  .force("center", d3.forceCenter(width / 2, height / 2)) // center
  .force("collide", d3.forceCollide().strength(10).radius( (d) => d.value + 100 ).iterations(1))
    .force(
      "link",
      d3
        .forceLink(DATASET_3.edges)
        .id((link) => link.id)
        .distance(300) // distance btw the node & link
    )
      .on("tick", tickFn)
 
  useEffectOnce(() => {
    initZoom();
  });

  // updateSimulation().restart()
  // useEffect(() => {
  //   let timer1 = setTimeout(() => {
  //    force.initialize(DATASET_3.nodes)
  //   }, 5000);
  //   return () => {
  //     clearInterval(timer1);
  //   };
  // },[])
  // initZoom();
  // useEffect(() => {
  // },[])
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
