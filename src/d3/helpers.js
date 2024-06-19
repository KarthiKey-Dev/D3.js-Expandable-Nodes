import * as d3 from "d3";
import pod from "../images/podSvg.svg";

export const Generategraph = (onClickOfCount, Data) => {
  const SVGElement = d3.select("#g-section");


  const linkElements = SVGElement.selectAll("g.link-group")
    .data(Data.edges)
    .enter()
    .append("g")
    .attr("class", "link-group");

  linkElements
    .append("path")
    .attr("class", "link")
    .attr("id", (d, i) => "path-" + i)
    .attr("fill", "transparent")
    .attr("stroke", "#637fbc")
    .attr("stroke-width", "3px")
    .attr("d", "M50,50 L200,200 L350,50")
    .style("marker-start", "url(#start-marker)")
    .style("marker-end", "url(#end-marker)");


  const parentNode = SVGElement.selectAll("circle")
    .data(Data.nodes)
    .enter()
    .append("circle")
    .attr("class", "Allcircle")
    .attr("id", (d) => `${d.data.name}-circle`)
    .attr("r", 30)
    .attr("fill", "#ffffff75");

  const parentImageElement = SVGElement.selectAll(".imageElement")
    .data(Data.nodes)
    .enter()
    .append("image")
    .attr("class", "imageElement")
    .attr("id", (d) => `${d.data.name}-image`)
    .attr("width", 50)
    .attr("height", 50)
    .attr("xlink:href", pod);

  const childNode = parentNode
    .data(Data.nodes.filter((e) => e.type !== "parent"))
    .enter()
    .append("circle")
    .attr("id", (d) => `${d.data.name}-innerCircle`)
    .attr("class", "innerCircle")
    .attr("r", 13)
    .attr("stroke", "black")
    .attr("fill", "white")
    .style("cursor", "pointer")
    .on("click", onClickOfCount);

  const childNodeCount = parentNode
    .data(Data.nodes.filter((e) => e.type !== "parent"))
    .enter()
    .append("text")
    .attr("id", (d) => `${d.data.name}-count`)
    .attr("class", "innerCircleCount")
    .attr("text-anchor", "middle")
    .attr("dy", 5)
    .text((d) => d?.data?.children?.length)
    .on("click", onClickOfCount)
    .style("cursor", "pointer")
    .style("font-size", "17px")
    .style("fill", "#326CE5");

  const label = SVGElement.selectAll("text")
    .data(Data.nodes)
    .enter()
    .append("text")
    .attr("class", "labels")
    .text((d) => d.data.name)
    .style("text-anchor", "middle")
    .style("font-weight", "600");

  return {
    SVGElement,
    parentNode,
    parentImageElement,
    childNode,
    childNodeCount,
    label,
    onClickOfCount,
  };
};

