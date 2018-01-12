function renderBlueGaugeChart(params) {

  var consts = {
    TYPE_COLORED: "TYPE_COLORED",
    TYPE_EMPTY: "TYPE_EMPTY"
  }
  // exposed variables
  var attrs = {
    id: 'id' + Math.floor((Math.random() * 1000000)),
    svgWidth: 400,
    svgHeight: 400,
    marginTop: 25,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
    backgroundCircleColor: '#1A086F',
    middleBackgroundCircleColor: '#5249A1',
    outerBackgroundCircleColor: '#5753B6',
    mainDonutColor: '#C8C9CC',
    fontFamily: 'Arial Unicode MS',
    fontSize: 50,
    backgroundFill: '#142da3',
    data: null
  };


  staticArcProperties = {
    // outerBackgroundCircle: {
    //   color: attrs.outerBackgroundCircleColor,
    //   // color: "url(#outer-background-gradient)",
    //   values: [{
    //     type: consts.TYPE_COLORED,
    //     value: 360
    //   }]
    // },
    // middleBackground: {
    //   color: attrs.middleBackgroundCircleColor,
    //   //color: "url(#outer-background-gradient)",
    //   values: [{
    //     type: consts.TYPE_COLORED,
    //     value: 360
    //   }]
    // },
    // outerStepBackgroundCircle: {
    //   color: attrs.outerBackgroundCircleColor,
    //   values: [{
    //     type: consts.TYPE_COLORED,
    //     value: 360
    //   }]
    // },
    // outerStepTwoBackgroundCircle: {
    //   color: attrs.outerBackgroundCircleColor,
    //   values: [{
    //     type: consts.TYPE_COLORED,
    //     value: 360
    //   }]
    // },
    // outerStepThreeBackgroundCircle: {
    //   color: attrs.outerBackgroundCircleColor,
    //   values: [{
    //     type: consts.TYPE_COLORED,
    //     value: 360
    //   }]
    // },
    outerTopHeadBackground: {
      color: '#EDEFF9',
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
        .innerRadius(calc.overallRadius - 11)
        .outerRadius(calc.overallRadius - 4);

      arcs.backgroundDonut = d3.arc()
        .innerRadius(calc.middleBackgroundCircleRadius)
        .outerRadius(calc.outerBackgroundCircleRadius);




      //##############################   LAYOUTS  ##################

      var layouts = {};
      layouts.pie = d3.pie().value(d => d.value).sort(null);


      //drawing

      var container = d3.select(this);

      var svg = container
        .append('svg')
        // .attr('width', attrs.svgWidth)
        // .attr('height', attrs.svgHeight)
        .attr('font-family', attrs.fontFamily)
        .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
        .attr("preserveAspectRatio", "xMidYMid meet")

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


      //########################################  FILTERS #################################


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
            offset: "30%",
            color: "#C8C9CC"
          },
          {
            offset: "50%",
            color: "#FFD338"
          },
          {
            offset: "60%",
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
      var outerBackgroundCircle = patternify({
        container: centerPoint,
        selector: 'outer-background-circle',
        elementTag: 'circle'
      })
      outerBackgroundCircle.attr('r', 128)
        // .attr('cx', attrs.svgWidth)
        // .attr('cy', attrs.svgHeight)
        // .attr('r', calc.outerBackgroundCircleRadius)
        .attr('stroke', '#3B58BE')
        .attr('stroke-width', 30)
        .attr('fill', '#142DA3')

      // cx="150" cy="140" r="73" stroke="#3B58BE" stroke-width="20" fill="none"
      // .attr('fill', attrs.outerBackgroundCircleColor)
      // .attr('opacity', 0)
      // .style("filter", "url(#drop-shadow)")

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
      outerStepThreeBackgroundCircle.attr('r', 153)
        .attr('stroke', '#B5BACF')
        .attr('stroke-width', 5)
        // .attr('fill', '#142DA3')
        .attr('fill', 'none')
      // .attr('shadowColor', '#142DA3')
      // .attr('color', '#142da3')
      // ctx_back.fillStyle = "#142DA3";
      // ctx_back.beginPath();
      // ctx_back.shadowColor = "#142DA3";
      // ctx_back.shadowBlur = 15;
      // .attr('style', 'background-color: #e65525;border-radius:50%;box-shadow: 3px 3px 3px #e78267;')



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

      // var links = wrapper.selectAll('.links')
      //   .data(pointConfig.links)
      //   .enter()
      //   .append('line')
      //   .attr('stroke', 'white')
      //   .attr('stroke-width', 3)
      //   .attr('x1', d => pointConfig.nodes[d.source].x / 100 * width)
      //   .attr('x2', d => pointConfig.nodes[d.target].x / 100 * width)
      //   .attr('y1', d => pointConfig.nodes[d.source].y / 100 * width)
      //   .attr('y2', d => pointConfig.nodes[d.target].y / 100 * width)
      //   .attr('fill', '#6EAAFA')
      //   .attr('opacity', (d, i) => Math.random() / 4)





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
      whiteCircle.attr('r', 17)
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
      // <canvas id="back_loop" width="300" height="300"></canvas>
      // var canvas = centerPoint.insert('circle')
      // .attr('id', 'back_loop')
      // .attr('width', 300)
      //   .attr('height', 300)
      //     .attr("fill", "steelblue")

      // var context = canvas.node().getContext("2d");

      // .attr('cx', arcs.greenDonut.centroid({ startAngle: calc.sliderStartAngle, endAngle: calc.sliderStartAngle })[0])
      // .attr('cy', arcs.greenDonut.centroid({ startAngle: calc.sliderStartAngle, endAngle: calc.sliderStartAngle })[1])
      // .attr('class', '.round-corner-gray-left')
      // .attr('fill', '#EDEFF9')

      centerPoint.insert('circle', '.top-paths')
        .attr('r', 7)
        .attr('cx', arcs.greenDonut.centroid({
          startAngle: calc.sliderStartAngle,
          endAngle: calc.sliderStartAngle
        })[0])
        .attr('cy', arcs.greenDonut.centroid({
          startAngle: calc.sliderStartAngle,
          endAngle: calc.sliderStartAngle
        })[1])
        .attr('class', '.round-corner-gray-left')
        .attr('fill', '#EDEFF9')

      centerPoint.insert('circle', '.top-paths')
        .attr('r', 3.8)
        .attr('cx', arcs.greenDonut.centroid({
          startAngle: calc.sliderStartAngle,
          endAngle: calc.sliderStartAngle
        })[0])
        .attr('cy', arcs.greenDonut.centroid({
          startAngle: calc.sliderStartAngle,
          endAngle: calc.sliderStartAngle
        })[1])
        .attr('class', '.round-corner-gray-blue')
        // .attr('fill', '#1969F8')
        .attr('fill', '#a5a6d4')

      centerPoint.insert('circle', '.top-paths')
        .attr('r', 7)
        .attr('cx', arcs.greenDonut.centroid({
          startAngle: calc.sliderEndAngle,
          endAngle: calc.sliderEndAngle
        })[0])
        .attr('cy', arcs.greenDonut.centroid({
          startAngle: calc.sliderEndAngle,
          endAngle: calc.sliderEndAngle
        })[1])
        .attr('class', '.round-corner-gray-right')
        .attr('fill', '#EDEFF9')



      var newData = layouts.pie([{
        value: calc.currentValue / 100 * 80,
        color: '#3AF5F0'
      }, {
        color: 'none',
        value: (1 - calc.currentValue / 100) * 360 + calc.currentValue / 100 * 280
      }])


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


      // inner text

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
        .style("text-shadow", "0px 0px 45px " + attrs.mainDonutColor)





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

      // setTimeout(setDimensitons, 0);
      //
      // d3.select(window).on('resize.' + attrs.id, function () {
      //   setDimensitons();
      // })
      //
      //
      // function setDimensitons() {
      //   var outerContainer = d3.select(container.node().parentNode)
      //   var width = outerContainer.node().getBoundingClientRect().width;
      //
      //   outerContainer.select('canvas')
      //     .style('top', (width / 4 + 3) + 'px')
      //     .style('left', (width / 4 + 10) + 'px')
      //     .style('width', width / 2 + 'px')
      //     .style('height', width / 2 + 'px')
      //
      // }

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
