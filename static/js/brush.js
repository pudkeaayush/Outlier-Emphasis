// Code template referenced from d3js.org

d3.helper = {};

var dataset = [];
var values = [];
var brush;
var x,y;
var bxAxis, byAxis;
var bsvg;
var points;
d3.csv("static/js/main.csv" , function(data) {
	 for (var i = 0 ;  i < 50; i++) {
		 var val = data[i].dst_bytes;
		dataset.push({index: i, value: val});
		values.push(val);
	}

var margin = {top: 20, right: 20, bottom: 60, left: 40},
    width = 1500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

x = d3.scale.linear()
    .range([0, width])
    .domain([0, 50]);

y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(values) + 5]);

brush = d3.svg.brush()
    .x(x)
    .on("brush", brushmove)
    .on("brushend", brushend);

bxAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

byAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(11);

bsvg = d3.select("#brusher").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

bsvg.append("g")
    .attr("class", "x axis")
    .attr("clip-path", "url(#clip)")
    .attr("transform", "translate(0," + height + ")")
    .call(bxAxis);

bsvg.append("g")
    .attr("class", "y axis")
    .call(byAxis);

bsvg.append("g")
    .attr("class", "brush")
    .call(brush)
  .selectAll('rect')
    .attr('height', height);

bsvg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height + 20);

points = bsvg.selectAll(".point")
    .data(dataset)
    .enter().append("circle")
    .attr("class", "point")
    .attr("clip-path", "url(#clip)")
    .attr("r", function(d){return 5;})
    .attr("cx", function(d) { return x(d.index); })
    .attr("cy", function(d) { return y(d.value); });

points.on('mousedown', function(){
  brush_elm = bsvg.select(".brush").node();
  new_click_event = new Event('mousedown');
  new_click_event.pageX = d3.event.pageX;
  new_click_event.clientX = d3.event.clientX;
  new_click_event.pageY = d3.event.pageY;
  new_click_event.clientY = d3.event.clientY;
  brush_elm.dispatchEvent(new_click_event);
});
});

function brushmove() {
  var extent = brush.extent();
  points.classed("selected", function(d) {
    is_brushed = extent[0] <= d.index && d.index <= extent[1];
    return is_brushed;
  });
}

function brushend() {
  get_button = d3.select(".clear-button");
  if(get_button.empty() === true) {
    clear_button = bsvg.append('text')
      .attr("x", 375)
      .attr("y", 460)
      .attr("class", "clear-button")
      .text("Clear Brush");
  }

  x.domain(brush.extent());

  transition_data();
  reset_axis();

  points.classed("selected", false);
  d3.select(".brush").call(brush.clear());

  get_button.on('click', function(){
	  console.log("clear button");
    x.domain([0, 50]);
    transition_data();
    reset_axis();
    clear_button.remove();
  });
}

function transition_data() {
  bsvg.selectAll(".point")
    .data(dataset)
  .transition()
    .duration(500)
    .attr("cx", function(d) { return x(d.index); });
}

function reset_axis() {
  bsvg.transition().duration(500)
   .select(".x.axis")
   .call(bxAxis);
}
