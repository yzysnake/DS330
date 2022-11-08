
var margin = {top: 20, right: 30, bottom: 100, left: 60},
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

var formatPercent = d3.format(".0%");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent); // Using percentage as y label display




var bardata = [] // Initial an void array for bardata
var sum = 0

d3.tsv("histogramdata.tsv", type, function(error, data) {    // Using d3.tsv to read tsv data

    for (var c = 65; c < 91; c++){     // Initial row's name by using ascii value
        bardata.push({name: String.fromCharCode(c), value: 0});
    }

    for (var i = 0; i < data.length; i++) {      // Using loop to check every row in tsv data
        sum += Number(data[i].count);           // Storing the sum of all value
        for (var a = 0; a < bardata.length; a++) {   // Using loop to check every objects in the array
            if (bardata[a].name === String(data[i].name.charAt(0).toUpperCase())){  // If there is an existing name in the bardata, just add the value
                bardata[a].value += Number(data[i].count);
                break;
            }
        }
    }

    for (var b = 0; b < bardata.length; b++){      // Change value into percentage value
        bardata[b].value = (bardata[b].value / sum);
    }


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
    d3.select("svg")  // add xaxis label
        .append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 250)
        .attr("y", 440)
        .text("Name categorized by first letter ");

    d3.select("svg")   // add yaxis label
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Percentage");

    var mode = 0
    var xCounter = true; // true means ascending order
    var yCounter = true; // true means ascending order

    function mousedown(coords) {
        var xPos = coords[0];
        var yPos = coords[1];
        if (xPos < 50) {
            if (xCounter === true) {
                bardata.sort(function(a,b) {return a.value - b.value;});
                console.log("left of y axis");
                xCounter = false;
            }
            else {
                bardata.sort(function(a,b) {return b.value - a.value;});
                console.log("left of y axis");
                xCounter = true;
            }
            updateAxis();
        } else if (yPos > 370) {
            if (yCounter === true) {
                bardata.sort(function(a,b) {return d3.ascending(a.name, b.name);})
                console.log("below x axis");
                yCounter = false;
            }
            else {
                bardata.sort(function(a,b) {return d3.descending(a.name, b.name);})
                console.log("below x axis");
                yCounter = true;
            }
            updateAxis();
        }
    }

    function updateAxis() {
        var x0 = x.domain(bardata.map(function (d) {return d.name;}));
        d3.selectAll(".bar")
            .attr("x", function(d) {return x0(d.name);});
        d3.select(".xaxis").call(xAxis);
    }
})
function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}



console.log(bardata)










