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
    .pointRadius(1);

var fraccident = d3.geo.path()
    .projection(projection)
    .pointRadius(3);

var indian_reservation = d3.geo.path()

var oilspill = d3.geo.path()
    .projection(projection)
    .pointRadius(3);

var sd_milepost = d3.geo.path()
    .projection(projection)
    .pointRadius(0.5);

var data_names = ['Keystone Pipeline', 'Dakota Access Pipeline', 'Phase 4 Pipeline', 'Waterbodies', 'Waterwells',
                  'Fracking Accidents', 'Oil Spills']

var point_types = ['keystone_pipeline_path', 'dakota_access_pipeline_path',
                'phase4_pipeline_path', 'waterbody', 'waterwell',
                'fraccident', 'oilspill']

point_ids = ['keystone_pipeline', 'dakota_access_pipeline', 'phase4_pipeline', 'waterbody', 'waterwell',
              'fraccident', 'oilspill']

var point_paths = [keystone_pipeline, dakota_access_pipeline, phase4_pipeline, waterbody, waterwell,
              fraccident, oilspill, sd_milepost]

var point_clicks = [keystone_pipeline_clicked, dakota_access_pipeline_clicked, phase4_pipeline_clicked, waterbody_clicked, waterwell_clicked,
              fraccident_clicked, oilspill_clicked, sd_milepost_clicked]

var data = []

var svg = d3.select("#map_container").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", center);

d3.select("body")
  .on("touchstart", nozoom)
  .on("touchmove", nozoom)

var drag = d3.behavior.zoom().on("zoom", dragged).translate([width / 2, height / 2]);

svg
    .call(drag)
    .call(drag.event);

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
  data.push(keystone, dakota_access, phase4,
                waterbodies, waterwells, fraccidents,
                 oilspills)

  svg.append("g")
      .attr("id", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("class", "state-path")
      .attr("d", path)
      .attr("id", function(d) {
        return d.id;
      })
      .on("click", state_clicked)

  svg.append("g")
      .attr("id", "borders")
      .append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "borders-path")
      .attr("d", path)

  for (var i=0; i < 3; i++) {
    plot_path(point_ids[i], point_types[i], point_paths[i], data[i])
  }

  for (var a = 0; a < data.length; a++) {
      var checkbox = $('<input>', { type: 'checkbox', class: point_types[a]});
      checkbox.data('ind', a);

      if (data_names[a] == 'Keystone Pipeline' || data_names[a] == 'Phase 4 Pipeline' || data_names[a] == 'Dakota Access Pipeline') {
        checkbox.prop( "checked", true );
      }
    if (!['Keystone Pipeline', 'Dakota Access Pipeline', 'Phase 4 Pipeline'].includes(data_names[a])) { 
     var legend_element = $('<li>').append($('<label>').append(checkbox).append(data_names[a])).appendTo($('#legend_body'));
      checkbox.click(function() {
        var ind = $(this).data('ind')
        if (!this.checked) {
          d3.selectAll('#' + point_ids[ind]).remove();
        } else {
          plot_points(point_ids[ind], point_types[ind], point_paths[ind], data[ind], point_clicks[ind]);
        }
      });
    } else {
      var legend_element = $('<li>').append($('<label>').append(checkbox).append(data_names[a])).appendTo($('#legend_body'));
      checkbox.click(function() {
        var ind = $(this).data('ind')
        if (!this.checked) {
          d3.selectAll('#' + point_ids[ind]).remove();
        } else {
          plot_path(point_ids[ind], point_types[ind], point_paths[ind], data[ind]);
        }
      });
    }
  }



    $(".close").click(function (e) {
      $('.date').empty();
          $('.location').empty();
          $('.gallons').empty();
          $('#myModal').modal('hide');

    });
}

function plot_points(id, cls, projection, data, click_func) {
  svg.append("g")
    .attr("id", id)
    .selectAll(cls)
    .data(data.features)
    .enter()
    .append("path")
    .call(drag)
    .attr("d", projection)
    .attr("class", cls)
    .on("click", click_func);
}

function plot_path(id, cls, projection, data) {
  svg.append("g")
    .attr("id", id)
    .selectAll(cls)
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", projection)
    .attr("class", "pipeline_path " + cls)
}

function keystone_pipeline_clicked(d) {
}
function dakota_access_pipeline_clicked(d) {
}

function phase4_pipeline_clicked(d) {
}
function state_clicked(d) {
  center(d, true);
}

function waterbody_clicked(d) {
  console.log('hi')
  center(d, false);
}

function waterwell_clicked(d) {
  center(d, false);
}

function fraccident_clicked(d) {
  center(d, false);
}

function indian_reservation_clicked(d) {
  center(d, false);
}

function oilspill_clicked(d) {
  $('#myModal').modal('show');
  var k = "AIzaSyCAE091wVHTbUQEr_-mfutVZAxrRlREOik";
  $('.date').text(d.properties.Date);
  $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+d.properties.Latitude+","+d.properties.Longitude+"&key="+k, function(data, status) {
    $('.location').text(data.results[0].formatted_address);
  })


  $('.gallons').text(d.properties["amount leaked"]);
  center(d, false);
}

function sd_milepost_clicked(d) {

}

function center(d, zoomout) {
  if (d3.event.defaultPrevented) return;

  var x, y, k;
  if (d && !centered) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else if (zoomout) {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
} else {
  var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = null;
}


  svg.selectAll("g").transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

}


function nozoom() {
  d3.event.preventDefault();
}

function dragged() {
  projection
      .translate(drag.translate())

  d3.selectAll(".state-path").attr("d", path);
  d3.select("#borders-path").attr("d", path)

  for (var i = 0; i < point_types.length; i++) {
    d3.selectAll('.' + point_types[i]).attr("d", point_paths[i]);
  }
}


$("g").click(function (e) {
    e.stopPropagation();
    if (document.getElementById("right_sidebar").style.width == "250px" && !centered){
      document.getElementById("right_sidebar").style.width = "0";
    }
    else {
      document.getElementById("right_sidebar").style.width = "250px";
    }

    });
}
