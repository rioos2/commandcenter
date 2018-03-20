function renderBlueGaugeChart(params) {

  var consts = {
    TYPE_COLORED: "TYPE_COLORED",
    TYPE_EMPTY: "TYPE_EMPTY"
  }
  // exposed variables
  var attrs = {
    id: 'id' + Math.floor((Math.random() * 1000000)),
    svgWidth: 420,
    svgHeight: 420,
    marginTop: 25,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
    backgroundCircleColor: '#244ea3',
    middleBackgroundCircleColor: '#5249A1',
    outerBackgroundCircleColor: '#5753B6',
    mainDonutColor: '#f5c821',
    fontFamily: 'Arial Unicode MS',
    fontSize: 55,
    backgroundFill: '#142da3',
    data: null
  };

  staticArcProperties = {
    outerTopHeadBackground: {
      // Arc background color
      color: '#d6daec',
      values: [{
        type: consts.TYPE_COLORED,
        value: 40
      }, {
        type: consts.TYPE_EMPTY,
        value: 280
      }, {
        type: consts.TYPE_COLORED,
        value: 40
      }]
    },
  }

  /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */

  var attrKeys = Object.keys(attrs);
  attrKeys.forEach(function(key) {
    if (params && params[key]) {
      attrs[key] = params[key];
    }
  })


  //innerFunctions
  var updateData;


  //main chart object
  var main = function(selection) {
    selection.each(function() {

      // staticArcProperties.fullBackgroundCircle.color = attrs.backgroundFill;

      //calculated properties
      var calc = {}

      calc.chartLeftMargin = attrs.marginLeft;
      calc.chartTopMargin = attrs.marginTop;

      calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
      calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

      calc.centerPointX = calc.chartWidth / 2;
      calc.centerPointY = calc.chartHeight / 2;
      calc.backgroundCircleRadius = calc.chartHeight * 0.25;
      calc.overallRadius = calc.chartHeight / 2;

      calc.middleBackgroundCircleRadius = calc.backgroundCircleRadius * 1.29;
      calc.outerBackgroundCircleRadius = 2 * calc.middleBackgroundCircleRadius - calc.backgroundCircleRadius;

      calc.currentValue = attrs.data.value;
      calc.sliderStartAngle = 2 * Math.PI * 320 / 360;
      calc.sliderEndAngle = 2 * Math.PI * 40 / 360;

      var radiuses = {
        fullBackgroundCircle: {
          inner: calc.middleBackgroundCircleRadius,
          outer: calc.overallRadius
        },
        outerBackgroundCircle: {
          inner: calc.middleBackgroundCircleRadius,
          outer: calc.outerBackgroundCircleRadius
        },
        outerStepBackgroundCircle: {
          inner: calc.backgroundCircleRadius,
          outer: calc.middleBackgroundCircleRadius
        },
        outerStepTwoBackgroundCircle: {
          inner: calc.backgroundCircleRadius,
          outer: calc.middleBackgroundCircleRadius
        },
        outerStepThreeBackgroundCircle: {
          inner: calc.backgroundCircleRadius,
          outer: calc.middleBackgroundCircleRadius
        },

        middleBackground: {
          inner: calc.backgroundCircleRadius,
          outer: calc.middleBackgroundCircleRadius

        },
        outerTopHeadBackground: {
          inner: calc.overallRadius - 15,
          outer: calc.overallRadius

        },
        yellowDonut: {
          inner: (calc.middleBackgroundCircleRadius + calc.backgroundCircleRadius) / 2 - 1,
          outer: (calc.middleBackgroundCircleRadius + calc.backgroundCircleRadius) / 2 - 1,

        },
        innerYellowBackground: {
          inner: (calc.middleBackgroundCircleRadius + calc.backgroundCircleRadius) / 2 - 3,
          outer: (calc.middleBackgroundCircleRadius + calc.backgroundCircleRadius) / 2 + 1,
        },
        outerDarkThin: {
          inner: calc.outerBackgroundCircleRadius + 20,
          outer: calc.outerBackgroundCircleRadius + 24
        },
        outerLightThin: {
          inner: calc.outerBackgroundCircleRadius + 20,
          outer: calc.outerBackgroundCircleRadius + 22
        },
        innerOuterThinGradient: {
          inner: calc.outerBackgroundCircleRadius - 3,
          outer: calc.outerBackgroundCircleRadius - 8
        },
        middleThickDark: {
          inner: calc.middleBackgroundCircleRadius,
          outer: calc.middleBackgroundCircleRadius + (calc.outerBackgroundCircleRadius - calc.middleBackgroundCircleRadius) * 0.3
        },
        middleThickLight: {
          inner: calc.middleBackgroundCircleRadius,
          outer: calc.middleBackgroundCircleRadius + (calc.outerBackgroundCircleRadius - calc.middleBackgroundCircleRadius) * 0.3
        },
        middleThinBack: {
          inner: calc.middleBackgroundCircleRadius - 3,
          outer: calc.middleBackgroundCircleRadius
        },
        middleThinFront: {
          inner: calc.middleBackgroundCircleRadius - 3,
          outer: calc.middleBackgroundCircleRadius
        },

      }

      calc.yellowCircleLength = 0.5 * radiuses.yellowDonut.inner * Math.PI;

      // calculate properties for arcs
      var keys = Object.keys(staticArcProperties);
      keys.forEach(k => {
        var config = staticArcProperties[k];
        config.name = k;
        config.innerRadius = radiuses[k].inner;
        config.outerRadius = radiuses[k].outer;
        config.arc = d3.arc()
          .innerRadius(config.innerRadius)
          .outerRadius(config.outerRadius);

        config.values.forEach(d => {
          d.arc = config.arc;
          d.name = k;
          if (d.type == consts.TYPE_COLORED) {
            d.color = config.color;
          } else {
            d.color = 'none';
          }
        })
      })

      var staticArcPropertiesArr = keys.map(k => {
        return staticArcProperties[k];
      })

      window.staticArcPropertiesArr = staticArcPropertiesArr;

      //##############################   ARCS  ##################

      var arcs = {};
      arcs.yellowDonut = d3.arc()
        .innerRadius(radiuses.yellowDonut.inner)
        .outerRadius(radiuses.yellowDonut.inner);


      arcs.greenDonut = d3.arc()
        .innerRadius(calc.overallRadius - 12)
        .outerRadius(calc.overallRadius + 5);

      arcs.backgroundDonut = d3.arc()
        .innerRadius(calc.middleBackgroundCircleRadius)
        .outerRadius(calc.outerBackgroundCircleRadius);




      //##############################   LAYOUTS  ##################

      var layouts = {};
      layouts.pie = d3.pie().value(d => d.value).sort(null);


      //drawing

      var container = d3.select(this);

      //Base back ground svg. It's just render background only
      var svgTwo = container
        .append('svg')
        .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
        .attr("preserveAspectRatio", "xMidYMid meet")

      var chartTwo = svgTwo.append('g')
        .attr('width', calc.chartWidth)
        .attr('height', calc.chartHeight)
        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')

      var svg = container
        .append('svg')
        .attr('font-family', attrs.fontFamily)
        .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr('class', "svgTwo")
      var chart = svg.append('g')
        .attr('width', calc.chartWidth)
        .attr('height', calc.chartHeight)
        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')

      var centerPoint = patternify({
        container: chart,
        selector: 'center-point',
        elementTag: 'g'
      })
      centerPoint.attr('transform', `translate(${calc.centerPointX},${calc.centerPointY})`)

      var centerPointTwo = patternify({
        container: chartTwo,
        selector: 'center-point-two',
        elementTag: 'g'
      })
      centerPointTwo.attr('transform', `translate(${calc.centerPointX},${calc.centerPointY})`)


      //########################################  FILTERS #################################

      //Canvas bubbles area starts here.
      var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;
      var point_count = Math.floor(Math.random() * 3) + 1;

      var PI = Math.PI;
      var PI2 = PI * 2;
      var cx = 150;
      var cy = 150;
      var r = 100;

      var min = PI * .25;
      var max = PI - PI * .25;
      var percent = 50;
      var point_count = 3;

      initHeader();
      initAnimation();

      function initHeader() {
        width = 150;
        height = 150;

        //Canvas render base
        var canvas = container
          .append('canvas')
          .attr('width', calc.chartWidth - 80)
          .attr('height', calc.chartHeight - 190)
          .attr('id', 'pic')

        target = {
          x: 150,
          y: 150
        };

        ctx = canvas.node().getContext("2d");

        // create points
        points = [];
        for (var x = 0; x < 10; x = x + 1) {
          for (var y = 0; y < 10; y = y + 1) {
            var px = 125 + Math.random() * 40;
            var py = 90 + Math.random() * 40;
            var p = {
              x: px,
              originX: px,
              y: py,
              originY: py
            };
            points.push(p);
          }
        }

        // for each point find the 5 closest points
        for (var i = 0; i < points.length; i++) {
          var closest = [];
          var p1 = points[i];
          for (var j = 0; j < points.length; j++) {
            var p2 = points[j]
            if (!(p1 == p2)) {
              var placed = false;
              for (var k = 0; k < 5; k++) {
                if (!placed) {
                  if (closest[k] == undefined) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }

              for (var k = 0; k < 5; k++) {
                if (!placed) {
                  if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }
            }
          }
          p1.closest = closest;
        }

        // assign a circle to each point
        for (var i in points) {
          var c = new Circle(points[i], 0.6, 'rgba(0,0,255,1)');
          points[i].circle = c;
        }
      }

      // animation
      function initAnimation() {
        animate();
        for (var i in points) {
          if (points[i].x) {
            shiftPoint(points[i]);
          }
        }
      }

      function animate() {
        if (animateHeader) {
          ctx.clearRect(0, 0, calc.chartWidth, calc.chartHeight);
          for (var i = 0; i < points.length / point_count; i++) {
            // detect points in range
            if (Math.abs(getDistance(target, points[i])) < 4000) {
              points[i].active = 0.05;
              points[i].circle.active = 0.8;
            } else if (Math.abs(getDistance(target, points[i])) < 20000) {
              points[i].active = 0.01;
              points[i].circle.active = 0.3;
            } else if (Math.abs(getDistance(target, points[i])) < 40000) {
              points[i].active = 0.01;
              points[i].circle.active = 0.5;
            } else {
              points[i].active = 0;
              points[i].circle.active = 0;
            }

            drawLines(points[i]);
            points[i].circle.draw();
          }
        }
        requestAnimationFrame(animate);
      }

      // Size for bubble width and height. Position were taken from base svg itself.
      function shiftPoint(p) {
        TweenLite.to(p, 1 + 1 * Math.random(), {
          x: p.originX - 40 + Math.random() * 80,
          y: p.originY - 40 + Math.random() * 80,
          ease: Circ.easeInOut,
          onComplete: function() {
            shiftPoint(p);
          }
        });
      }

      // Canvas manipulation
      function drawLines(p) {
        if (!p.active) return;
        for (var i in p.closest) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.strokeStyle = 'rgba(20,217,249,' + p.active + ')';
          ctx.stroke();
        }
      }

      function Circle(pos, rad, color) {
        var _this = this;

        // constructor
        (function() {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
        })();

        this.draw = function() {
          if (!_this.active) return;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'rgba(20,217,249,' + _this.active + ')';
          ctx.fill();
        };
      }

      // Util
      function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
      }


      //-----------------  Drop Shadow Filters ------------------

      // filters go in defs element
      var defs = svg.append("defs");

      // create filter with id #drop-shadow
      // height=130% so that the shadow is not clipped
      var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr('color-interpolation-filters', 'sRGB')
        .attr("height", "170%")
        .attr("width", "150%")


      // SourceAlpha refers to opacity of graphic that this filter will be applied to
      // convolve that with a Gaussian with standard deviation 3 and store result
      // in blur
      filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 3)
        .attr("result", "blur");

      // translate output of Gaussian blur to the right and downwards with 2px
      // store result in offsetBlur
      filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 1)
        .attr("dy", 1)
        .attr("result", "offsetBlur");

      filter.append("feFlood")
        .attr("in", "offsetBlur")
        .attr("flood-color", 'gray')
        .attr("flood-opacity", 1)
        .attr("result", "offsetColor");

      filter.append("feComposite")
        .attr("in", "offsetColor")
        .attr("in2", 'offsetBlur')
        .attr("operator", 'in')
        .attr("result", "offsetBlur");

      // overlay original SourceGraphic over translated blurred opacity by using
      // feMerge filter. Order of specifying inputs is important!
      var feMerge = filter.append("feMerge");

      feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
      feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");


      //-------------------------- Background shadows ----------------------------------

      // Background shadow for outer circle. It can be re usable if any circle wants shadows
      var backdefs = svg.append("defs");
      var backfilter = backdefs.append("filter")
        .attr("id", "back-drop-shadow")
        .attr('color-interpolation-filters', 'sRGB')
        .attr("height", "170%")
        .attr("width", "150%")

      backfilter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 12)
        .attr("result", "blur");

      backfilter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("result", "offsetBlur");

      backfilter.append("feFlood")
        .attr("in", "offsetBlur")
        .attr("flood-color", '#061073')
        .attr("flood-opacity", 5)
        .attr("result", "offsetColor");

      backfilter.append("feComposite")
        .attr("in", "offsetColor")
        .attr("in2", 'offsetBlur')
        .attr("operator", 'in')
        .attr("result", "offsetBlur");

      var backfeMerge = backfilter.append("feMerge");

      backfeMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
      backfeMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");


      // ---------------------   Gradient Filters ------------------

      svg.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", -280).attr("y1", 0)
        .attr("x2", calc.chartWidth).attr("y2", 10)
        .selectAll("stop")
        .data([{
            offset: "0%",
            color: "blue"
          },
          {
            offset: "26%",
            color: "#4672fc"
          },
          {
            offset: "35%",
            color: "#3ce1ec"
          },
          {
            offset: "45%",
            color: "#d6ec3c"
          },
          {
            offset: "85%",
            color: "red"
          },
        ])
        .enter().append("stop")
        .attr("offset", function(d) {
          return d.offset;
        })
        .attr("stop-color", function(d) {
          return d.color;
        });

      // ########################################### DRAWING ####################################

      // outer background circle
      var outerBackgroundCircleTwo = patternify({
        container: centerPointTwo,
        selector: 'outer-background-circle-two',
        elementTag: 'circle'
      })
      outerBackgroundCircleTwo.attr('r', 128)
        .attr('stroke', '#3B58BE')
        .attr('fill', '#244ea3')
        .style("filter", "url(#back-drop-shadow)")


      // outer background circle
      var outerBackgroundCircle = patternify({
        container: centerPoint,
        selector: 'outer-background-circle',
        elementTag: 'circle'
      })
      outerBackgroundCircle.attr('r', 128)
        .attr('stroke', '#3B58BE')
        .attr('stroke-width', 30)
        // .attr('fill', '#244ea3')
        .attr('fill', '#044B94')
        .attr('fill-opacity', '0.4')
        //When outer circle needs to be more darker
       // .style("filter", "url(#back-drop-shadow)")

      // middle background circle
      var middleBackgroundCircle = patternify({
        container: centerPoint,
        selector: 'middle-background-circle',
        elementTag: 'circle'
      })
      middleBackgroundCircle.attr('r', 105)
        .attr('stroke', '#3B58BE')
        .attr('stroke-width', 5)
        .attr('fill', 'none')

      // middle Upper circle
      var middleUpperCircle = patternify({
        container: centerPoint,
        selector: 'middle-upper-circle',
        elementTag: 'circle'
      })
      middleUpperCircle.attr('r', 110)
        .attr('stroke', '#2e47b1')
        .attr('stroke-width', 5)
        .attr('fill', 'none')

      // middle background circle
      var outerStepBackgroundCircle = patternify({
        container: centerPoint,
        selector: 'outerstep-background-circle',
        elementTag: 'circle'
      })
      outerStepBackgroundCircle.attr('r', 126)
        .attr('stroke', '#A7E2F7')
        .attr('stroke-width', 2)
        .attr('fill', 'none')


      //outerStepTwoBackgroundCircle
      var outerStepTwoBackgroundCircle = patternify({
        container: centerPoint,
        selector: 'outertwostep-background-circle',
        elementTag: 'circle'
      })
      outerStepTwoBackgroundCircle.attr('r', 128)
        .attr('class', "symbol2")
        .attr('stroke', '#A7E2F7')
        .attr('stroke-width', 7)
        .attr('fill', 'none')
      //outerStepThreeBackgroundCircle
      var outerStepThreeBackgroundCircle = patternify({
        container: centerPoint,
        selector: 'outerthreestep-background-circle',
        elementTag: 'circle'
      })
      outerStepThreeBackgroundCircle.attr('r', 155)
        .attr('stroke', '#B5BACF')
        .attr('stroke-width', 5)
        .attr('fill', 'none')
        .style("filter", "url(#back-drop-shadow)")


      // links and nodes background
      var wrapper = patternify({
        container: centerPoint,
        selector: 'nodes-wrapper',
        elementTag: 'g'
      })
      wrapper.attr('transform', `translate(${-calc.backgroundCircleRadius},${-calc.backgroundCircleRadius})`)
        .attr('opacity', 0)

      var width = calc.backgroundCircleRadius * 2;
      var pointConfig = {
        nodes: [{
          x: 45,
          y: 5
        }, {
          x: 53,
          y: 3
        }, {
          x: 70,
          y: 15
        }, {
          x: 50,
          y: 40
        }, {
          x: 80,
          y: 25
        }, {
          x: 20,
          y: 40
        }, {
          x: 50,
          y: 50
        }, {
          x: 10,
          y: 60
        }, {
          x: 70,
          y: 60
        }, {
          x: 80,
          y: 60
        }, {
          x: 50,
          y: 70
        }, {
          x: 60,
          y: 75
        }, {
          x: 30,
          y: 80
        }, {
          x: 35,
          y: 95
        }, {
          x: 55,
          y: 97
        }],
        links: [{
          source: 0,
          target: 2
        }, {
          source: 0,
          target: 3
        }, {
          source: 1,
          target: 3
        }, {
          source: 1,
          target: 2
        }, {
          source: 2,
          target: 3
        }, {
          source: 5,
          target: 3
        }, {
          source: 8,
          target: 9
        }, {
          source: 8,
          target: 10
        }, {
          source: 8,
          target: 11
        }, {
          source: 9,
          target: 10
        }, {
          source: 9,
          target: 11
        }, {
          source: 10,
          target: 12
        }, {
          source: 10,
          target: 13
        }, {
          source: 11,
          target: 12
        }, {
          source: 11,
          target: 13
        }, {
          source: 12,
          target: 13
        }, {
          source: 11,
          target: 14
        }, {
          source: 10,
          target: 14
        }, {
          source: 13,
          target: 14
        }]
      }

      var nodes = wrapper.selectAll('.nodes')
        .data(pointConfig.nodes)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('fill', 'white')
        .attr('cx', d => width * d.x / 100)
        .attr('cy', d => width * d.y / 100)
        .attr('fill', '#6EAAFA')
        .attr('opacity', (d, i) => Math.random())


      //----------------------------------------------------------
      //static arcs
      var arcGroups = centerPoint.selectAll('.static-groups').data(staticArcPropertiesArr);
      arcGroups.exit().remove();
      arcGroups = arcGroups.enter().append('g').merge(arcGroups);

      //static arcs
      var arcPaths = arcGroups.selectAll('.static-arcs').data(d => layouts.pie(d.values));
      arcPaths.exit().remove();
      arcPaths = arcPaths.enter().append('path').merge(arcPaths);
      arcPaths.attr('fill', d => d.data.color)
        // .attr('stroke', d => d.data.color)
        .attr('stroke-width', 1)
        .attr('class', d => d.data.name)
        .attr('d', d => {
          return d.data.arc(d);
        })
        .each(d => {
          this._current = d;
        })

      //white circle
      var whiteCircle = patternify({
        container: centerPoint,
        selector: 'white-circle-slider',
        elementTag: 'circle'
      })
      whiteCircle.attr('r', 12)
        .attr('fill', 'white')
        .style("filter", "url(#drop-shadow)")


      var topHead = centerPoint.selectAll('.top-paths')
        .data(layouts.pie([{
          value: 0,
          color: 'url(#line-gradient)'
        }, {
          color: 'none',
          value: 360
        }]))
        .enter()
        .insert('path', '.white-circle-slider')
        .each(d => {
          d.startAngle -= (Math.PI * 4 / 18);
          d.endAngle -= (Math.PI * 4 / 18);
        })
        .attr('d', arcs.greenDonut)
        .attr('fill', d => d.data.color)
        .attr('stroke', d => d.data.color)
        .attr('class', 'top-paths')
        .each(function(d) {
          this._current = d;
        })
        .each((d, i) => {
          if (i == 0) {
            var angle = d.startAngle;
            var pos = arcs.greenDonut.centroid({
              startAngle: angle,
              endAngle: angle
            });
            whiteCircle.attr('cx', pos[0]).attr('cy', pos[1]);
          }
        })

      // Arc left side circle
      centerPoint.insert('circle', '.top-paths')
        .attr('r', 9.5)
        .attr('cx', arcs.greenDonut.centroid({
          startAngle: calc.sliderStartAngle,
          endAngle: calc.sliderStartAngle
        })[0])
        .attr('cy', arcs.greenDonut.centroid({
          startAngle: calc.sliderStartAngle,
          endAngle: calc.sliderStartAngle
        })[1])
        .attr('class', '.round-corner-gray-left')
        .attr('fill', '#4672fc')

      // Arc right side circle.
      centerPoint.insert('circle', '.top-paths')
        .attr('r', 8)
        .attr('cx', arcs.greenDonut.centroid({
          startAngle: calc.sliderEndAngle,
          endAngle: calc.sliderEndAngle - 0.08
        })[0])
        .attr('cy', arcs.greenDonut.centroid({
          startAngle: calc.sliderEndAngle,
          endAngle: calc.sliderEndAngle
        })[1])
        .attr('class', '.round-corner-gray-right')
        .attr('fill', '#d6daec')



      var newData = layouts.pie([{
        value: calc.currentValue / 100 * 80,
        color: '#3AF5F0'
      }, {
        color: 'none',
        value: (1 - calc.currentValue / 100) * 360 + calc.currentValue / 100 * 280
      }])

      // Arc path starting and enging angles
      topHead
        .data(newData)
        .each(d => {
          d.startAngle -= (Math.PI * 4 / 18);
          d.endAngle -= (Math.PI * 4 / 18);
        })
        .transition()
        .duration(500)
        .attrTween("d", function(a, index) {
          var i = d3.interpolate(this._current, a);
          var current = this._current = i(0);
          return function(t) {
            if (index == 0) {
              var angle = current.endAngle;
              var pos = arcs.greenDonut.centroid({
                startAngle: angle,
                endAngle: angle
              });
              whiteCircle.attr('cx', pos[0]).attr('cy', pos[1]);
            }
            return arcs.greenDonut(i(t));
          };
        })


      // inner text ("shadow, width and alignment")

      var middleText = patternify({
        container: centerPoint,
        selector: 'middle-text',
        elementTag: 'text'
      })
      middleText.text(calc.currentValue + '%')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('fill', attrs.mainDonutColor)
        .attr('font-size', attrs.fontSize)
        .attr('stroke-width', 3)
        .attr('stroke-opacity', 0.1)
        .attr('stroke', 'black')
        .attr('shadowBlur', 20)
        .attr('fillStyle', 'gray')
        .style("text-shadow", "2px 2px 32px" + attrs.mainDonutColor)


      // smoothly handle data updating
      updateData = function() {
        calc.currentValue = attrs.data.value;

        middleText.text(calc.currentValue + '%')
        if (calc.currentValue < 60) {
          middleText.attr('fill', '#C8C9CC')
        } else {
          middleText.attr('fill', '#FFD338')
        }

        topHead
          .data(layouts.pie([{
            value: calc.currentValue / 100 * 80,
            color: '#3AF5F0'
          }, {
            color: 'none',
            value: (1 - calc.currentValue / 100) * 360 + calc.currentValue / 100 * 280
          }]))
          .each(d => {
            d.startAngle -= (Math.PI * 4 / 18);
            d.endAngle -= (Math.PI * 4 / 18);
          })
          .transition()
          .duration(500)
          .attrTween("d", function(a, index) {
            var i = d3.interpolate(this._current, a);
            var current = this._current = i(0);
            return function(t) {

              if (index == 0) {
                var angle = current.endAngle;
                var pos = arcs.greenDonut.centroid({
                  startAngle: angle,
                  endAngle: angle
                });
                whiteCircle.attr('cx', pos[0]).attr('cy', pos[1]);
              }
              return arcs.greenDonut(i(t));
            };
          })


      }

      //trivial enter exit update pattern principle
      function patternify(params) {
        var container = params.container;
        var selector = params.selector;
        var elementTag = params.elementTag;

        // pattern in action
        var selection = container.selectAll('.' + selector).data([selector])
        selection.exit().remove();
        selection = selection.enter().append(elementTag).merge(selection)
        selection.attr('class', selector);
        return selection;
      }

    });
  };


  ['svgWidth', 'svgHeight', 'backgroundFill'].forEach(key => {
    // Attach variables to main function
    return main[key] = function(_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) {
        eval(`return attrs['${key}']`);
      }
      eval(string);
      return main;
    };
  });


  //exposed update functions
  main.data = function(value) {
    if (!arguments.length) return attrs.data;
    attrs.data = value;
    if (typeof updateData === 'function') {
      updateData();
    }
    return main;
  }


  return main;
}
