/* eslint-disable */
import { get } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import isoCurreny from 'npm:iso-country-currency';
import Cities from 'npm:full-countries-cities';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import flagsISo from 'nilavu/mixins/flags-iso';
import { htmlSafe } from '@ember/string';
import { isEmpty } from '@ember/utils';

export default Component.extend(DefaultHeaders, flagsISo, {

  intl:                    service(),
  notifications:           service('notification-messages'),
  tagName:                 '',
  selectedNodes:           [],
  selectedVirtualNetworks: [],
  selectedStorage:         '',
  error:                   false,

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
    var flags = this.flagsIso();

    $(() => {
      var isoCountries = flags;

      function formatCountry(country) {
        if (!country.id) {
          return country.text;
        }
        var $country = $(
          `<span class="flag-icon flag-icon-${  country.id.toLowerCase()  } flag-icon-squared"></span>` +
          `<span class="flag-text" style="margin-left: 10px;">${  country.text  }</span>`
        );

        return $country;
      }

      $("[name='country']").select2({
        placeholder:    'Select a country',
        templateResult: formatCountry,
        data:           isoCountries
      });
      $("[name='country']").val('US');
      $("[name='country']").trigger('change');
    });
  },



  actions: {

    createLocation() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url:    '/api/v1/datacenters',
          method: 'POST',
          data:   this.getData(),
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

    selectCity(city) {
      this.set('city', city);
    },

    selectCountry(isoType) {
      let info = isoCurreny.getAllInfoByISO(isoType)

      this.set('currency', info.currency);
      this.set('country', info.countryName);
      this.citiesUpdate();
    },

    updateNodeData(select, data) {
      select ? this.get('selectedNodes').push(data) : this.get('selectedNodes').removeObject(data);
    },

  },


  citiesUpdate() {
    var cities = this.citiesByCountry();
    var self = this;

    $(() => {
      var citiesData = cities;

      function formatCities(city) {
        if (!city.id) {
          return city.text;
        }
        var $city = $(
          `<span class="flag-text" style="margin-left: 10px;">${  city.text  }</span>`
        );

        return $city;
      }
      $('#cities').select2().empty();
      $('#cities').select2({
        placeholder:    'Select a city',
        templateResult: formatCities,
        data:           citiesData,
      });
      if (citiesData) {
        $('#cities').val(citiesData[0]);
        $('#cities').trigger('change');
      } else {
        self.set('city', '');
      }
    });


  },

  citiesByCountry() {
    return Cities.getCities(this.get('country'));
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

    if (isEmpty(this.get('city'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.locations.add.cityError'));
    }
    if (isEmpty(this.get('selectedStorage'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.locations.add.storageError'));
    }
    if (isEmpty(this.get('currency'))) {
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

  getData() {
    return {
      nodes:             this.get('selectedNodes'),
      networks:          this.uniqueSelected(this.get('selectedVirtualNetworks')),
      storage:           this.storageId(this.get('selectedStorage')),
      currency:          this.get('currency'),
      flag:              `${ this.get('currency')  }.svg`,
      enabled:           true,
      advanced_settings: { country: this.get('country') },
      object_meta:       { name: this.get('city'), },
      status:            { phase: 'ready' }
    };
  },
  refresh() {
    this.setProperties({
      selectedNodes:           '',
      selectedVirtualNetworks: '',
      selectedStorage:         '',
      currency:                '',
      country:                 '',
      city:                    '',
    });
  },

});
