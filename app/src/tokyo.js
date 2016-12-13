(function(){

//city,Id,Filter,Created_Time,Longitude,Latitude,Likes,Comments,Average_Color


  var width = 1440,
      height = 810;

  var scale = 0.5;

  width = width * scale;
  height = height * scale;

  var projection = d3.geo.mercator()
      .scale(300000*scale)
      .center([139.815558333, 35.68445]);

  var svg = d3.select("#tokyo").append("svg")
      .attr("width", width)
      .attr("height", height);

  var path = d3.geo.path()
      .projection(projection);

  var g = svg.append("g");


  d3.csv("../data/parsed-data.csv", function(d) {
    if(d.city === "tokyo"){
      return {
        time: new Date(+d.Created_Time),
        city: d.city,
        location: [+d.Longitude, +d.Latitude],
        likes: +d.Likes,
        comments: +d.Comments,
        color: d.Average_Color
      };
    }

  }, function(error, rows) {
    // load and display the tokyo map
    d3.json("../data/tokyo2.json", function(error, topology) {
      g.selectAll("path")
        .data(topojson.feature(topology, topology.objects.tokyo)
            .features)
      .enter()
        .append("path")
        .attr("d", path)

      svg.selectAll("circle")
        .data(rows).enter()
        .append("circle")
        .attr("cx", function (d) {
          return projection(d.location)[0]; })
        .attr("cy", function (d) { return projection(d.location)[1]; })
        .attr("r", "3px")
        .attr("fill", function(d) {return d.color});
    });
  });
})();
