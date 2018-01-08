
function renderChartGauge(params) {

  // exposed variables
  var attrs = {
    id: 'id' + Math.floor((Math.random() * 1000000)),
    svgWidth: 400,
    svgHeight: 400,
    marginTop: 25,
    marginBottom: 5,
    marginRight: 25,
    marginLeft: 225,
    outerHexWidth: 140,
    middleHexWidth: 120,
    innerHexWidth: 107,
    initialValue: 50,
    middleTextFontSize: 50,
    pentagonHeightIndex: 0.45,
    transitionDuration: 1000,
    legTextFontSize: 25,
    fontFamily: 'Arial Unicode MS',
    legsRestColor: "#F4F9FB",
    legsTextRestColor: '#C8CED5',
    middleTextColor: "#05002D",
    outerHexColor: 'white',
    middleHexColor: 'white',
    innerHexColor: '#DEE6F4',
    bottomLegActiveColor: '#FB5C4D',
    bottomLegTextActiveColor: '#FEFFFF',
    topLegActiveColor: '#00E7D8',
    topLegTextActiveColor: '#FEFFFF',
    hasLegs: true,
    data: null
  };

  /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */
  var attrKeys = Object.keys(attrs);
  attrKeys.forEach(function (key) {
    if (params && params[key]) {
      attrs[key] = params[key];
    }
  })

  //innerFunctions
  var updateData;

  //main chart object
  var main = function (selection) {
    selection.each(function () {

      //calculated properties
      var calc = {}

      calc.chartLeftMargin = attrs.marginLeft;
      calc.chartTopMargin = attrs.marginTop;

      calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
      calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
      calc.currentValue = attrs.data.value;

      //drawing
      var svg = d3.select(this)
        .append('svg')
        // .attr('width', attrs.svgWidth)
        // .attr('height', attrs.svgHeight)
        .attr('font-family', attrs.fontFamily)
        .style('overflow', 'visible')
        .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
        .attr("preserveAspectRatio", "xMidYMid meet")

      var chart = svg.append('g')
        .attr('width', calc.chartWidth)
        .attr('height', calc.chartHeight)
        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')

      // ###################  FILTERS  ####################

      //-----------------  Drop Shadow Filters ------------------

      // filters go in defs element
      var defs = svg.append("defs");

      // create filter with id #drop-shadow
      // height=130% so that the shadow is not clipped
      var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr('color-interpolation-filters', 'sRGB')
        .attr("height", "150%")
        .attr("width", "150%");

      // SourceAlpha refers to opacity of graphic that this filter will be applied to
      // convolve that with a Gaussian with standard deviation 3 and store result
      // in blur
      filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 7)
        .attr("result", "blur");

      // translate output of Gaussian blur to the right and downwards with 2px
      // store result in offsetBlur
      filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", -3)
        .attr("dy", 5)
        .attr("result", "offsetBlur");

      filter.append("feFlood")
        .attr("in", "offsetBlur")
        .attr("flood-color", '#5e5e5d')
        .attr("flood-opacity", 0.1)
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

      var gradientId = "line-gradient-hex-gauge"
      svg.append("linearGradient")
        .attr("id", gradientId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", attrs.innerHexWidth)
        .attr("x2", 0).attr("y2", 0)
        .selectAll("stop")
        .data([
          { offset: "0%", color: "#FF6600" },
          { offset: "35%", color: "#F9C300" },
          { offset: "65%", color: "#F9C300" },
          { offset: "100%", color: "#00E1C9" }
        ])
        .enter().append("stop")
        .attr("offset", function (d) { return d.offset; })
        .attr("stop-color", function (d) { return d.color; });

      //  ---------------   TOP AND BOTTOM LEGS  -----------
      //hex wrapper
      var legsWrapper = patternify({ container: chart, selector: 'legs-wrapper', elementTag: 'g' })
      legsWrapper.attr('transform', 'translate(0,200)')
        .attr('display', attrs.hasLegs ? 'inline' : 'none')

      //top leg
      var topLeg = patternify({ container: legsWrapper, selector: 'top-leg-path', elementTag: 'path' })
      topLeg.attr('d', generatePentagonPath())
        .attr('fill', 'yellow')
        .attr('transform', `translate(${0},${-attrs.outerHexWidth * (1.05 + attrs.pentagonHeightIndex)})`)
        .attr('fill', attrs.legsRestColor)

      //top leg text
      var topLegText = patternify({ container: legsWrapper, selector: 'top-leg-text', elementTag: 'text' })
      topLegText.text('100%')
        .attr('transform', `translate(${0},${-attrs.outerHexWidth * (1.05 + attrs.pentagonHeightIndex) + attrs.outerHexWidth * 0.35}) `)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', attrs.legTextFontSize)
        .attr('fill', attrs.legsTextRestColor)

      //bottom leg
      var bottomLeg = patternify({ container: legsWrapper, selector: 'bottom-leg-path', elementTag: 'path' })
      bottomLeg.attr('d', generatePentagonPath())
        .attr('fill', 'yellow')
        .attr('transform', `translate(${0},${attrs.outerHexWidth * (1.05 + attrs.pentagonHeightIndex)}) rotate(180)`)
        .attr('fill', attrs.legsRestColor)

      //bottom leg text
      var bottomLegText = patternify({ container: legsWrapper, selector: 'bottom-leg-text', elementTag: 'text' })
      bottomLegText.text('0%')
        .attr('transform', `translate(${0},${attrs.outerHexWidth * (1.05 + attrs.pentagonHeightIndex) - attrs.outerHexWidth * 0.32}) `)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', attrs.legTextFontSize)
        .attr('fill', attrs.legsTextRestColor)

      //  -------------------------   HEX BIN  -------------------
      //hex wrapper
      var hexWrapper = patternify({ container: chart, selector: 'hex-wrapper', elementTag: 'g' })
      hexWrapper.attr('transform', 'translate(0,200)')

      //outer Hex Path
      var outerHexPath = patternify({ container: hexWrapper, selector: 'outer-hex-path', elementTag: 'path' })
      outerHexPath.attr('d', generateHexPath(attrs.outerHexWidth)).attr('fill', 'blue')
        .attr('fill', attrs.outerHexColor)
        .style("filter", "url(#drop-shadow)")

      //middle Hex Path
      var middleHexPath = patternify({ container: hexWrapper, selector: 'middle-hex-path', elementTag: 'path' })
      middleHexPath.attr('d', generateHexPath(attrs.middleHexWidth)).attr('fill', 'red')
        .attr('fill', attrs.middleHexColor)
        .style("filter", "url(#drop-shadow)")

      //inner Hex Path
      var innerHexPath = patternify({ container: hexWrapper, selector: 'inner-hex-path', elementTag: 'path' })
      innerHexPath
        .attr('d', generateHexPath(attrs.innerHexWidth))
        .attr('fill', attrs.middleHexColor)
        .attr('stroke-width', 3)
        .attr('stroke', attrs.innerHexColor)

      //Left Progress Hex Path
      var leftProgressHexPath = patternify({ container: hexWrapper, selector: 'left-progress-hex-path', elementTag: 'path' })
      leftProgressHexPath
        .attr('d', generateLeftProgressHexPath(attrs.innerHexWidth))
        .attr('fill', 'none')
        .attr('stroke-width', 4)
        .attr('stroke', 'url(#' + gradientId + ')')
        .attr('stroke-dasharray', `${3 * attrs.innerHexWidth} ${3 * attrs.innerHexWidth}`)
        .attr('stroke-linecap', 'round')
        .attr('stroke-dashoffset', `${3 * attrs.innerHexWidth}`)

        .transition()
        .duration(1500)
        .attr('stroke-dashoffset', 3 * attrs.innerHexWidth * (100 - calc.currentValue) / 100)

      //Right Progress Hex Path
      var rightProgressHexPath = patternify({ container: hexWrapper, selector: 'right-progress-hex-path', elementTag: 'path' })
      rightProgressHexPath
        .attr('d', generateRightProgressHexPath(attrs.innerHexWidth))
        .attr('fill', 'none')
        .attr('stroke-width', 4)
        .attr('stroke', 'url(#' + gradientId + ')')
        .attr('stroke-dasharray', `${3 * attrs.innerHexWidth} ${3 * attrs.innerHexWidth}`)
        .attr('stroke-linecap', 'round')
        .attr('stroke-dashoffset', `${3 * attrs.innerHexWidth}`)
        .transition()
        .duration(1500)
        .attr('stroke-dashoffset', 3 * attrs.innerHexWidth * (100 - calc.currentValue) / 100)


      //middle text percent
      var middlePercent = patternify({ container: hexWrapper, selector: 'middle-text-percent', elementTag: 'text' })
      middlePercent.text(attrs.initialValue + '%')
        .attr('text-anchor', 'middle')
        .attr('y', 8)
        .attr('alignment-baseline', 'middle')
        .attr('font-size', attrs.middleTextFontSize)
        .attr('fill', attrs.middleTextColor)


      // ----------------   FUNCTION INVOKATIONS  -------------------
      //set leg colors
      updateStates();


      //###############################  FUNCTIONS #########################
      //checking states
      function updateStates() {
        //main percent
        middlePercent.text(calc.currentValue + '%')

        //top leg
        if (calc.currentValue == 100) {
          topLeg.transition().duration(attrs.transitionDuration).attr('fill', attrs.topLegActiveColor)
          topLegText.transition().duration(attrs.transitionDuration).attr('fill', attrs.topLegTextActiveColor);
        } else {
          topLeg.transition().duration(attrs.transitionDuration).attr('fill', attrs.legsRestColor)
          topLegText.transition().duration(attrs.transitionDuration).attr('fill', attrs.legsTextRestColor);
        }

        //bottom leg
        if (calc.currentValue == 0) {
          bottomLeg.transition().duration(attrs.transitionDuration).attr('fill', attrs.bottomLegActiveColor)
          bottomLegText.transition().transition().attr('fill', attrs.bottomLegTextActiveColor);
        } else {
          bottomLeg.transition().duration(attrs.transitionDuration).attr('fill', attrs.legsRestColor)
          bottomLegText.transition().duration(1000).attr('fill', attrs.legsTextRestColor);
        }
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

      // right hex path generator
      function generateRightProgressHexPath(width) {
        var smallSide = width / 2;
        var bigSide = Math.sqrt(width * width - smallSide * smallSide);

        //path string building
        var path = `M 0 ${2 * smallSide}
                    l ${-bigSide} ${-smallSide}
                    l ${0} ${-width}
                    l ${bigSide} ${-smallSide}`;
        return path;
      }

      // left hex path generator
      function generateLeftProgressHexPath(width) {
        var smallSide = width / 2;
        var bigSide = Math.sqrt(width * width - smallSide * smallSide);

        //path string building
        var path = `M 0 ${2 * smallSide}
                    l ${bigSide} ${-smallSide}
                    l ${0} ${-width}
                    l ${-bigSide} ${-smallSide}`;
        return path;
      }

      // hexagonal path generator
      function generateHexPath(width) {
        var smallSide = width / 2;
        var bigSide = Math.sqrt(width * width - smallSide * smallSide);

        //path string building
        var path = `M 0 ${- width}
      l ${bigSide} ${smallSide}
      l ${0} ${width}
      l ${-bigSide} ${smallSide}
      l ${-bigSide} ${-smallSide}
      l ${0} ${-width}
      l ${bigSide} ${-smallSide} `;

        return path;
      }

      //pentagon path
      function generatePentagonPath() {
        var widthP = attrs.outerHexWidth * attrs.pentagonHeightIndex;
        var smallSideP = widthP / 2;
        var bigSideP = Math.sqrt(widthP * widthP - smallSideP * smallSideP);

        //path string building
        var path = `M 0 0
      l ${bigSideP} ${smallSideP}
      l ${0} ${widthP * 1.2}
      l ${-bigSideP * 2} 0
      l ${0} ${-widthP * 1.2}
      l ${bigSideP} ${-smallSideP} `

        return path;
      }



      // smoothly handle data updating
      updateData = function () {
        calc.currentValue = attrs.data.value;


        rightProgressHexPath
          .transition()
          .duration(1500)
          .attr('stroke-dashoffset', 3 * attrs.innerHexWidth * (100 - calc.currentValue) / 100)

        leftProgressHexPath
          .transition()
          .duration(1500)
          .attr('stroke-dashoffset', 3 * attrs.innerHexWidth * (100 - calc.currentValue) / 100)

        updateStates();

      }


    });
  };





  ['svgWidth', 'svgHeight', 'hasLegs'].forEach(key => {
    // Attach variables to main function
    return main[key] = function (_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) { eval(`return attrs['${key}']`); }
      eval(string);
      return main;
    };
  });

  //exposed update functions
  main.data = function (value) {
    if (!arguments.length) return attrs.data;
    attrs.data = value;
    if (typeof updateData === 'function') {
      updateData();
    }
    return main;
  }


  return main;
}
