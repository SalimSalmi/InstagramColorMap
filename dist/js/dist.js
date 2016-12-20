function colorPicker(id, start, cb) {
  var white = d3.rgb("white"),
      black = d3.rgb("black"),
      width = d3.select("canvas").property("width");

  var channels = {
    h: {scale: d3.scale.linear().domain([0, 360]).range([0, width]), x: width * start},
    s: {scale: d3.scale.linear().domain([0, 1]).range([0, width]), x: width * start},
    l: {scale: d3.scale.linear().domain([0, 1]).range([0, width]), x: width * start}
  };

  var channel = d3.selectAll("#" + id + " .channel")
      .data(d3.entries(channels));

  var canvas = channel.select("canvas")
      .call(d3.behavior.drag().on("drag", dragged))
      .each(render);

  canvas.on("click", dragged);

  var current = {
    h: 360*start,
    s: start,
    l: start
  }

  function dragged(d) {
    d.value.x = Math.max(0, Math.min(this.width - 1, d3.mouse(this)[0]));
    canvas.each(render);

    current[d.key] = d.value.scale.invert(d.value.x);
    cb(id, current);
  }

  function render(d) {

    var width = this.width,
        context = this.getContext("2d"),
        image = context.createImageData(width, 1),
        i = -1;

    var current = d3.hsl(
      channels.h.scale.invert(channels.h.x),
      channels.s.scale.invert(channels.s.x),
      channels.l.scale.invert(channels.l.x)
    );

    if (d.key === 'h') {
      current = d3.hsl(
        channels.h.scale.invert(channels.h.x),
        channels.s.scale.invert(250),
        channels.l.scale.invert(125)
      );
    }
    if (d.key === 's') {
      current = d3.hsl(
        channels.h.scale.invert(channels.h.x),
        channels.s.scale.invert(channels.s.x),
        channels.l.scale.invert(125)
      );
    }

    for (var x = 0, v, c; x < width; ++x) {
      if (x === d.value.x) {
        c = white;
      } else if (x === d.value.x - 1) {
        c = black;
      } else {
        current[d.key] = d.value.scale.invert(x);
        c = d3.rgb(current);
      }
      image.data[++i] = c.r;
      image.data[++i] = c.g;
      image.data[++i] = c.b;
      image.data[++i] = 255;
    }

    context.putImageData(image, 0, 0);
  }

  return current;
}

