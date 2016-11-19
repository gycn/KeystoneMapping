function setupMap() {
var width = $('#map_container').width(),
    height = $(window).height(),
    centered;
scale0=width

var projection = d3.geo.albersUsa()
    .scale(scale0)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var dakota_access_pipeline = d3.geo.path()
    .projection(projection);

var keystone_pipeline = d3.geo.path()
    .projection(projection);

var phase4_pipeline = d3.geo.path()
    .projection(projection);

var waterbody = d3.geo.path()
    .projection(projection)
    .pointRadius(5);

var waterwell = d3.geo.path()
    .projection(projection)
    .pointRadius(0.5);

var fraccident = d3.geo.path()
    .projection(projection)
    .pointRadius(3);

var indian_reservation = d3.geo.path()
    .projection(projection)
    .pointRadius(3);

var oilspill = d3.geo.path()
    .projection(projection)
    .pointRadius(3);

var sd_milepost = d3.geo.path()
    .projection(projection)
    .pointRadius(3);

var svg = d3.select("#map_container").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", center);

queue()
    .defer(d3.json, "data/us.json")
    .defer(d3.json, "data/keystone.geojson")
    .defer(d3.json, "data/dakota_access.geojson")
    .defer(d3.json, "data/phase4.geojson")
    .defer(d3.json, "data/waterbodies.geojson")
    .defer(d3.json, "data/waterwells.geojson")
    .defer(d3.json, "data/fraccidents.geojson")
    .defer(d3.json, "data/indian_reservations.geojson")
    .defer(d3.json, "data/oilspills.geojson")
    .defer(d3.json, "data/sd_mileposts.geojson")
    .await(ready);

function ready(error, us, keystone, dakota_access, phase4, 
                waterbodies, waterwells, fraccidents, 
                indian_reservations, oilspills, sd_mileposts) {
  if (error) throw error;
  svg.append("g")
      .attr("id", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("id", function(d) {
        return d.id;
      })
      .on("click", state_clicked);

  svg.append("g")
      .attr("id", "borders")
      .append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "borders-path")
      .attr("d", path);

  svg.append("g")
    .attr("id", "keystone_pipeline")
    .selectAll(".keystone_pipeline_path")
    .data(keystone.features)
    .enter()
    .append("path")
    .attr("d", keystone_pipeline)
    .attr("class", "pipeline_path keystone_pipeline_path");

  svg.append("g")
    .attr("id", "dakota_access_pipeline")
    .selectAll(".dakota_access_pipeline_path")
    .data(phase4.features)
    .enter()
    .append("path")
    .attr("d", phase4_pipeline)
    .attr("class", "pipeline_path dakota_access_pipeline_path");

  svg.append("g")
    .attr("id", "phase4_pipeline")
    .selectAll(".phase4_pipeline_path")
    .data(phase4.features)
    .enter()
    .append("path")
    .attr("d", phase4_pipeline)
    .attr("class", "pipeline_path phase4_pipeline_path");

  svg.append("g")
    .attr("id", "waterbodies")
    .selectAll(".waterbody")
    .data(waterbodies.features)
    .enter()
    .append("path")
    .attr("class", "waterbody")
    .attr("d", waterbody)
    .on("click", waterbody_clicked);

  svg.append("g")
    .attr("id", "waterwells")
    .selectAll(".waterwell")
    .data(waterwells.features)
    .enter()
    .append("path")
    .attr("class", "waterwell")
    .attr("d", waterwell)
    .on("click", waterwell_clicked);

  svg.append("g")
    .attr("id", "fraccidents")
    .selectAll(".fraccident")
    .data(fraccidents.features)
    .enter()
    .append("path")
    .attr("class", "fraccident")
    .attr("d", fraccident)
    .on("click", fraccident_clicked);

  svg.append("g")
    .attr("id", "oilspills")
    .selectAll(".oilspill")
    .data(oilspills.features)
    .enter()
    .append("path")
    .attr("class", "oilspill")
    .attr("d", oilspill)
    .on("click", oilspill_clicked);

    $("#states").click(function (e) {
      console.log("hi");
        
        if (centered){
          $('#myModal').modal('show');
        }
        else {
          $('#myModal').modal('hide');
        }
      
    });

  svg.append("g")
    .attr("id", "sd_mileposts")
    .selectAll(".sd_milepost")
    .data(sd_mileposts.features)
    .enter()
    .append("path")
    .attr("class", "sd_milepost")
    .attr("d", sd_milepost)
    .on("click", sd_milepost_clicked);

}

function state_clicked(d) {
  center(d);
}

function waterbody_clicked(d) {
  center(d);
}

function waterwell_clicked(d) {
  center(d);
}

function fraccident_clicked(d) {
  center(d);
}

function indian_reservation_clicked(d) {
  center(d);
}

function oilspill_clicked(d) {
  center(d);
}

function sd_milepost_clicked(d) {
  
}

function center(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  svg.selectAll("g").selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  svg.selectAll("g").transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

}


}
