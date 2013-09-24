
padding=80;
var h = 400;
var w = 700;
var svg;
var dataset_index = 0;
   	
var dataset = [

	[
	    [50, 2], [108, 900], [25, 500], [10, 33], [330, 95],
	    [410, 12], [47, 44], [250, 670], [85, 210], [220, 88], [60,150]
	],
	
	[
	    [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
	    [410, 12], [475, 44], [25, 67], [85, 21], [220, 88], [600,150]
	],
	[
	    [50, 2], [108, 900], [25, 500], [10, 33], [330, 95],
	    [410, 12], [47, 44], [250, 670], [85, 210], [220, 88], [60,150]
	],
	[
	    [500, 20], [18, 900], [25, 50], [10, 33], [30, 95],
	    [410, 12], [47, 44], [250, 670], [850, 210], [220, 880], [600,150]
	]

]   	
   	

$(function(){
	
	d3.select("#new")
    .on("click", function() {
		svg.selectAll("*").remove()
		dataset_index++;
		if (dataset_index>3){dataset_index=0};
		m_plot(dataset[dataset_index])
    });
	
	init()
	m_plot(dataset[dataset_index])
		
});



function init(){
	create_svg()	
}

function create_svg(){
svg = d3.select("body")
		.append("svg")
		.attr("width", w  )
		.attr("height", h  );
}

var circles

function m_plot(dataset){

//document.getElementById('dataset_display').innerHTML= "asfd"

	$( "#dataset_display" ).text( dataset_index )
	
	//append one circle for each sub-array	
	circles = svg.selectAll("circle")
	    .data(dataset)
	    .enter()
	    .append("circle");  
	    	
  	// set the x scale between the width of the svg minus padding
  	var x_scale = x_scale_fcn(dataset);
  	// now y
  	var y_scale = y_scale_fcn(dataset);
    
    //set the size of the area of the circles to a scale between 10 and 75
    var size_scale = size_scale_fcn(dataset);
             
    //create the circles to get larger for y value, and place them along x axis based on x value, 
    // and along y axis based on y value     
	circles
		.attr({
			"r":
			function (d){
				area = Math.sqrt(d[1]/3.14)
				return size_scale(area);
			},
			"fill":"rgba(20,128,117,.5)",
			"cx":function(d) {
				return x_scale(d[0]);  //Returns scaled value
			},
			"cy":function(d) {
				return y_scale(d[1]);  //Returns scaled value
			},
		})
	
	// create some text and label the circles with the value from the dataset
	var text_boxes=	svg.selectAll("text")
	   		.data(dataset)
	   		.enter()
	   		
	   		.append("text")
	   		.text(function (d,i){
	   			return (d[0] + "," + d[1])
	   		});  
	 
	text_boxes
		.attr({
			
			"x":function(d) {
				return x_scale(d[0]);  //Returns scaled value
			},
			"y":function(d) {
				return y_scale(d[1]);  //Returns scaled value
			},
			"text-anchor":"middle"
		});
	set_x_axis(x_scale, h, padding, svg);
	set_y_axis(y_scale, h, padding, svg);	
}

x_scale_fcn = function (dataset){
	//get the max x value
  	var max_x_val = d3.max(dataset, function (d){
  		return d[0]
  	})
  	//return the scale
 	var ret_val = d3.scale.linear()
     .domain([0, max_x_val])
     .range([padding, w - padding]);
     
     return ret_val
}

y_scale_fcn = function (dataset){
  	var max_y_val = d3.max(dataset, function (d){
  		return d[1]
  	})
  	var min_y_val = d3.min(dataset, function (d){
  		return d[1]
  	})
	var yScale = d3.scale.linear()
         .domain([0, max_y_val])
         .range([h-padding, padding]);  
    return yScale; 	
}

size_scale_fcn = function (dataset){
    var max_y_val = d3.max(dataset, function (d){
  		return d[1]
  	})
   	var min_y_val = d3.min(dataset, function (d){
  		return d[1]
  	})
    var size_scale =  d3.scale.linear()
         .domain([Math.sqrt(min_y_val/3.14), Math.sqrt(max_y_val/3.14) ])
         .range([10, 75]);
     return size_scale;
}

function set_x_axis (x_scale, h, padding, svg){
	var x_axis = d3.svg.axis();
	x_axis.scale(x_scale);
	svg
		.append("g")
		.attr("class","axis")
		.call(x_axis)	
		.attr("transform", "translate(0," + (h - padding) + ")")

}

function set_y_axis (y_scale, h, padding, svg){
	//Define Y axis
	var yAxis = d3.svg.axis()
		.scale(y_scale)
		.orient("left")
		.ticks(5);
	//Create Y axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);	
}


