import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { DATASET_2, DATASET_PACK, DATASET_PACK_2 } from "./mockData";
import "./style.css";
export default function Packlayout() {

  useEffectOnce(() => {
    var packLayout = d3.pack()
      .size([300, 300]).padding(10)
    var rootNode = d3.hierarchy(DATASET_PACK_2)
    rootNode.sum(function (d) {
      return d.value;
    });
    packLayout(rootNode)
    d3.select('svg g')
      .selectAll('circle')
      .data(rootNode.descendants())
      .join('circle')
      .attr("fill", "rgba(0,0,0,0.5)")
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', function (d) { return d.r; })
    });

  return (
    <div style={{ margin: "50px", background: "#0002" }}>
      <svg width="320" height="320">
        <g></g>
      </svg>
    </div>
  );
}

/*

  /*method 1*/
    // var nodes = d3.select('svg g')
    //   .selectAll('g')
    //   .data(rootNode.descendants())
    //   .join('g')
    //   .attr('transform', function(d) {return 'translate(' + [d.x, d.y] + ')'})

    // nodes
    //   .append('circle')
    //   .attr('r', function(d) { return d.r; })

    // nodes
    //   .append('text')
    //   .attr('dy', 4)
    //   .text(function(d) {
    //     return d.children === undefined ? d.data.name : '';
    //   })