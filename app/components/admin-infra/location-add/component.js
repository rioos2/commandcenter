import Ember from 'ember';
import {
  compare
} from '@ember/utils';
import C from 'nilavu/utils/constants';
import isoCurreny from 'npm:iso-country-currency';
import Cities from 'npm:full-countries-cities';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import flagsISo from 'nilavu/mixins/flags-iso';
const {
  get
} = Ember;

export default Ember.Component.extend(DefaultHeaders, flagsISo, {

  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  tagName: '',
  selectedNodes: [],
  selectedVirtualNetworks: [],
  selectedStorage: '',
  error: false,

  didInsertElement: function() {
    this.set('error', this.displayMessage());
    var flags = this.flagsIso();
    $(function() {
      var isoCountries = flags;

      function formatCountry(country) {
        if (!country.id) {
          return country.text;
        }
        var $country = $(
          '<span class="flag-icon flag-icon-' + country.id.toLowerCase() + ' flag-icon-squared"></span>' +
          '<span class="flag-text" style="margin-left: 10px;">' + country.text + "</span>"
        );
        return $country;
      };

      $("[name='country']").select2({
        placeholder: "Select a country",
        templateResult: formatCountry,
        data: isoCountries
      });
      $("[name='country']").val('US');
      $("[name='country']").trigger('change');
    });
  },



  citiesUpdate: function() {
    var cities = this.citiesByCountry();
    var self = this;
    $(function() {
      var citiesData = cities;

      function formatCities(city) {
        if (!city.id) {
          return city.text;
        }
        var $city = $(
          '<span class="flag-text" style="margin-left: 10px;">' + city.text + "</span>"
        );
        return $city;
      };
      $("#cities").select2().empty();
      $("#cities").select2({
        placeholder: "Select a city",
        templateResult: formatCities,
        data: citiesData,
      });
      if(citiesData) {
        $("#cities").val(citiesData[0]);
        $("#cities").trigger('change');
      } else {
        self.set('city', '');
      }
    });


  },

  citiesByCountry: function() {
    return Cities.getCities(this.get('country'));
  },

  storages: function() {
    return this.nameGetter(this.get('model.storageConnectors.content'));
  }.property('model.storageConnectors.content'),

  nodes: function() {
    return this.nameGetter(this.get('model.nodes.content'));
  }.property('model.nodes.content'),

  virtualNetworks: function() {
    return this.get('model.networks.content');
  }.property('model.networks.content'),

  storageId: function(name) {
    let id;
    this.get('model.storageConnectors.content').forEach(function(s) {
      if (name == s.object_meta.name) {
        id = s.id;
      }
    });
    return id;
  },

  nameGetter: function(data) {
    if (!Ember.isEmpty(data)) {
      return data.map(function(d) {
        return {
          name: d.object_meta.name,
          id: d.id
        };
      });
    }
    return [];
  },

  displayMessage() {
    if (Ember.isEmpty(this.get('storages'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.locations.add.storagesDisplayError'));
      return true;
    } else if (Ember.isEmpty(this.get('nodes'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.locations.add.nodesDisplayError'));
      return true;
    } else if (Ember.isEmpty(this.get('virtualNetworks'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.locations.add.networksDisplayError'));
      return true;
    } else {
      return false;
    }
  },


  validation() {
    if (Ember.isEmpty(this.get('city'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.locations.add.cityError'));
      return true;
    } else if (Ember.isEmpty(this.get('selectedStorage'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.locations.add.storageError'));
      return true;
    } else if (Ember.isEmpty(this.get('currency'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.locations.add.currencyError'));
      return true;
    } else if (Ember.isEmpty(this.get('selectedNodes'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.locations.add.nodesError'));
      return true;
    } else if (!this.filteredForSelectedVirtualNetworks(this.uniqueSelected(this.get('selectedVirtualNetworks')))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.locations.add.networksSelectError'));
      return true;
    } else if (Ember.isEmpty(this.get('selectedVirtualNetworks'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.locations.add.networksError'));
      return true;
    } else {
      return false;
    }
  },
  uniqueSelected: function(virtualNetworks) {
    var uniqueVirtualNetworks = virtualNetworks.filter(function(item, index) {
      return virtualNetworks.indexOf(item) == index;
    });
    return uniqueVirtualNetworks;
  },

  filteredForSelectedVirtualNetworks: function(uniqueVirtualNetworks) {
    var filteredNodes = [];
    var uniqueNetData = [];
    var self = this;
    uniqueVirtualNetworks.map(function(network_id) {
      return self.get('virtualNetworks').filter(function(network) {
        if (network_id == network.id) {
          uniqueNetData.push(network);
        }
      });
    });

    this.get('selectedNodes').map(function(node_id) {
      uniqueNetData.map(function(network) {
        if (Object.keys(network.bridge_hosts).includes(node_id)) {
          filteredNodes.push(node_id);
        }
      });
    });
    return this.areEqual(this.uniqueSelected(filteredNodes), this.get('selectedNodes'));
  },

  areEqual: function(filtedData, selectedData) {
    return JSON.stringify(filtedData) == JSON.stringify(selectedData);
  },

  getData: function() {
    return {
      nodes: this.get('selectedNodes'),
      networks: this.uniqueSelected(this.get('selectedVirtualNetworks')),
      storage: this.storageId(this.get('selectedStorage')),
      currency: this.get('currency'),
      flag: this.get('currency') + ".svg",
      enabled: true,
      advanced_settings: {
        country: this.get('country')
      },
      object_meta: {
        name: this.get('city'),
      },
      status: {
        phase: "ready"
      }
    };
  },
  refresh() {
  this.setProperties({
   selectedNodes: '',
   selectedVirtualNetworks: '',
   selectedStorage: '',
   currency: '',
   country: '',
   city:'',
  });
 },

  actions: {

    createLocation: function() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url: '/api/v1/datacenters',
          method: 'POST',
          data: this.getData(),
        })).then((xhr) => {
          this.set('modelSpinner', true);
          this.set('showSpinner', false);
          this.sendAction('doReload');
          this.refresh();
        }).catch((err) => {
          this.set('showSpinner', false);
          this.set('modelSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(this.get('validationWarning'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      }
    },

    selectStorage: function(storage) {
      this.set('selectedStorage', storage);
    },

    selectCity: function(city) {
      this.set('city', city);
    },

    selectCountry: function(isoType) {
      let info = isoCurreny.getAllInfoByISO(isoType)
      this.set('currency', info.currency);
      this.set('country', info.countryName);
      this.citiesUpdate();
    },

    updateNodeData: function(select, data) {
      select ? this.get('selectedNodes').push(data) : this.get('selectedNodes').removeObject(data);
    },

  }


});
