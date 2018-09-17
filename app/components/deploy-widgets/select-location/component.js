import Component from '@ember/component';
import GeoTools from 'npm:geo-tools'; // eslint-disable-line
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import {
  get, set, computed
} from '@ember/object';

export default Component.extend({
  notifications:   service('notification-messages'),
  showField:       false,

  initializeChart: on('didInsertElement', function() {
    set(this, 'locationList', this.getCountry(get(this, 'datacenters')));

    renderGlobeChart( get(this, 'stacksfactory'), get(this, 'locationList'), get(this, 'notifications')); // eslint-disable-line
  }),

  locationAvailable: computed('datacenters.content', function() {
    return get(this, 'datacenters.content').length > 0;
  }),

  actions: {
    showInputField() {
      set(this, 'showField', true);
    },
    closeInputField() {
      set(this, 'showField', false);
    },

    getLocation() {
      renderGlobeChart.getLocation(); // eslint-disable-line
    }
  },
  getCountry(datacenters) {
    const self = this;
    let features = datacenters.content.map((x) => {
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
