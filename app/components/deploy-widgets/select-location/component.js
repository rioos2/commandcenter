import Component from '@ember/component';
import RioGeo from 'geoip_from_cities';
import R from 'ramda';
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
          'coordinates': self.getCoordinates(x.object_meta.name, x.advanced_settings.country_code)
        }
      }
    });

    let country = {
      'type': 'FeatureCollection',
      features,
    };

    return country;
  },

  getCoordinates(q, r) {

    let m = new RioGeo().fillWithGeoInfo(q, r);

    const lm = (l) => R.props(['lng', 'lat'], l);
    const lnglat = R.map(lm)(m);

    return  R.flatten(lnglat);
  },

});
