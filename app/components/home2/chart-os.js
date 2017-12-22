/* global renderChartGauge, d3*/
import Component from '@ember/component';

export default Component.extend({
    classNames: ["chart-os"],

    data: {
        entities: [{
          id: "android",
          name: "android",
          gradient: ["#00FFAF", '#00DC52'],
          values: [{
            date: 'Fri Jan 01 2017 00:00:00 GMT+0400',
            value: 20
          }, {
            date: 'Fri Jan 02 2017 00:00:00 GMT+0400 ',
            value: 10
          }, {
            date: 'Fri Jan 03 2017 00:00:00 GMT+0400 ',
            value: 10
          }, {
            date: 'Fri Jan 04 2017 00:00:00 GMT+0400 ',
            value: 30
          }, {
            date: 'Fri Jan 05 2017 00:00:00 GMT+0400 ',
            value: 80
          }, {
            date: 'Fri Jan 06 2017 00:00:00 GMT+0400 ',
            value: 20
          }, {
            date: 'Fri Jan 07 2017 00:00:00 GMT+0400 ',
            value: 50
          }, {
            date: 'Fri Jan 08 2017 00:00:00 GMT+0400 ',
            value: 25
          }, {
            date: 'Fri Jan 09 2017 00:00:00 GMT+0400 ',
            value: 45
          }, {
            date: 'Fri Jan 10 2017 00:00:00 GMT+0400 ',
            value: 5
          }, {
            date: 'Fri Jan 11 2017 00:00:00 GMT+0400 ',
            value: 5
          }]
        }, {
          id: "linux",
          name: "linux",
          gradient: ["#FF9008", '#F74479'],
          values: [{
            date: 'Fri Jan 01 2017 00:00:00 GMT+0400',
            value: 10
          }, {
            date: 'Fri Jan 02 2017 00:00:00 GMT+0400 ',
            value: 10
          }, {
            date: 'Fri Jan 03 2017 00:00:00 GMT+0400 ',
            value: 15
          }, {
            date: 'Fri Jan 04 2017 00:00:00 GMT+0400 ',
            value: 15
          }, {
            date: 'Fri Jan 05 2017 00:00:00 GMT+0400 ',
            value: 10
          }, {
            date: 'Fri Jan 06 2017 00:00:00 GMT+0400 ',
            value: 45
          }, {
            date: 'Fri Jan 07 2017 00:00:00 GMT+0400 ',
            value: 5
          }, {
            date: 'Fri Jan 08 2017 00:00:00 GMT+0400 ',
            value: 5
          }, {
            date: 'Fri Jan 09 2017 00:00:00 GMT+0400 ',
            value: 5
          }, {
            date: 'Fri Jan 10 2017 00:00:00 GMT+0400 ',
            value: 15
          }, {
            date: 'Fri Jan 11 2017 00:00:00 GMT+0400 ',
            value: 20
          }]
        },
        {
          id: "apple",
          name: "apple",
          gradient: ["#AA38E6", '#5322D9'],
          values: [{
            date: 'Fri Jan 01 2017 00:00:00 GMT+0400',
            value: 25
          }, {
            date: 'Fri Jan 02 2017 00:00:00 GMT+0400 ',
            value: 10
          }, {
            date: 'Fri Jan 03 2017 00:00:00 GMT+0400 ',
            value: 50
          }, {
            date: 'Fri Jan 04 2017 00:00:00 GMT+0400 ',
            value: 20
          }, {
            date: 'Fri Jan 05 2017 00:00:00 GMT+0400 ',
            value: 30
          }, {
            date: 'Fri Jan 06 2017 00:00:00 GMT+0400 ',
            value: 15
          }, {
            date: 'Fri Jan 07 2017 00:00:00 GMT+0400 ',
            value: 20
          }, {
            date: 'Fri Jan 08 2017 00:00:00 GMT+0400 ',
            value: 10
          }, {
            date: 'Fri Jan 09 2017 00:00:00 GMT+0400 ',
            value: 30
          }, {
            date: 'Fri Jan 10 2017 00:00:00 GMT+0400 ',
            value: 10
          }, {
            date: 'Fri Jan 11 2017 00:00:00 GMT+0400 ',
            value: 50
          }]
        }, {
          id: "windows",
          name: "windows",
          gradient: ["#4EE2FA", '#4B76CF'],
          values: [{
            date: 'Fri Jan 01 2017 00:00:00 GMT+0400 (TBIT)',
            value: 17
          }, {
            date: 'Fri Jan 02 2017 00:00:00 GMT+0400 (TBIT)',
            value: 25
          }, {
            date: 'Fri Jan 03 2017 00:00:00 GMT+0400 (TBIT)',
            value: 14
          }, {
            date: 'Fri Jan 04 2017 00:00:00 GMT+0400 (TBIT)',
            value: 60
          }, {
            date: 'Fri Jan 05 2017 00:00:00 GMT+0400 (TBIT)',
            value: 40
          }, {
            date: 'Fri Jan 06 2017 00:00:00 GMT+0400 (TBIT)',
            value: 50
          }, {
            date: 'Fri Jan 07 2017 00:00:00 GMT+0400 (TBIT)',
            value: 30
          }, {
            date: 'Fri Jan 08 2017 00:00:00 GMT+0400 (TBIT)',
            value: 36
          }, {
            date: 'Fri Jan 09 2017 00:00:00 GMT+0400 (TBIT)',
            value: 30
          }, {
            date: 'Fri Jan 10 2017 00:00:00 GMT+0400 (TBIT)',
            value: 38
          }, {
            date: 'Fri Jan 11 2017 00:00:00 GMT+0400 (TBIT)',
            value: 20
          }]
        }
        ]
    },

    initializeChart: Ember.on('didInsertElement', function() {
        var hex_chart_os = renderChartGauge()
            .svgHeight(500)
            .svgWidth(500)
            .data({ value: 66 });;

        d3.select(".hex_chart_os").call(hex_chart_os.hasLegs(false));

        var values = [0, 100, 65, 32, 100, 0, 76, 10, 90];
		var i = 0;

		setTimeout(() => {
			window.interval = setInterval(() => {
				var index = i++ % values.length;

				hex_chart_os.data({ value: values[index] });
			}, 2000);
        }, 3000);
        


        var chart3 = renderChartArea()
            .svgHeight(200)
            .svgWidth(700)
            .data(this.get('data'));

        d3.select("#areaGraph")
            .call(chart3);
            
    })
});