export const Generategraph2 = (onClickOfCount, Data) => {
  const SVGElement = d3.select("#g-section");

  // SVGElement.append("svg:defs")
  //   .append("svg:marker")
  //   .attr("id", "end-marker")
  //   .attr("viewBox", "0 -5 10 10") // Adjust the viewBox based on the marker's shape
  //   .attr("refX", 50) // Adjust the refX value to position the marker correctly
  //   .attr("refY", 0)
  //   .attr("markerWidth", 6)
  //   .attr("markerHeight", 6)
  //   .attr("orient", "auto")
  //   .append("svg:path")
  //   .attr("d", "M0,-5L10,0L0,5") // Adjust the path data to customize the marker shape
  //   .attr("fill", "green");

  // SVGElement.append("svg:defs")
  //   .append("svg:marker")
  //   .attr("id", "start-marker")
  //   .attr("viewBox", "0 -5 10 10") // Adjust the viewBox based on the marker's shape
  //   .attr("refX", 50) // Adjust the refX value to position the marker correctly
  //   .attr("refY", 0)
  //   .attr("markerWidth", 6)
  //   .attr("markerHeight", 6)
  //   .attr("orient", "auto-start-reverse")
  //   .append("svg:path")
  //   .attr("d", "M0,-5L10,0L0,5") // Adjust the path data to customize the marker shape
  //   .attr("fill", "green");

  // SVGElement.append("defs")
  //   .append("marker")
  //   .attr("id", "end-marker")
  //   .attr("markerWidth", 10)
  //   .attr("markerHeight", 10)
  //   .attr("refX", 10)
  //   .attr("refY", 5)
  //   .append("rect")
  //   .attr("width", 10)
  //   .attr("height", 10)
  //   .style("fill", "red");
  // // SVGElement.append("path")
  // // .attr("d", "M50,50 L200,200") // Adjust the path data based on your requirements
  // // .attr("stroke", "black")
  // // .attr("stroke-width", "2px")
  // // .attr("marker-end", "url(#end-marker)");

  const linkElements = SVGElement.selectAll("g.link-group")
    .data(Data.edges)
    .enter()
    .append("g")
    .attr("class", "link-group");

  linkElements
    .append("path")
    .attr("class", "link")
    .attr("id", (d, i) => "path-" + i)
    .attr("fill", "transparent")
    .attr("stroke", "#637fbc")
    .attr("stroke-width", "3px")
    .attr("d", "M50,50 L200,200 L350,50")
      .style("marker-start", "url(#start-marker)")
      .style("marker-end", "url(#end-marker)");

  // linkElements
  //   .append("text")
  //   .attr("dy", -5)
  //   .attr("class", (d) =>
  //     d.source.x < d.target.x ? "labelClockwise" : "labelAnticlockwise"
  //   )
  //   .append("textPath")
  //   .attr("startOffset", "50%")
  //   .attr("text-anchor", "middle")
  //   .attr("xlink:href", (d, i) => "#path-" + i)
  //   .text(function (d, i) {
  //     return "Label for edge " + i;
  //   });

  const parentNode = SVGElement.selectAll("circle")
    .data(Data.nodes)
    .enter()
    .append("circle")
    .attr("class", "Allcircle")
    .attr("id", (d) => `${d.data.name}-circle`)
    .attr("r", 30)
    .attr("fill", "#ffffff75");

  const parentImageElement = SVGElement.selectAll(".imageElement")
    .data(Data.nodes)
    .enter()
    .append("image")
    .attr("class", "imageElement")
    .attr("width", 50)
    .attr("height", 50)
    .attr("xlink:href", pod);

  const childNode = parentNode
    .data(Data.nodes.filter((e) => e.type !== "parent"))
    .enter()
    .append("circle")
    .attr("id", (d) => `${d.data.name}-innerCircle`)
    .attr("class", "innerCircle")
    .attr("r", 13)
    .attr("stroke", "black")
    .attr("fill", "white")
    .style("cursor", "pointer")
    .on("click", onClickOfCount);

  const childNodeCount = parentNode
    .data(Data.nodes.filter((e) => e.type !== "parent"))
    .enter()
    .append("text")
    .attr("id", (d) => `${d.data.name}-count`)
    .attr("class", "innerCircleCount")
    .attr("text-anchor", "middle")
    .attr("dy", 5)
    .text((d) => d?.data?.children?.length)
    .on("click", onClickOfCount)
    .style("cursor", "pointer")
    .style("font-size", "17px");

  const label = SVGElement.selectAll(".labels")
    .data(Data.nodes)
    .enter()
    .append("text")
    .attr("class", "labels")
    .text((d) => d.data.name)
    .style("text-anchor", "middle")
    .style("font-weight", "600");

  return {
    SVGElement,
    parentNode,
    parentImageElement,
    childNode,
    childNodeCount,
    label,
    onClickOfCount,
  };
};

