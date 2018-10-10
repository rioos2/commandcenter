/* eslint-disable */
import { get } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { htmlSafe } from '@ember/string';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import currency from 'iso-country-currency';
import RioGeo from 'geoip_from_cities';
import  R  from 'ramda';

export default Component.extend(DefaultHeaders, {

  intl:                    service(),
  notifications:           service('notification-messages'),
  tagName:                 '',

  // default selected city is US
  selectedCountry: 'US',
  filteredCountries: null,
 // the selected city
  selectedCity: '',
  // the default selected currency is $
  selectedCurrency: 'USD',
  // the filtered city results
  filteredCities: null,
  selectedNodes:           [],
  selectedStorage:         '',
  selectedVirtualNetworks: [],

  // Is this used ?
  error:                   false,

  initialCountry: computed('selectedCountry', function()  {
    const co = get(this, 'selectedCountry');

    const cy = htmlSafe(
        `<span class="flag-icon flag-icon-${ co.toLowerCase() } flag-icon-squared"></span>` +
        `<span class="flag-text" style="margin-left: 10px;">${ co } </span>`
      );

    return { name: co, title: cy  };
  }),

  countries: computed('model', function() {

    const cy =  c => htmlSafe(
        `<span class="flag-icon flag-icon-${ c.toLowerCase() } flag-icon-squared"></span>` +
        `<span class="flag-text" style="margin-left: 10px;">${ c }</span>`
      );

     const abbrev = y => {return { name: y, title: cy(y.iso) } };

      return R.map(abbrev)(currency.getAllISOCodes());
   }),

  storages: function() {
    return this.nameGetter(this.get('model.storageConnectors.content'));
  }.property('model.storageConnectors.content'),

  nodes: function() {
    return this.nameGetter(this.get('model.nodes.content'));
  }.property('model.nodes.content'),

  virtualNetworks: function() {
    return this.get('model.networks.content');
  }.property('model.networks.content'),

  didInsertElement() {
    this.set('error', this.displayMessage());
    this.set('filteredCountries', get(this, 'countries'));   
  },

  actions: {

    // action that records the new country.
    countryChanged(country) {
      const iso  = country.name.iso;
      const cy   = country.name.currency;
      const name = country.name.countryName;
      this.set('selectedCurrency', cy);
      this.set('selectedCountry', name);
      this.set('selectedCountryISO', iso);
    },

    countryDidChange(country) {
      const q = R.trim(country).toUpperCase();
      const all = get(this, 'countries');

      // Start search if a minimum of 3 chars is entered.
      if (isEmpty(q) ||  q.length < 1 ) {
        this.set('filteredCountries', get(this, 'countries'));
        return;
      }

      const isLike =  n  =>  {
        return  n.name.iso.indexOf(q) >= 0;
      }

      const composeFn =   R.compose(R.filter(isLike));

      this.set('filteredCountries', composeFn(all));
    },

    // action that records the new city.
    cityChanged(city) {
      this.set('selectedCity', city);
    },

    // action called when the atleast 3 characters of a city was typed
    cityDidChange(text) {
      const q = R.trim(text);

      // Start search if a minimum of 3 chars is entered.
      if (isEmpty(q) ||  q.length < 3 ) {
        return;
      }
      // If you have a slow AJAX response, you can pass
      // in an `isLoading` flag to display a loader.
      // Set to true while you're fetching results...
      this.set('isLoadingCity', true);

      const withTitle = x => { return { title: x } };

      let matches = R.map(withTitle)(new RioGeo().locateCity(q, this.get('selectedCountryISO')));
       // ...then set back to false once the AJAX call resolves.

      // Here, we pretend have a slow response using .setTimeout().
      // With a real AJAX fetch this would happen in the callback or
      // promise resolution.
      window.setTimeout(() => {
        this.set('filteredCities', matches);
        this.set('isLoadingCity', false);
      }, 1000);
    },

    clearCitySearches() {
      this.set('filteredCities', null);
    },

    createLocation() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url:    '/api/v1/datacenters',
          method: 'POST',
          data:   this.saveData(),
        })).then(() => {
          this.set('modelSpinner', true);
          this.set('showSpinner', false);
          this.sendAction('doReload');
          this.refresh();
        }).catch(() => {
          this.set('showSpinner', false);
          this.set('modelSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(htmlSafe(this.get('validationWarning')), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },

    selectStorage(storage) {
      this.set('selectedStorage', storage);
    },

    updateNodeData(select, data) {
      select ? this.get('selectedNodes').push(data) : this.get('selectedNodes').removeObject(data);
    },

  },

  storageId(name) {
    let id;

    this.get('model.storageConnectors.content').forEach((s) => {
      if (name === s.object_meta.name) {
        id = s.id;
      }
    });

    return id;
  },

  nameGetter(data) {
    if (!isEmpty(data)) {
      return data.map((d) => {
        return {
          name: d.object_meta.name,
          id:   d.id
        };
      });
    }

    return [];
  },

  displayMessage() {
    if (isEmpty(this.get('storages'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.locations.add.storagesDisplayError'));

      return true;
    } else if (isEmpty(this.get('nodes'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.locations.add.nodesDisplayError'));

      return true;
    } else if (isEmpty(this.get('virtualNetworks'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.locations.add.networksDisplayError'));

      return true;
    } else {
      return false;
    }
  },


  validation() {
    var validationString = '';

    if (isEmpty(this.get('selectedCity'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.locations.add.cityError'));
    }
    if (isEmpty(this.get('selectedStorage'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.locations.add.storageError'));
    }
    if (isEmpty(this.get('selectedCurrency'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.locations.add.currencyError'));
    }
    if (isEmpty(this.get('selectedNodes'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.locations.add.nodesError'));
    }
    if (!this.filteredForSelectedVirtualNetworks(this.uniqueSelected(this.get('selectedVirtualNetworks')))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.locations.add.networksSelectError'));
    }
    if (isEmpty(this.get('selectedVirtualNetworks'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.locations.add.networksError'));
    }
    this.set('validationWarning', validationString);

    return isEmpty(this.get('validationWarning')) ? false : true;
  },
  uniqueSelected(virtualNetworks) {
    var uniqueVirtualNetworks = virtualNetworks.filter((item, index) => {
      return virtualNetworks.indexOf(item) === index;
    });

    return uniqueVirtualNetworks;
  },

  filteredForSelectedVirtualNetworks(uniqueVirtualNetworks) {
    var filteredNodes = [];
    var uniqueNetData = [];
    var self = this;

    uniqueVirtualNetworks.map((network_id) => {
      return self.get('virtualNetworks').filter((network) => {
        if (network_id === network.id) {
          uniqueNetData.push(network);
        }
      });
    });

    this.get('selectedNodes').map((node_id) => {
      uniqueNetData.map((network) => {
        if (Object.keys(network.bridge_hosts).includes(node_id)) {
          filteredNodes.push(node_id);
        }
      });
    });

    return this.areEqual(this.uniqueSelected(filteredNodes), this.get('selectedNodes'));
  },

  areEqual(filtedData, selectedData) {
    return JSON.stringify(filtedData) === JSON.stringify(selectedData);
  },

  saveData() {
    let city = this.get('selectedCity.title').split(',')
    return {
      nodes:             this.get('selectedNodes'),
      networks:          this.uniqueSelected(this.get('selectedVirtualNetworks')),
      storage:           this.storageId(this.get('selectedStorage')),
      currency:          this.get('selectedCurrency'),
      flag:              `${ this.get('selectedCurrency')  }.svg`,
      enabled:           true,
      advanced_settings: { country: this.get('selectedCountry'), country_code: this.get('selectedCountryISO') },
      object_meta:       { name: city[0] },
      status:            { phase: 'ready' }
    };
  },

  refresh() {
    this.setProperties({
      selectedNodes:           '',
      selectedVirtualNetworks: '',
      selectedStorage:         '',
      selectedCurrency:        '',
      selectedCountry:         '',
      selectedCity:            '',
    });
  },

});
