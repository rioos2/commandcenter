import Component from '@ember/component';
<<<<<<< HEAD:app/components/deploy-widgets/select-location/component.js
import GeoTools from 'geo-tools'; // eslint-disable-line
=======
import RioGeo from 'npm:geoip_from_cities';
import R from 'npm:ramda';
>>>>>>> 2-0-stable:app/components/createcloud/select-location/component.js
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import {
  get, set, computed
} from '@ember/object';

export default Component.extend({
<<<<<<< HEAD:app/components/deploy-widgets/select-location/component.js
  notifications:   service('notification-messages'),
  showField:       false,

  initializeChart: on('didInsertElement', function() {
    set(this, 'locationList', this.getCountry(get(this, 'datacenters')));

    renderGlobeChart( get(this, 'stacksfactory'), get(this, 'locationList'), get(this, 'notifications')); // eslint-disable-line
  }),

  locationAvailable: computed('datacenters.content', function() {
    return get(this, 'datacenters.content').length > 0;
  }),
=======

  notifications: service('notification-messages'),
  showField:     false,

  initializeChart: on('didInsertElement', function() {
    this.set('model.locationList', this.getCountry(this.get('model')));
    renderGlobeChart(this.get('model'), this.get('notifications')); // eslint-disable-line
  }),

  locationAvailable: function() {
    return this.get('model.datacenters.content').length > 0;
  }.property('model.datacenters.content'),
>>>>>>> 2-0-stable:app/components/createcloud/select-location/component.js


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
<<<<<<< HEAD:app/components/deploy-widgets/select-location/component.js
  getCountry(datacenters) {
=======

  getCountry(model) {
>>>>>>> 2-0-stable:app/components/createcloud/select-location/component.js
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
