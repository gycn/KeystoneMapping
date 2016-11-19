function setupMap() {
  
  var width = $(window).width(),
  height = $(window).height(),
  scale0 = (width - 1),
  centered;

  var projection = d3.geo.albersUsa()
      .scale(1070)
      .translate([width / 2, height / 2]);

  var path = d3.geo.path()
      .projection(projection);

  var zoom = d3.behavior.zoom()
    .translate([width / 2, height / 2])
    .scale(scale0)
    .scaleExtent([scale0, 8 * scale0])
    .on("zoom", zoomed);

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

  var g = svg.append("g");

  svg
    .call(zoom)
    .call(zoom.event);

  d3.json("data/us.json", function(error, us) {
    if (error) throw error;

    g.append("g")
        .attr("id", "states")
      .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("d", path)

    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("id", "state-borders")
        .attr("d", path);
  });

  function zoomed() {
    projection
        .translate(zoom.translate())
        .scale(zoom.scale());

    g.selectAll("path")
        .attr("d", path);
  }
}
