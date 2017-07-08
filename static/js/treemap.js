// Code template referenced from d3js.org


var wid = 700,
    hei = 520,
    tx = d3.scale.linear().range([0, wid]),
    ty = d3.scale.linear().range([0, hei]),
    color = d3.scale.category20c(),
    root,
    node;

var treemap = d3.layout.treemap()
    .round(false)
    .size([wid, hei])
    .sticky(true)
    .value(function(d) { return d.size; });

var svg = d3.select("#treemap").append("div")
    .style("width", wid + "px")
    .style("height", hei + "px")
    .append("svg:svg")
    .attr("width", wid)
    .attr("height", hei)
    .append("svg:g")
    .attr("transform", "translate(.5,.5)");

d3.json("outlier/projects", function(data) {
  node = root = data;

  var nodes = treemap.nodes(root)
      .filter(function(d) { return !d.children; });

  var cell = svg.selectAll("g")
      .data(nodes)
	  .enter().append("svg:g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

  cell.append("svg:rect")
      .attr("width", function(d) { return d.dx - 1; })
      .attr("height", function(d) { return d.dy - 1; })
      .style("fill", function(d) { return color(d.parent.name); });

  cell.append("svg:text")
      .attr("x", function(d) { return d.dx / 2; })
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; })
      .style("opacity", function(d) { d.wid = this.getComputedTextLength(); return d.dx > d.wid ? 1 : 0; });

  d3.select(window).on("click", function() { console.log("zoom called"); zoom(root); });

  d3.select("select").on("change", function() {
    treemap.value(this.value == "size" ? size : count).nodes(root);
    zoom(node);
  });
});

function size(d) {
  return d.size;
}

function count(d) {
  return 1;
}

function zoom(d) {
	console.log("zoom");
  var kx = wid / d.dx, ky = hei / d.dy;
  tx.domain([d.x, d.x + d.dx]);
  ty.domain([d.y, d.y + d.dy]);

  var t = svg.selectAll("g.cell").transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .attr("transform", function(d) { return "translate(" + tx(d.x) + "," + ty(d.y) + ")"; });

  t.select("rect")
      .attr("width", function(d) { return kx * d.dx - 1; })
      .attr("height", function(d) { return ky * d.dy - 1; })

  t.select("text")
      .attr("x", function(d) { return kx * d.dx / 2; })
      .attr("y", function(d) { return ky * d.dy / 2; })
      .style("opacity", function(d) { return kx * d.dx > d.wid ? 1 : 0; });

  node = d;
  d3.event.stopPropagation();
}
