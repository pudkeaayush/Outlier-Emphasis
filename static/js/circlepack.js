// Code template referenced from d3js.org

var w = 700,
    h = 550,
    r = 520,
    cx = d3.scale.linear().range([0, r]),
    cy = d3.scale.linear().range([0, r]),
    cnode,
    croot;

var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size; })

var vis = d3.select("#circle-pack").insert("svg:svg", "h2")
    .attr("width", w+ "px")
    .attr("height", h+ "px")
    .append("svg:g")
    .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

d3.json("outlier/projects", function(data) {
  cnode = croot = data;

  var cnodes = pack.nodes(croot);

  vis.selectAll("circle")
      .data(cnodes)
    .enter().append("svg:circle")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.r; })
      .on("click", function(d) { return czoom(cnode == d ? croot : d); });

  vis.selectAll("text")
      .data(cnodes)
    .enter().append("svg:text")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("dy", ".55em")
      .attr("text-anchor", function(d) { return d.r > 20 ? "end" : "middle"; })
      .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
      .text(function(d) { return d.name; });

  d3.select(window).on("click", function() { console.log("czoom called"); czoom(croot); });
});

function czoom(d, i) {
	console.log("czoom");
  var k = r / d.r / 2;
  cx.domain([d.x - d.r, d.x + d.r]);
  cy.domain([d.y - d.r, d.y + d.r]);

  var ct = vis.transition()
      .duration(d3.event.altKey ? 7500 : 750);

  ct.selectAll("circle")
      .attr("cx", function(d) { return cx(d.x); })
      .attr("cy", function(d) { return cy(d.y); })
      .attr("r", function(d) { return k * d.r; });

  ct.selectAll("text")
      .attr("x", function(d) { return cx(d.x); })
      .attr("y", function(d) { return cy(d.y); })
      .style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });

  cnode = d;
  d3.event.stopPropagation();
}