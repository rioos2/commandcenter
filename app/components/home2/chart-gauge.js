/* global renderBlueGaugeChart, d3, particlesJS */
import Component from '@ember/component';
import Ember from 'ember';

export default Component.extend({
    classNames: ["gauge-chart"],
    power: 100,
    guage: '',

    guageOne: function() {
      this.updateGuages();
    }.observes('model'),

    updateGuages() {
      let value = this.get('model.counter');
      this.set('power', value);
      this.get('gauge').data({ value: value });

      let id = "g-" + this.get('model.name');
      self.$("#" + id + " text").text(Math.round(value)+ "%");
    },

    initializeChart: Ember.on('didInsertElement', function() {
        // first
        let id = "g-" + this.get('model.name');
        let c_name = ".b-" + this.get('model.name');

        let blue = renderBlueGaugeChart()
        .data({ value: 100 });

        particlesJS(id, {
            "particles": {
                "number": {
                    "value": 400,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.2,
                        "sync": false
                    }
                }
            },
        });

        d3.select(c_name).call(blue);

        // this simulates progresses
        // let values = this.get('model.values');
        // let i = 0;
        // setTimeout(() => {
        //     window.interval = setInterval(() => {
        //             let value = i % values.length;
        //             i = (i+1) % values.length;
        //             blue.data({ value: values[value] });
        //             this.set('power', values[value]);

        //     }, 2000);
        // }, 1);
        let value = this.get('model.counter');
        this.set('power', value);
        blue.data({ value: value});

          this.set('gauge', blue);

    })
});
