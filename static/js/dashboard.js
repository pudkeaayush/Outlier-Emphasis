// Code template referenced from d3js.org

var global_data =[]
var 	formatAsPercentage = d3.format("%"),
		formatAsPercentage1Dec = d3.format(".1%"),
		formatAsInteger = d3.format(","),
		fsec = d3.time.format("%S s"),
		fmin = d3.time.format("%M m"),
		fhou = d3.time.format("%H h"),
		fwee = d3.time.format("%a"),
		fdat = d3.time.format("%d d"),
		fmon = d3.time.format("%b")
		;

function computeCategory(value) {
  if ( value < 100000)
    return "<100k"
  else if ( value > 100000 && value < 1000000)
    return "<1000k"
  else if ( value > 1000000 &&  value < 2000000)
	return "<2000k"
  else
	return "other"
}


function dsPieChart(){
	var dataset_dst_bytes =[]
	
	var dataset = [
      {category: "Q1", measure: 0.30},
        {category: "Q2", measure: 0.25},
        {category: "Q3", measure: 0.15},
        {category: "Q4", measure: 0.05},
        ]
        ;  
	
	d3.csv("static/js/main.csv" , function(data) {
  for (var i = 0; i < data.length; i++) {
                    dataset.push({ group : data[i].label  , category : computeCategory(parseInt( data[i].dst_bytes ))});
                }                   

	var dataset_class = {'satan': 1589, 'phf': 4, 'spy': 2, 'perl': 3, 'back': 2203, 'warezmaster': 20, 'neptune': 107201, 'normal': 97278, 'ipsweep': 1247, 'guess_passwd': 53, 'pod': 264, 'land': 21, 'multihop': 7, 'rootkit': 10, 'ftp_write': 8, 'warezclient': 1020, 'loadmodule': 9, 'nmap': 231, 'smurf': 280790, 'portsweep': 1040, 'buffer_overflow': 30, 'teardrop': 979, 'imap': 12}
	var sum = 0
	for ( var i in dataset_class) {
		sum = sum + dataset_class[i];
	}
	dataset = []
	for ( var i in dataset_class) {
		dataset.push({category : i , measure : parseFloat(dataset_class[i] / sum) });
		console.log(parseFloat(dataset_class[i] / sum))
	}
	var 	width = 700,
		   height = 550,
		   outerRadius = Math.min(width, height) / 2,
		   innerRadius = outerRadius * .999,   
		   // for animation
		   innerRadiusFinal = outerRadius * .5,
		   innerRadiusFinal3 = outerRadius* .45,
		   color = d3.scale.category20()    
		   ;
	    
	var dvis = d3.select("#pieChart")
	     .append("svg:svg")              
	     .data([dataset])                   
	         .attr("width", width)     
	         .attr("height", height)
	     		.append("svg:g")               
	         .attr("transform", "translate(" + (outerRadius+60) + "," + outerRadius + ")")   
				;
				
   var arc = d3.svg.arc()              
        	.outerRadius(outerRadius).innerRadius(innerRadius);
   
   // for animation
   var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
	var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

   var pie = d3.layout.pie()           
        .value(function(d) { return d.measure; });    

   var arcs = dvis.selectAll("g.slice")     
        .data(pie)                           
        .enter()                            
            .append("svg:g")                
               .attr("class", "slice")    
               .on("mouseover", mouseover)
    				.on("mouseout", mouseout)
    				;
    				
        arcs.append("svg:path")
               .attr("fill", function(d, i) { return color(i); } ) 
               .attr("d", arc)     
					.append("svg:title") 
				   .text(function(d) { return d.data.category + ": " + formatAsPercentage(d.data.measure); });			

        d3.selectAll("g.slice").selectAll("path").transition()
			    .duration(750)
			    .delay(10)
			    .attr("d", arcFinal )
			    ;
	
	  // Add a label to the larger arcs, translated to the arc centroid and rotated.
	  // source: http://bl.ocks.org/1305337#index.html
	  arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
	  		.append("svg:text")
	      .attr("dy", ".35em")
	      .attr("text-anchor", "middle")
	      .attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
	      //.text(function(d) { return formatAsPercentage(d.value); })
	      .text(function(d) { return d.data.category; })
	      ;
	   
	   // Computes the label angle of an arc, converting from radians to degrees.
		function angle(d) {
		    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
		    return a > 90 ? a - 180 : a;
		}
		    
		
		// Pie chart title			
		dvis.append("svg:text")
	     	.attr("dy", ".35em")
	      .attr("text-anchor", "middle")
	      .attr("class","title")
	      ;		    


		
	function mouseover() {
	  d3.select(this).select("path").transition()
	      .duration(750)
	        		.attr("d", arcFinal3)
	        		;
	}
	
	function mouseout() {
	  d3.select(this).select("path").transition()
	      .duration(750)
	        		.attr("d", arcFinal)
	        		;
	}
	
	})
}

dsPieChart();