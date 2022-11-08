
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var pcX = d3.scale.ordinal().rangePoints([0, width/2], 1),    //parallel coordinates
    pcY = {};

var spX = d3.scale.linear().range([width/2+50, width]),      //scatter plots
    spY = d3.scale.linear().range([height-20,0]);

var line = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");

var axis = d3.svg.axis().orient("left");

var svg = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var cars = [];

var polyLines = [],
    dots = [];

d3.csv("cars.csv", type, function(error, data) {
    cars = data;
    drawpc();
    drawspplot();
});

function drawpc() {

    // Extract the list of dimensions and create a scale for each.
    pcX.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
        return d != "name" && (pcY[d] = d3.scale.linear()
            .domain(d3.extent(cars, function(p) { return +p[d]; }))
            .range([height, 0]));
    }));

    for (var i=0; i< cars.length; i++) {
        var lineData = [];
        for (var prop in cars[i]) {
            if (prop != "name" ) {
                var point = {};
                var val = cars[i][prop];
                point['x'] = pcX(prop);
                point['y'] = pcY[prop](val);
                lineData.push(point);
            }
        }
        var pLine=svg.append("g")
            .attr("class", "polyline")
            .append("path")
            .attr("d", line(lineData))
            .attr("idx", i)
            .on("mouseover", function() {
                mouseOver(d3.select(this).attr("idx"));
            })
            .on("mouseout", function(d) {
                mouseOut(d3.select(this).attr("idx"));
            });
        polyLines.push(pLine);

    }

    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + pcX(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(pcY[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

};


// Returns the path for a given data point.
function path(d) {
    return line(dimensions.map(function(p) { return [pcX(p), pcY[p](d[p])]; }));
}

function drawspplot(){

    var xAxis = d3.svg.axis()
        .scale(spX)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(spY)
        .orient("left");

    spX.domain([d3.min(cars, function(d) { return d.year; }),
        d3.max(cars, function(d) { return d.year; })]);
    spY.domain([d3.min(cars, function(d) { return d.power; }),
        d3.max(cars, function(d) { return d.power; })]);

    var xPosition = height -20;
    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + xPosition + ")")
        .call(xAxis);

    var yPosition = width/2 + 50;
    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + yPosition + ", 0)")
        .call(yAxis);

    for (var i=0; i<cars.length; i++) {
        var dot = svg.append("g")
            .append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) { return spX(cars[i].year); })
            .attr("cy", function(d) { return spY(cars[i].power); })
            .attr("idx", i)
            .attr("r", 3)
            .style("fill", "black")
            .on("mouseover", function(d) {
                mouseOver(d3.select(this).attr("idx"));
            })
            .on("mouseout", function(d) {
                mouseOut(d3.select(this).attr("idx"));
            });
        dots.push(dot);
    }

}

function mouseOver(i) {
    dots[i].style("fill", "red").attr("r", 5);     // change the style
    polyLines[i].style("stroke", "red").style("stroke-width", 5);
}

function mouseOut(i) {
    dots[i].style("fill", "black").attr("r", 3);   // restore the style
    polyLines[i].style("stroke", "#666").style("stroke-width", 1);
}


function type(d) {
    d.economy = +d.economy; // coerce to number
    d.displacement = +d.displacement; // coerce to number
    d.power = +d.power; // coerce to number
    d.weight = +d.weight; // coerce to number
    d.year = +d.year;
    return d;
}