
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var bardata=[{ name: "A", value: 0.08167 }, 
{ name: "B", value: 0.01492 }, 
{ name: "C", value: 0.02782 }, 
{ name: "D", value: 0.04253 }, 
{ name: "E", value: 0.12702 }, 
{ name: "F", value: 0.02288 }, 
{ name: "G", value: 0.02015 }, 
{ name: "H", value: 0.06094 }, 
{ name: "I", value: 0.06966 }, 
{ name: "J", value: 0.00153 }, 
{ name: "K", value: 0.00772 }, 
{ name: "L", value: 0.04025 }, 
{ name: "M", value: 0.02406 }, 
{ name: "N", value: 0.06749 }, 
{ name: "O", value: 0.07507 }, 
{ name: "P", value: 0.01929 }, 
{ name: "Q", value: 0.00095 }, 
{ name: "R", value: 0.05987 }, 
{ name: "S", value: 0.06327 }, 
{ name: "T", value: 0.09056 }, 
{ name: "U", value: 0.02758 }, 
{ name: "V", value: 0.00978 }, 
{ name: "W", value: 0.0236 }, 
{ name: "X", value: 0.0015 }, 
{ name: "Y", value: 0.01974 }, 
{ name: "Z", value: 0.00074 }]
	
console.log(bardata)
x.domain(bardata.map(function(d) { return d.name; }));
y.domain([0, d3.max(bardata, function(d) { return d.value; })]);

chart.append("g")
   .attr("class", "xaxis")
   .attr("transform", "translate(0," + height + ")")
   .call(xAxis);

chart.append("g")
   .attr("class", "yaxis")
   .call(yAxis);

chart.selectAll(".bar")
   .data(bardata)
   .enter().append("rect")
   .attr("class", "bar")
   .attr("x", function(d) { return x(d.name); })
   .attr("y", function(d) { return y(d.value); })
   .attr("height", function(d) { return height - y(d.value); })
   .attr("width", x.rangeBand());

chart.selectAll(".bar")
     .on("mouseover", function(){console.log("in");d3.select(this).style("fill", "red");})
     .on("mouseout",  function(){console.log("in");d3.select(this).style("fill", "steelblue");});

d3.select("svg")
  .on("mousedown", function() {
     console.log("mousedown");
     var coords = d3.mouse(this);
     mousedown(coords);
  });    

var mode = 0;

function mousedown(coords) {
   var xPos = coords[0];
   var yPos = coords[1];
   if (xPos < 50) {
       bardata.sort(function(a,b) {return a.value - b.value;});
       console.log("left of y axis");
      updateAxis();
   } else if (yPos > 470) {
      bardata.sort(function(a,b) {return d3.descending(a.name, b.name);})
      console.log("below x axis");
      updateAxis();
   }
}

function updateAxis() {
    var x0 = x.domain(bardata.map(function (d) {return d.name;}));
    d3.selectAll(".bar")
      .attr("x", function(d) {return x0(d.name);});
   d3.select(".xaxis").call(xAxis);
}














