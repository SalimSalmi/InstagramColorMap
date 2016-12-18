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
