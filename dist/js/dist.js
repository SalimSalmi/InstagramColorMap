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
    		.attr("cx", function (d) { return projection(d)[0]; })
    		.attr("cy", function (d) { return projection(d)[1]; })
    		.attr("r", "8px")
    		.attr("fill", "red")
  });
})();

(function(){
  var locations = [[ 139.727645764, 35.668606429 ],
  [ 139.772742241, 35.697321105 ],
  [ 139.768780743, 35.680852449 ],
  [ 139.7250497, 35.672583283 ],
  [ 139.745116667, 35.657121667 ],
  [ 139.760597, 35.652731642 ],
  [ 139.773003655, 35.696562486 ],
  [ 139.708250692, 35.689946404 ],
  [ 139.722342873, 35.671535544 ],
  [ 139.769241667, 35.714671667 ],
  [ 139.769825, 35.735886667 ],
  [ 139.732870024, 35.663269396 ],
  [ 139.730941667, 35.660391667 ],
  [ 139.724013333, 35.692603333 ],
  [ 139.763978333, 35.711525 ],
  [ 139.733032115, 35.662961162 ],
  [ 139.792757822, 35.695241339 ],
  [ 139.775958806, 35.713886828 ],
  [ 139.747221667, 35.658178333 ],
  [ 139.709991667, 35.683838333 ],
  [ 139.757251192, 35.664731929 ],
  [ 139.769576847, 35.673335601 ],
  [ 139.771705, 35.71597 ],
  [ 139.762750815, 35.667599107 ],
  [ 139.759946895, 35.716076911 ],
  [ 139.745558333, 35.69445 ],
  [ 139.730968113, 35.666942273 ],
  [ 139.778060301, 35.698395429 ],
  [ 139.734059179, 35.662180929 ],
  [ 139.72525, 35.73658 ],
  [ 139.719766814, 35.729877944 ],
  [ 139.78536417, 35.6948793 ]];

  var width = 1440,
      height = 810;

  var scale = 0.5;

  width = width * scale;
  height = height * scale;

  var projection = d3.geo.mercator()
      .scale(120000*scale)
      .center([139.745558333, 35.69445]);

  var svg = d3.select("#tokyo").append("svg")
      .attr("width", width)
      .attr("height", height);

  var path = d3.geo.path()
      .projection(projection);

  var g = svg.append("g");


  // load and display the World map
  d3.json("../data/tokyo2.json", function(error, topology) {
    g.selectAll("path")
      .data(topojson.feature(topology, topology.objects.tokyo)
          .features)
    .enter()
      .append("path")
      .attr("d", path)

      svg.selectAll("circle")
    		.data(locations).enter()
    		.append("circle")
    		.attr("cx", function (d) { return projection(d)[0]; })
    		.attr("cy", function (d) { return projection(d)[1]; })
    		.attr("r", "8px")
    		.attr("fill", "red")
  });
})();
