/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  storageData: 0,
  self: this,

  initializeChart: Ember.on('didInsertElement', function() {
    var data3 = {
      value: this.get('model.settings.storage'),
      min: 0,
      max: 1000,
      suffix: ' Gb',
      description: 'you can set any capacity',
      title: 'storage capacity'
    }

    var chart3 = this.renderChartLinearProgressSlider(this)
      .container('#storage')
      .data(data3)
      .debug(true)
      .run();
  }),

  storage: function() {
    var storage = this.get('storageData') + " GiB";
    this.set("model.assemblyfactory.resources.storage", storage);
  }.observes('storageData'),

  renderChartLinearProgressSlider: function(self, params) {

    // exposed variables
    var attrs = {
      svgWidth: 400,
      svgHeight: 323,
      marginTop: 1,
      marginBottom: 1,
      marginRight: 1,
      marginLeft: 1,
      container: 'body',
      backgroundColor: '#23273b',
      imageOpacity: 0.5,
      fontFamily: 'fselliot',
      defaultTextColor: '#7386aa',
      descriptionTextColor: '#585966',
      descriptionTextFontSize: 10,
      titleTextFontSize: 15,
      titleTextSpacing: 5,
      valueTextFontSize: 28,
      valueTextColor: '#FFD338',
      progressLineStrokeWidth: 4,
      progressLineStrokeDashArray: '2,2',
      activeProgressLineStrokeWidth: 10,
      progressSecondaryColor: '#473837',
      bottomLineBackground: '#33344D',
      bottomLineHeight: 3,
      sliderWidth: 30,
      bottomLineProgressSpacing: 10,
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
        calc.descriptionTextY = calc.chartHeight / 2 + 15;
        calc.descriptionTextX = calc.chartWidth / 2;
        calc.titleTextY = calc.chartHeight / 4;
        calc.titleTextX = calc.chartWidth / 2;
        calc.valueTextY = calc.chartHeight * 3 / 8;
        calc.valueTextX = calc.chartWidth / 2;
        calc.progressBarWidth = calc.chartWidth * 2 / 3;
        calc.progressBarX = calc.chartWidth * 1 / 6;
        calc.progressBarY = calc.chartHeight * 3 / 4 + 10;


        //###########################################  BEHAVIORS  ################################
        var behaviors = {};
        behaviors.sliderDrag = d3.drag().on('drag', sliderDragged);


        //###########################################   SCALES  ##############################
        var scales = {};
        scales.progress = d3.scaleLinear()
          .domain([attrs.data.min, attrs.data.max])
          .range([0, calc.progressBarWidth])


        //drawing containers
        var container = d3.select(this);

        //add svg
        var svg = patternify({
          container: container,
          selector: 'svg-chart-container',
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
          .attr('y', 0)
          .attr('width', attrs.svgWidth)
          .attr('height', attrs.svgHeight)
          .attr("xlink:href", "images/second/capacity.png")
          .attr('opacity', attrs.imageOpacity)

        //add container g element
        var chart = patternify({
          container: svg,
          selector: 'chart',
          elementTag: 'g'
        })
        chart.attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')');

        //###########################  DRAWING ELEMENTS  #####################

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
          .style('text-transform', 'uppercase')
          .attr('font-size', attrs.titleTextFontSize)
          .style('letter-spacing', attrs.titleTextSpacing)

        //values
        var valueText = patternify({
          container: chart,
          selector: 'value-text',
          elementTag: 'text'
        })
        valueText.text(attrs.data.value + attrs.data.suffix)
          .attr('fill', attrs.valueTextColor)
          .attr('y', calc.valueTextY)
          .attr('x', calc.valueTextX)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('font-size', attrs.valueTextFontSize)
          .style("text-shadow", "0px 0px 40px #e77e0d")

        //progressBars
        var topProgressLine = patternify({
          container: chart,
          selector: 'top-progress-line',
          elementTag: 'line'
        })
        topProgressLine.attr('x1', calc.progressBarX)
          .attr('y1', calc.progressBarY - attrs.progressLineStrokeWidth / 2)
          .attr('x2', calc.progressBarX + calc.progressBarWidth)
          .attr('y2', calc.progressBarY - attrs.progressLineStrokeWidth / 2)
          .attr('stroke', attrs.defaultTextColor)
          .attr('stroke-width', attrs.progressLineStrokeWidth)
          .attr('stroke-dasharray', attrs.progressLineStrokeDashArray)
          .call(behaviors.sliderDrag)
          .on('click', sliderDragged)
          .attr('cursor', 'pointer')
        self.set('storageData', attrs.data.value);
        //active progress secondary dasharray
        var secondaryProgressLine = patternify({
          container: chart,
          selector: 'secondary-progress-line',
          elementTag: 'line'
        })
        secondaryProgressLine.attr('x1', calc.progressBarX - 1)
          .attr('y1', calc.progressBarY)
          .attr('x2', calc.progressBarX + scales.progress(attrs.data.value) - 1)
          .attr('y2', calc.progressBarY)
          .attr('stroke', attrs.progressSecondaryColor)
          .attr('stroke-width', attrs.activeProgressLineStrokeWidth)
          .attr('stroke-dasharray', attrs.progressLineStrokeDashArray)

        //active progress
        var activeProgressLine = patternify({
          container: chart,
          selector: 'active-progress-line',
          elementTag: 'line'
        })
        activeProgressLine.attr('x1', calc.progressBarX)
          .attr('y1', calc.progressBarY - attrs.activeProgressLineStrokeWidth / 2)
          .attr('x2', calc.progressBarX + scales.progress(attrs.data.value))
          .attr('y2', calc.progressBarY - attrs.activeProgressLineStrokeWidth / 2)
          .attr('stroke', attrs.valueTextColor)
          .attr('stroke-width', attrs.activeProgressLineStrokeWidth)
          .attr('stroke-dasharray', attrs.progressLineStrokeDashArray)
          .call(behaviors.sliderDrag)
          .on('click', sliderDragged)
          .attr('cursor', 'pointer')

        //bottom background line
        var bottomBackgroundLine = patternify({
          container: chart,
          selector: 'bottom-background-line',
          elementTag: 'line'
        })
        bottomBackgroundLine.attr('x1', calc.progressBarX)
          .attr('y1', calc.progressBarY + attrs.bottomLineProgressSpacing)
          .attr('x2', calc.progressBarX + calc.progressBarWidth)
          .attr('y2', calc.progressBarY + attrs.bottomLineProgressSpacing)
          .attr('stroke', attrs.bottomLineBackground)
          .attr('stroke-width', attrs.bottomLineHeight)
          .call(behaviors.sliderDrag)
          .on('click', sliderDragged)
          .attr('cursor', 'pointer')

        //active bottom line
        var bottomActiveLine = patternify({
          container: chart,
          selector: 'bottom-active-line',
          elementTag: 'line'
        })
        bottomActiveLine.attr('x1', calc.progressBarX)
          .attr('y1', calc.progressBarY + attrs.bottomLineProgressSpacing)
          .attr('x2', calc.progressBarX + scales.progress(attrs.data.value))
          .attr('y2', calc.progressBarY + attrs.bottomLineProgressSpacing)
          .attr('stroke', attrs.defaultTextColor)
          .attr('stroke-width', attrs.bottomLineHeight)

        //slider line - secondary
        var sliderSecondaryLine = patternify({
          container: chart,
          selector: 'slider-secondary-line',
          elementTag: 'line'
        })
        sliderSecondaryLine.attr('x1', calc.progressBarX + Math.max(scales.progress(attrs.data.value) - attrs.sliderWidth, -attrs.sliderWidth) + attrs.sliderWidth * 0.4)
          .attr('y1', calc.progressBarY + attrs.bottomLineProgressSpacing + attrs.bottomLineHeight + 1)
          .attr('x2', calc.progressBarX + scales.progress(attrs.data.value) + attrs.sliderWidth * 0.4)
          .attr('y2', calc.progressBarY + attrs.bottomLineProgressSpacing + attrs.bottomLineHeight + 1)
          .attr('stroke', attrs.progressSecondaryColor)
          .attr('stroke-width', attrs.bottomLineHeight)
          .call(behaviors.sliderDrag)
          .attr('cursor', 'pointer')



        //slider line
        var sliderLine = patternify({
          container: chart,
          selector: 'slider-line',
          elementTag: 'line'
        })
        sliderLine.attr('x1', calc.progressBarX + Math.max(scales.progress(attrs.data.value) - attrs.sliderWidth / 2, -attrs.sliderWidth / 2))
          .attr('y1', calc.progressBarY + attrs.bottomLineProgressSpacing)
          .attr('x2', calc.progressBarX + scales.progress(attrs.data.value) + attrs.sliderWidth / 2)
          .attr('y2', calc.progressBarY + attrs.bottomLineProgressSpacing)
          .attr('stroke', attrs.valueTextColor)
          .attr('stroke-width', attrs.bottomLineHeight)
          .call(behaviors.sliderDrag)
          .attr('cursor', 'pointer')

        //hidden slider rectangle
        var sliderRect = patternify({
          container: chart,
          selector: 'slider-rect',
          elementTag: 'rect'
        })
        sliderRect.attr('pointer-events', 'all')
          .attr('opacity', 0)
          .call(behaviors.sliderDrag)
          .on('click', sliderDragged)
          .attr('cursor', 'pointer')
          .attr('x', calc.progressBarX)
          .attr('y', calc.progressBarY - attrs.activeProgressLineStrokeWidth)
          .attr('width', calc.progressBarX + calc.progressBarWidth)
          .attr('height', 30)


        //#############################  EVENT HANDLER FUNCTIONS ##########################
        function sliderDragged(d) {
          var currentWidth = d3.event.x - calc.progressBarX;
          var currentValue = Math.round(scales.progress.invert(currentWidth));

          if (currentValue < attrs.data.min) {
            currentValue = attrs.data.min;
          }
          if (currentValue > attrs.data.max) {
            currentValue = attrs.data.max
          }


          attrs.data.value = currentValue;

          main.run();
        }

        // smoothly handle data updating
        updateData = function() {
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
