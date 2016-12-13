(function(){

  var cities = { tokyo: { Longitude: 139.797171584, Latitude: 35.71781637 },
    london: { Longitude: -0.097197167, Latitude: 51.532795 },
    newyork: { Longitude: -74.04198026, Latitude: 40.72831085 },
    berlin: { Longitude: 13.373883333, Latitude: 52.526611667 },
    seoul: { Longitude: 127.012843219, Latitude: 37.565160341 },
    moscow: { Longitude: 37.675085361, Latitude: 55.753156237 },
    paris: { Longitude: 2.334376506, Latitude: 48.861800657 },
    rome: { Longitude: 12.469875229, Latitude: 41.890391589 },
    tehran: { Longitude: 51.3728388, Latitude: 35.6824128 },
    stockholm: { Longitude: 18.038223494, Latitude: 59.342382941 } }

  var width = 1440,
      height = 810;

  var scale = 0.5;

  width = width * scale;
  height = height * scale;

  var projection = d3.geo.mercator()
      .scale(250*scale)
      .translate([width / 2, height / 1.5]);

  var svg = d3.select("#world").append("svg")
      .attr("width", width)
      .attr("height", height);

  var path = d3.geo.path()
      .projection(projection);

  var g = svg.append("g");


  // load and display the World map
  d3.json("../data/world-110m2.json", function(error, topology) {
      g.selectAll("path")
        .data(topojson.feature(topology, topology.objects.countries)
            .features)
      .enter()
        .append("path")
        .attr("d", path)

      // mark cities on map
      var locations = [];
      for(var city in cities)
        locations.push([cities[city].Longitude, cities[city].Latitude])

      svg.selectAll("circle")
    		.data(locations).enter()
    		.append("circle")
    		.attr("cx", function (d) {
          console.log(d);
          return projection(d)[0]; })
    		.attr("cy", function (d) { return projection(d)[1]; })
    		.attr("r", "8px")
    		.attr("fill", "red")
  });
})();

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
