import Component from '@ember/component';
import GeoTools from 'npm:geo-tools';

export default Component.extend({
  showField: false,

  initializeChart: Ember.on('didInsertElement', function() {
    this.set("model.locationList", this.getCountry(this.get("model")));
    renderGlobeChart(this.get("model"));
  }),


  getCountry: function(model) {
    const self = this;
    let features = model.datacenters.content.map(function(x) {
      return {
        "type": "Feature",
        "City": x.object_meta.name,
        "geometry": {
          "type": "Point",
          "coordinates": self.getCoordinates(x.object_meta.name)
        }
      }
    });

    let country = {
      "type": "FeatureCollection",
      "features": features,
    };
    return country;
  },

  getCoordinates: function(x) {
    var f = [];
    geocode(x, function(coordinates) {
      f.pushObjects([coordinates.lng, coordinates.lat]);
    });
    return f;
  },

  actions: {
    showInputField: function() {
      this.set('showField', true);
    },
    closeInputField: function() {
      this.set('showField', false);
    },

    getLocation: function() {
      renderGlobeChart.getLocation();
    }
  }
});
