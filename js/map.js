function setupMap() {
//Map dimensions (in pixels)
var width = $(window).width(),
    height = $(window).height(),
    centered  ;
scale0 = width;
//Map projection
var projection = d3.geo.albersUsa()
    .scale(scale0)
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var state_path = d3.geo.path()
    .projection(projection);

var pipeline_path = d3.geo.path()
        .projection(projection);
//Create an SVG
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom",zoomed);

svg.call(zoom);

d3.json("data/us.geojson",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console
  console.log(geodata)
  //Create a path for each map feature in the data
  features.selectAll(".state-path")
    .data(geodata.features)
    .enter()
    .append("path")
    .attr("d",state_path)
    .attr("class", "state-path")
    .on("click",clicked_state);

});

d3.json("data/keystoneroute.geojson", function(error, geodata) {
  if (error) return console.log(error); //unknown error, check the console
  features.selectAll(".pipeline-path")
    .data(geodata.features)
    .enter()
    .append("path")
    .attr("d", pipeline_path)
    .attr("class", "pipeline-path")
    .on("click",clicked_path);
});

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked_state(d,i) {

}

function clicked_path(d, i) {

}

//Update map on zoom/pan
function zoomed() {
  features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
}

}
