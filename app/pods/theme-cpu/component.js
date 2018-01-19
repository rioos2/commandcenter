/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  cpuData: 0,
  self: this,

  initializeChart: Ember.on('didInsertElement', function() {
    var data1 = {
      value: this.get('model.settings.cpuCore'),
      min: 1,
      max: 30,
      description: 'From 1 to 30',
      title: 'Select number of cores'
    }


    var chart1 = this.renderChartNumberOfCores(this)
      .container('#numberofcores')
      .data(data1)
      .debug(true)
      .run();
  }),

  cpu: function() {
    var cpu = this.get('cpuData') + "";
    this.set("model.assemblyfactory.resources.cpu", cpu);
  }.observes('cpuData'),

  renderChartNumberOfCores: function(self, params) {

    // exposed variables
    var attrs = {
      svgWidth: 456,
      svgHeight: 388,
      marginTop: 5,
      marginBottom: 5,
      marginRight: 5,
      marginLeft: 5,
      container: 'body',
      backgroundColor: 'none',
      defaultTextColor: '#BCBDCE',
      titleTextFontSize: 25,
      descriptionTextColor: '#6974A6',
      descriptionTextFontSize: 14,
      fontFamily: 'fselliot',
      valueTextColor: '#223170',
      valueTextFontSize: 30,
      minusColor: '#FA0134',
      plusColor: "#2FEE36",
      minusFontSize: 23,
      pliusFontSize: 23,
      clickAreaWidth: 50,
      eachLineHeight: 1,
      eachLineMargin: 1,
      lineWidth: 2,
      data: null
    };


    /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */

    var attrKeys = Object.keys(attrs);
    attrKeys.forEach(function(key) {
      if (params && params[key]) {
        attrs[key] = params[key];
      }
    })

    //innerFunctions which will update visuals
    var updateData;

    //main chart object
    var main = function(selection) {
      selection.each(function scope() {

        //calculated properties
        var calc = {}
        calc.chartLeftMargin = attrs.marginLeft;
        calc.chartTopMargin = attrs.marginTop;
        calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
        calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
        calc.descriptionTextY = calc.chartHeight * 0.75 + 15;
        calc.descriptionTextX = calc.chartWidth / 2;
        calc.titleTextY = calc.chartHeight / 4 - 15;
        calc.titleTextX = calc.chartWidth / 2;
        calc.valueTextY = calc.chartHeight / 2 + 8;
        calc.valueTextX = calc.chartWidth / 2;
        calc.minusY = calc.chartHeight / 2 + 4;
        calc.minusX = calc.chartWidth * 0.28;
        calc.pliusY = calc.chartHeight / 2 + 4;
        calc.pliusX = calc.chartWidth - calc.chartWidth * 0.27;
        calc.centerX = calc.chartWidth / 2;
        calc.centerY = calc.chartHeight / 2;
        calc.lineStartY = calc.chartHeight * 0.67;
        calc.lineStartX = calc.chartWidth * 0.41 - attrs.lineWidth;
        calc.lineEndX = calc.chartWidth * 0.59;
        calc.hexHeight = Math.abs(calc.lineStartY - calc.chartHeight / 2) * 2 - 5;
        calc.lineCounts = Math.round(calc.hexHeight / (attrs.eachLineHeight + attrs.eachLineMargin))
        calc.halfHexHeight = calc.hexHeight / 2;
        // comes from pythagorean theorem
        calc.bottomLineWidth = calc.halfHexHeight / Math.sqrt(3)


        //drawing containers
        var container = d3.select(this);



        //##################################  SCALES  ###########################
        var scales = {};
        scales.line = d3.scaleLinear()
          .domain([0, calc.lineCounts / 2])
          .range([0, calc.bottomLineWidth])


        //############################# RECALCULATION ###################
        //recalculate
        calc.lineArray = Array.from(Array(calc.lineCounts), (d, i) => {
          var offset = 0;
          var pos = scales.line(i % calc.lineCounts);
          if (i > calc.lineCounts / 2) {
            var pos = scales.line(calc.lineCounts - i % calc.lineCounts);
          }
          return {
            value: Math.round(i / calc.lineCounts * attrs.data.max),
            posX: pos,
          }
        });



        //add svg
        var svg = patternify({
          container: container,
          selector: 'svg-chart-container-number-of-cores',
          elementTag: 'svg'
        })
        svg.attr('width', attrs.svgWidth)
          .attr('height', attrs.svgHeight)
          .style('font-family', attrs.fontFamily)
          .style('background-color', attrs.backgroundColor)
        // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
        // .attr("preserveAspectRatio", "xMidYMid meet")

        //add background image
        var image = patternify({
          container: svg,
          selector: 'svg-background-image',
          elementTag: 'svg:image'
        })
        image.attr('x', 0)
          .attr('y', 5)
          .attr('width', attrs.svgWidth)
          .attr('height', attrs.svgHeight)
          .attr("xlink:href", "images/second/numberOfCores.png")

        //add container g element
        var chart = patternify({
          container: svg,
          selector: 'chart',
          elementTag: 'g'
        })
        chart.attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')');

        //  ################################   DRAWING ELEMENTS   ###########################
        //description texts
        var descriptionText = patternify({
          container: chart,
          selector: 'description-text',
          elementTag: 'text'
        })
        descriptionText.text(attrs.data.description)
          .attr('fill', attrs.descriptionTextColor)
          .attr('y', calc.descriptionTextY)
          .attr('x', calc.descriptionTextX)
          .attr('text-anchor', 'middle')
          .style('text-transform', 'uppercase')
          .attr('font-size', attrs.descriptionTextFontSize)

        //title texts
        var titleText = patternify({
          container: chart,
          selector: 'title-text',
          elementTag: 'text'
        })
        titleText.text(attrs.data.title)
          .attr('fill', attrs.defaultTextColor)
          .attr('y', calc.titleTextY)
          .attr('x', calc.titleTextX)
          .attr('text-anchor', 'middle')
          .attr('font-size', attrs.titleTextFontSize)

        //value texts
        var valueText = patternify({
          container: chart,
          selector: 'value-text',
          elementTag: 'text'
        })
        valueText.text(attrs.data.value)
          .attr('fill', attrs.valueTextColor)
          .attr('y', calc.valueTextY)
          .attr('x', calc.valueTextX)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('font-size', attrs.valueTextFontSize)
          .attr('font-weight', 200)

          self.set('cpuData', attrs.data.value);
        //minus text
        var minusText = patternify({
          container: chart,
          selector: 'minus-text',
          elementTag: 'text'
        })
        minusText.text("-")
          .attr('fill', attrs.minusColor)
          .attr('y', calc.minusY)
          .attr('x', calc.minusX)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('font-size', attrs.minusFontSize)
          .attr('pointer-events', 'none')
          .attr('font-weight', 200)
          .each(function(d) {
            makeUnselectable(this);
          })



        //plus text
        var plusText = patternify({
          container: chart,
          selector: 'plus-text',
          elementTag: 'text'
        })
        plusText.text("+")
          .attr('fill', attrs.plusColor)
          .attr('y', calc.pliusY)
          .attr('x', calc.pliusX)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('font-size', attrs.pliusFontSize)
          .attr('pointer-events', 'none')
          .attr('font-weight', 200)
          .each(function(d) {
            makeUnselectable(this);
          })

        //plus text click area
        var plusTextClickArea = patternify({
          container: chart,
          selector: 'plus-text-click-area',
          elementTag: 'rect'
        })
        plusTextClickArea
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .attr('y', calc.pliusY - attrs.clickAreaWidth / 2)
          .attr('x', calc.pliusX - attrs.clickAreaWidth * 0.3)
          .attr('width', attrs.clickAreaWidth)
          .attr('height', attrs.clickAreaWidth)
          .style('cursor', 'pointer')
          .on('click', function(d) {
            attrs.data.value += 1;
            redraw();
          })

        //minus text click area
        var minusTextClickArea = patternify({
          container: chart,
          selector: 'minus-text-click-area',
          elementTag: 'rect'
        })
        minusTextClickArea
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .attr('y', calc.minusY - attrs.clickAreaWidth / 2)
          .attr('x', calc.minusX - attrs.clickAreaWidth * 0.7)
          .attr('width', attrs.clickAreaWidth)
          .attr('height', attrs.clickAreaWidth)
          .style('cursor', 'pointer')
          .on('click', function(d) {
            attrs.data.value -= 1;
            redraw();
          })


        //right side lines array
        var rightLineArrays = patternify({
          container: chart,
          selector: 'right-line-array',
          elementTag: 'rect',
          data: calc.lineArray
        })
        rightLineArrays
          .attr('fill', (d) => {
            if (d.value > attrs.data.value) {
              return 'none';
            }
            return 'white';
          })
          .attr('pointer-events', 'none')
          .attr('y', (d, i) => calc.lineStartY - i * (attrs.eachLineHeight + attrs.eachLineMargin) + 0.5)
          .attr('x', (d, i) => {
            return calc.lineEndX + d.posX
          })
          .attr('width', attrs.lineWidth)
          .attr('height', attrs.eachLineHeight)
          .style('cursor', 'pointer')


        //left side lines array
        var rightLineArrays = patternify({
          container: chart,
          selector: 'left-line-array',
          elementTag: 'rect',
          data: calc.lineArray
        })
        rightLineArrays
          .attr('fill', (d) => {
            if (d.value > attrs.data.value) {
              return 'none';
            }
            return 'white';
          })
          .attr('pointer-events', 'none')
          .attr('y', (d, i) => calc.lineStartY - i * (attrs.eachLineHeight + attrs.eachLineMargin) + 0.5)
          .attr('x', (d, i) => {
            return calc.lineStartX - d.posX
          })
          .attr('width', attrs.lineWidth)
          .attr('height', attrs.eachLineHeight)
          .style('cursor', 'pointer')






        // smoothly handle data updating
        updateData = function() {


        }

        function redraw() {
          if (attrs.data.value > attrs.data.max) {
            attrs.data.value = attrs.data.max
          }
          if (attrs.data.value < attrs.data.min) {
            attrs.data.value = attrs.data.min
          }
          clearSelection();
          main.run();
        }
        //#########################################  UTIL FUNCS ##################################

        //enter exit update pattern principle
        function patternify(params) {
          var container = params.container;
          var selector = params.selector;
          var elementTag = params.elementTag;
          var data = params.data || [selector];

          // pattern in action
          var selection = container.selectAll('.' + selector).data(data)
          selection.exit().remove();
          selection = selection.enter().append(elementTag).merge(selection)
          selection.attr('class', selector);
          return selection;
        }



        //prevents text selection on minus and plus click
        function clearSelection() {
          if (document.selection && document.selection.empty) {
            document.selection.empty();
          } else if (window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
          }
        }

        function makeUnselectable(elem) {
          if (typeof(elem) == 'string')
            elem = document.getElementById(elem);
          if (elem) {
            elem.onselectstart = function() {
              return false;
            };
            elem.style.MozUserSelect = "none";
            elem.style.KhtmlUserSelect = "none";
            elem.unselectable = "on";
          }
        }


        function debug() {
          if (attrs.isDebug) {
            //stringify func
            var stringified = scope + "";

            // parse variable names
            var groupVariables = stringified
              //match var x-xx= {};
              .match(/var\s+([\w])+\s*=\s*{\s*}/gi)
              //match xxx
              .map(d => d.match(/\s+\w*/gi).filter(s => s.trim()))
              //get xxx
              .map(v => v[0].trim())

            //assign local variables to the scope
            groupVariables.forEach(v => {
              main['P_' + v] = eval(v)
            })
          }
        }

        debug();
      });
    };

    //dinamic functions
    Object.keys(attrs).forEach(key => {
      // Attach variables to main function
      return main[key] = function(_) {
        var string = `attrs['${key}'] = _`;
        if (!arguments.length) {
          return eval(` attrs['${key}'];`);
        }
        eval(string);
        return main;
      };
    });

    //set attrs as property
    main.attrs = attrs;

    //debugging visuals
    main.debug = function(isDebug) {
      attrs.isDebug = isDebug;
      if (isDebug) {
        if (!window.charts) window.charts = [];
        window.charts.push(main);
      }
      return main;
    }

    //exposed update functions
    main.data = function(value) {
      if (!arguments.length) return attrs.data;
      attrs.data = value;
      if (typeof updateData === 'function') {
        updateData();
      }
      return main;
    }

    // run  visual
    main.run = function() {
      d3.selectAll(attrs.container).call(main);
      return main;
    }

    return main;
  }



});
