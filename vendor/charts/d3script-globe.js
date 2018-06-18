function renderGlobeChart(params, notifications) {
  var attrs = {
    width: 350,
    height: 350,
    container: '#rio-globe',
  };
  var locationlist = params.locationList.features;
  var currpoint = [];

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, errorHandler, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: Infinity
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function errorHandler(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  function showPosition(position) {
    var currlat = position.coords.latitude;
    var currlong = position.coords.longitude;
    var y = [];
    var exists = false;
    var x;
    for (x = 0; x < locationlist.length; x++) {
      var coord = locationlist[x].geometry.coordinates;
      if (Math.abs(currlong - coord[0]) < 10 && Math.abs(currlat - coord[1]) < 10) {
        y.pushObject(locationlist[x].City);
        step(coord);
        exists = true;
        svg.select("g").selectAll("path.cities").select("animate").remove();
        svg.select("g").select("path#" + locationlist[x].City).append("animate")
          .attr("attributeName", "stroke-width")
          .attr("begin", "0s")
          .attr("dur", "1s")
          .attr("repeatCount", "indefinite")
          .attr("from", "5")
          .attr("to", "25");
      }
    }
    if (y.length != 0) {
      notifications.warning("Globe navigated to " + y + ". Select " + y + " to confirm ", {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-success'
      });
    }

    if (exists == false) {
      notifications.warning("We don't have a data center near your location", {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-success'
      });
    }
  }

  var backCountry;
  var backLine;
  var line;
  var country;
  var rScale = d3.scaleSqrt();
  var peoplePerPixel = 50000;
  var max_population = [];
  var timer_return_val = false;
  var animate_return_val = false;
  var animate_zoom = false;

  var time = Date.now();
  var rotate = [0, 0];
  var velocity = [.015, -0];

  var centroid = d3.geoPath()
    .projection(function(d) {
      return d;
    })
    .centroid;

  var projection = d3.geoOrthographic()
    .scale(attrs.height / 2.0)
    .translate([attrs.width / 2, attrs.height / 2])
    .clipAngle(90);

  var path = d3.geoPath()
    .projection(projection);

  var graticule = d3.geoGraticule()
    .extent([
      [-180, -90],
      [180 - .1, 90 - .1]
    ]);

  var svg = d3.select(attrs.container).append("svg")
    .attr("width", attrs.width)
    .attr("height", attrs.height);
  var shadow = d3.select(attrs.container).append("svg")
    .attr("width", 200)
    .attr("height", 0)
    .attr("class", "globe-shadow");

  var countrybackground = svg.append("defs")
  var countrybackgroundgrad = countrybackground.append("linearGradient")
    .attr("id", "countrygrad")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  countrybackgroundgrad.append("stop")
    .attr("offset", "0%")
    .attr("style", "stop-color:#2bf4ff;stop-opacity:1");
  countrybackgroundgrad.append("stop")
    .attr("offset", "100%")
    .attr("style", "stop-color:#035bf4;stop-opacity:1");


  svg.append("circle")
    .attr("class", "world-outline")
    .attr("cx", attrs.width / 2)
    .attr("cy", attrs.height / 2)
    .attr("r", projection.scale());


  function stoprotation() {
    timer_return_val = true;
    document.getElementById("startrot").style.display = 'inline';
    document.getElementById("stoprot").style.display = 'none';
  }

  function step(point) {
    if (!(point[0] == currpoint[0] && point[1] == currpoint[1])) {
      d3.transition()
        .delay(0)
        .duration(1250)
        .tween("rotate", function() {
          console.log(point);
          rotate.source(projection.rotate()).target([-point[0], -point[1]]).distance();
          return function(t) {
            svg.selectAll("path.cities").attr("d", path);

            projection.rotate(rotate(t)).clipAngle(180);
            backCountry.attr("d", path);
            backLine.attr("d", path);

            projection.rotate(rotate(t)).clipAngle(90);
            country.attr("d", path);
            line.attr("d", path);

            currpoint = point;
          };
        })
        .transition()
    }

  }

  function dragstarted() {
    v0 = versor.cartesian(projection.invert(d3.mouse(this)));
    r0 = projection.rotate();
    q0 = versor(r0);
  }

  function dragged() {
    currpoint = [];
    var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this))),
      q1 = versor.multiply(q0, versor.delta(v0, v1)),
      r1 = versor.rotation(q1);
    projection.rotate(r1);
    svg.selectAll("path.cities").attr("d", path);
    country.attr("d", path);
    line.attr("d", path);
    backCountry.attr("d", path);
    backLine.attr("d", path);
  }

  svg.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged));

  var d3_radians = Math.PI / 180;

  function d3_geo_greatArcInterpolator() {
    var x0, y0, cy0, sy0, kx0, ky0,
      x1, y1, cy1, sy1, kx1, ky1,
      d,
      k;

    function interpolate(t) {
      var B = Math.sin(t *= d) * k,
        A = Math.sin(d - t) * k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
      return [
        Math.atan2(y, x) / d3_radians,
        Math.atan2(z, Math.sqrt(x * x + y * y)) / d3_radians
      ];
    }

    interpolate.distance = function() {
      if (d == null) k = 1 / Math.sin(d = Math.acos(Math.max(-1, Math.min(1, sy0 * sy1 + cy0 * cy1 * Math.cos(x1 - x0)))));
      return d;
    };

    interpolate.source = function(_) {
      var cx0 = Math.cos(x0 = _[0] * d3_radians),
        sx0 = Math.sin(x0);
      cy0 = Math.cos(y0 = _[1] * d3_radians);
      sy0 = Math.sin(y0);
      kx0 = cy0 * cx0;
      ky0 = cy0 * sx0;
      d = null;
      return interpolate;
    };

    interpolate.target = function(_) {
      var cx1 = Math.cos(x1 = _[0] * d3_radians),
        sx1 = Math.sin(x1);
      cy1 = Math.cos(y1 = _[1] * d3_radians);
      sy1 = Math.sin(y1);
      kx1 = cy1 * cx1;
      ky1 = cy1 * sx1;
      d = null;
      return interpolate;
    };

    return interpolate;
  }

  var rotate = d3_geo_greatArcInterpolator();

  d3.json("world-continents.json", function(error, world) {
    var countries = topojson.object(world, world.objects.continent).geometries,
      i = -1,
      n = countries.length;

    projection.clipAngle(180);

    backLine = svg.append("path")
      .datum(graticule)
      .attr("class", "back-line")
      .attr("d", path);

    backCountry = svg.selectAll(".back-country")
      .data(countries)
      .enter().insert("path", ".back-line")
      .attr("class", "back-country")
      .attr("d", path);

    projection.clipAngle(90);

    line = svg.append("path")
      .datum(graticule)
      .attr("class", "line")
      .attr("d", path);

    country = svg.selectAll(".country")
      .data(countries)
      .enter().insert("path", ".line")
      .attr("class", "country")
      .attr("d", path);

    var title = svg.append("text")
      .attr("x", attrs.width / 2)
      .attr("y", attrs.height * 3 / 5);

    path.pointRadius(function(d) {
      return 10;
    });

    svg.append('g').selectAll("path.cities").data(params.locationList.features)
      .enter().append("path")
      .attr("class", "cities")
      .attr("id", function(d) {
        return d.City;
      })
      .attr("d", path)
      .attr("fill", "#ffffff")
      .attr("fill-opacity", 1)
      .attr("stroke", "#fff")
      .attr("stroke-width", 10)
      .attr("stroke-opacity", 0.4)
      .on('click', function(d, i) {
        svg.select("g").selectAll("path.cities").select("animate").remove();
        // handle events here
        // d - datum
        // i - identifier or index
        // this - the `<rect>` that was clicked
        d3.select(this).append("animate")
          .attr("attributeName", "stroke-width")
          .attr("begin", "0s")
          .attr("dur", "1s")
          .attr("repeatCount", "indefinite")
          .attr("from", "5")
          .attr("to", "25");
        //console.log(d);
        step(d.geometry.coordinates);
        params.set("stacksfactory.object_meta.cluster_name", d.City);
      });

  });
  renderGlobeChart.getLocation = getLocation;
}
