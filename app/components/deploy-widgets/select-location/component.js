import Component from '@ember/component';
import GeoTools from 'geo-tools'; // eslint-disable-line
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';

export default Component.extend({
  notifications:   service('notification-messages'),
  showField:       false,
  initializeChart: on('didInsertElement', function() {
    this.set('model.locationList', this.getCountry(this.get('model')));

    renderGlobeChart(this.get('model'), this.get('notifications')); // eslint-disable-line
  }),

  locationAvailable: function(){
    return this.get('model.datacenters.content').length > 0;
  }.property('model.datacenters.content'),

  actions: {
    showInputField() {
      this.set('showField', true);
    },
    closeInputField() {
      this.set('showField', false);
    },

    getLocation() {
      renderGlobeChart.getLocation(); // eslint-disable-line
    }
  },
  getCountry(model) {
    const self = this;
    let features = model.datacenters.content.map((x) => {
      return {
        'type':     'Feature',
        'City':     x.object_meta.name,
        'geometry': {
          'type':        'Point',
          'coordinates': self.getCoordinates(x.object_meta.name)
        }
      }
    });
    let country = {
      'type':     'FeatureCollection',
      features,
    };

    return country;
  },

  getCoordinates(x) {
    var f = [];

    geocode(x, (coordinates) => { // eslint-disable-line
      f.pushObjects([coordinates.lng, coordinates.lat]);

    });

    return f;
  },

});