export const GenerategraphWithMarker = (onClickOfCount, Data) => {
  const SVGElement = d3.select("#g-section");

  SVGElement.append("svg:defs")
    .append("svg:marker")
    .attr("id", "end-marker")
    .attr("viewBox", "0 -5 10 10") // Adjust the viewBox based on the marker's shape
    .attr("refX", 50) // Adjust the refX value to position the marker correctly
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5") // Adjust the path data to customize the marker shape
    .attr("fill", "green");

  SVGElement.append("svg:defs")
    .append("svg:marker")
    .attr("id", "start-marker")
    .attr("viewBox", "0 -5 10 10") // Adjust the viewBox based on the marker's shape
    .attr("refX", 50) // Adjust the refX value to position the marker correctly
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto-start-reverse")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5") // Adjust the path data to customize the marker shape
    .attr("fill", "green");

  SVGElement.append("defs")
    .append("marker")
    .attr("id", "end-marker")
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("refX", 10)
    .attr("refY", 5)
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "red");
  // SVGElement.append("path")
  // .attr("d", "M50,50 L200,200") // Adjust the path data based on your requirements
  // .attr("stroke", "black")
  // .attr("stroke-width", "2px")
  // .attr("marker-end", "url(#end-marker)");

  const linkElements = SVGElement.selectAll("g.link-group")
    .data(Data.edges)
    .enter()
    .append("g")
    .attr("class", "link-group");

  linkElements
    .append("path")
    .attr("class", "link")
    .attr("id", (d, i) => "path-" + i)
    .attr("fill", "transparent")
    .attr("stroke", "#637fbc")
    .attr("stroke-width", "3px")
    .attr("d", "M50,50 L200,200 L350,50")
    .style("marker-start", "url(#start-marker)")
    .style("marker-end", "url(#end-marker)");

  // linkElements
  //   .append("text")
  //   .attr("dy", -5)
  //   .attr("class", (d) =>
  //     d.source.x < d.target.x ? "labelClockwise" : "labelAnticlockwise"
  //   )
  //   .append("textPath")
  //   .attr("startOffset", "50%")
  //   .attr("text-anchor", "middle")
  //   .attr("xlink:href", (d, i) => "#path-" + i)
  //   .text(function (d, i) {
  //     return "Label for edge " + i;
  //   });

  const parentNode = SVGElement.selectAll("circle")
    .data(Data.nodes)
    .enter()
    .append("circle")
    .attr("class", "Allcircle")
    .attr("id", (d) => `${d.data.name}-circle`)
    .attr("r", 30)
    .attr("fill", "#ffffff75");

  const parentImageElement = SVGElement.selectAll(".imageElement")
    .data(Data.nodes)
    .enter()
    .append("image")
    .attr("class", "imageElement")
    .attr("id", (d) => `${d.data.name}-image`)
    .attr("width", 50)
    .attr("height", 50)
    .attr("xlink:href", pod);

  const childNode = parentNode
    .data(Data.nodes.filter((e) => e.type !== "parent"))
    .enter()
    .append("circle")
    .attr("id", (d) => `${d.data.name}-innerCircle`)
    .attr("class", "innerCircle")
    .attr("r", 13)
    .attr("stroke", "black")
    .attr("fill", "white")
    .style("cursor", "pointer")
    .on("click", onClickOfCount);

  const childNodeCount = parentNode
    .data(Data.nodes.filter((e) => e.type !== "parent"))
    .enter()
    .append("text")
    .attr("id", (d) => `${d.data.name}-count`)
    .attr("class", "innerCircleCount")
    .attr("text-anchor", "middle")
    .attr("dy", 5)
    .text((d) => d?.data?.children?.length)
    .on("click", onClickOfCount)
    .style("cursor", "pointer")
    .style("font-size", "17px")
    .style("fill", "#326CE5");

  const label = SVGElement.selectAll("text")
    .data(Data.nodes)
    .enter()
    .append("text")
    .attr("class", "labels")
    .text((d) => d.data.name)
    .style("text-anchor", "middle")
    .style("font-weight", "600");

  return {
    SVGElement,
    parentNode,
    parentImageElement,
    childNode,
    childNodeCount,
    label,
    onClickOfCount,
  };
};

export function calcTranslationExact(targetDistance, point0, point1) {
  var x1_x0 = point1.x - point0.x,
    y1_y0 = point1.y - point0.y,
    x2_x0,
    y2_y0;
  if (y1_y0 === 0) {
    x2_x0 = 0;
    y2_y0 = targetDistance;
  } else {
    var angle = Math.atan(x1_x0 / y1_y0);
    x2_x0 = -targetDistance * Math.cos(angle);
    y2_y0 = targetDistance * Math.sin(angle);
  }
  return {
    dx: x2_x0,
    dy: y2_y0,
  };
}