function createGoogleMap () {

  var cities = { tokyo: { lng: 139.797171584, lat: 35.71781637 },
      london: { lng: -0.097197167, lat: 51.532795 },
      newyork: { lng: -74.04198026, lat: 40.72831085 },
      berlin: { lng: 13.373883333, lat: 52.526611667 },
      seoul: { lng: 127.012843219, lat: 37.565160341 },
      moscow: { lng: 37.675085361, lat: 55.753156237 },
      paris: { lng: 2.334376506, lat: 48.861800657 },
      rome: { lng: 12.469875229, lat: 41.890391589 },
      tehran: { lng: 51.3728388, lat: 35.6824128 },
      stockholm: { lng: 18.038223494, lat: 59.342382941 } }


  // Create the Google Map…
  var map = new google.maps.Map(d3.select("#google").node(), {
    zoom: 12,
    center: new google.maps.LatLng(40.72831085, -74.04198026),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }, {
        featureType: "all",
        stylers: [
          { saturation: -80 },
          { lightness: 30 }
        ]
      },
    ]
  });

  for(let city in cities) {
    d3.select( "#"+city ).on("click", function() {
      // map.setCenter();
      var center = new google.maps.LatLng(cities[city].lat, cities[city].lng);
      // using global variable:
      map.panTo(center);
    });
  }

  d3.csv("../data/parsed-data.csv", function(d) {

    return {
      time: new Date(+d.Created_Time),
      city: d.city,
      location: [+d.Longitude, +d.Latitude],
      likes: +d.Likes,
      comments: +d.Comments,
      colors: [d.color1, d.color2, d.color3, d.color4, d.color5]
    };

  }, function(error, data) {
    if (error) throw error;

    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
      var layer = d3.select(this.getPanes().overlayLayer).append("div")
          .attr("class", "photos");

      var bounds = {
        lower : colorPicker("lower", 0.2, updateColor),
        upper : colorPicker("upper", 0.8, updateColor)
      }

      function updateColor(id, hsl) {
        bounds[id] = hsl;

        layer.selectAll("svg").selectAll("circle")
          .attr("fill", function(d) {
            var result = inBounds(d,bounds);
            if(result > -1){
              return d.colors[result];
            } else {
              return d.colors[0];
            }
          })
          .attr("opacity", function(d) {
            if(inBounds(d, bounds) > -1){
              return 1;
            } else {
              return 0;
            }
          });
      };

      function inBounds(d, bounds){
        var selected = -1;
        var selectedDistance = -1;

        for(let i = 0; i < d.colors.length; i++){
          var currentColor = d3.rgb(d.colors[i]).hsl();

          var inBoundsH = bounds.lower.h < currentColor.h && bounds.upper.h > currentColor.h;
          var inBoundsS = bounds.lower.s < currentColor.s && bounds.upper.s > currentColor.s;
          var inBoundsL = bounds.lower.l < currentColor.l && bounds.upper.l > currentColor.l;

          if(bounds.lower.h > bounds.upper.h) {
            inBoundsH = bounds.lower.h < currentColor.h || bounds.upper.h > currentColor.h;
          }
          if(bounds.lower.s > bounds.upper.s) {
            inBoundsS = bounds.lower.s < currentColor.s || bounds.upper.s > currentColor.s;
          }
          if(bounds.lower.l > bounds.upper.l) {
            inBoundsL = bounds.lower.l < currentColor.l || bounds.upper.l > currentColor.l;
          }

          if (isNaN(currentColor.h)) { inBoundsH = true; }
          if (isNaN(currentColor.s)) { inBoundsS = true; }
          if (isNaN(currentColor.l)) { inBoundsL = true; }

          if(inBoundsH && inBoundsS && inBoundsL) {

            var distanceLBH = Math.abs(currentColor.h - bounds.lower.h);
            var distanceUBH = Math.abs(currentColor.h - bounds.upper.h);
            var distanceLBS = Math.abs(currentColor.s - bounds.lower.s);
            var distanceUBS = Math.abs(currentColor.s - bounds.upper.s);
            var distanceLBL = Math.abs(currentColor.l - bounds.lower.l);
            var distanceUBL = Math.abs(currentColor.l - bounds.upper.l);

            var distance = Math.abs(distanceLBH - distanceUBH + distanceLBS - distanceUBS + distanceLBL - distanceUBL);

            if(selectedDistance < 0 || selectedDistance > distance){
              selected = i;
            }
          }
        }
        return selected;
      }

      overlay.draw = function() {
        var projection = this.getProjection(),
            padding = 10;

        var marker = layer.selectAll("svg")
            .data(data)
            .each(transform)
          .enter().append("svg")
            .each(transform)
            .attr("class", "marker");

        // Add a circle.
        marker.append("circle")
            .attr("r", 4.5)
            .attr("cx", padding)
            .attr("cy", padding)
            .attr("stroke", "#333333")
            .attr("fill", function(d) {
              var result = inBounds(d,bounds);
              if(result > -1){
                return d.colors[result];
              } else {
                return d.colors[0];
              }
            })
            .attr("opacity", function(d) {
              if(inBounds(d, bounds) > -1){
                return 1;
              } else {
                return 0;
              }
            });

        function transform(d) {
          d = new google.maps.LatLng(d.location[1], d.location[0]);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
              .style("left", (d.x - padding) + "px")
              .style("top", (d.y - padding) + "px");
        }
      };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);
  });

}
