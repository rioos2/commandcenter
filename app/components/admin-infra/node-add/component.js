import { get } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import $ from 'jquery';
import { isEmpty } from '@ember/utils';

import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
export default Component.extend(DefaultHeaders, {
  intl:          service(),
  notifications: service('notification-messages'),

  noteForRangeSubnet: function() {
    return htmlSafe(get(this, 'intl').t('stackPage.admin.node.noteForRangeSubnet'));
  }.property('model'),

  noteForAdvanceSubnet: function() {
    return htmlSafe(get(this, 'intl').t('stackPage.admin.node.noteForAdvanceSubnet'));
  }.property('model'),

  subnetAdvancePlaceHolder: function() {
    return get(this, 'intl').t('stackPage.admin.node.searchNodeBySubnetPlaceholder');
  }.property('model'),

  types: function() {
    return C.NODE.SUBNETSSEARCH;
  }.property('model'),

  didInsertElement() {
    $("[name='node_discovery_types']").val('Subnet');
    $("[name='node_discovery_types']").trigger('change');
  },

  actions: {

    nodeDiscovery() {
      let filter = {
        'ip_address_type':    '',
        'cidrs':              [],
        'range_address_from': '',
        'range_address_to':   ''
      };

      switch (this.get('searchType')) {
      case 'Subnet':
        filter.cidrs.push(this.get('subnetAdvanceValue'));
        if (!this.validationAdvanceSubnet()) {
          filter.ip_address_type = this.get('ipType');
          filter.cidrs = this.cidrsFormate(filter.cidrs);
          this.send('doDiscovery', filter, false);
        } else {
          this.send('doDiscovery', filter, true);
        }
        break;
      case 'Subnet Range':
        filter.range_address_from = this.get('subnetRangeFrom');
        filter.range_address_to = this.get('subnetRangeTo');
        if (!this.validationRangeSubnet()) {
          filter.ip_address_type = this.get('ipType');
          this.send('doDiscovery', filter, false);
        } else {
          this.send('doDiscovery', filter, true);
        }
        break;
      default:
        this.send('doDiscovery', filter, false);
      }
    },

    doDiscovery(filter, error) {
      this.set('showSpinner', true);
      if (!error) {
        this.get('store').request(this.rawRequestOpts({
          url:    '/api/v1/nodes/discover',
          method: 'POST',
          data:   filter,
        })).then(() => {
          $('#node_add_modal').modal('hide');
          this.set('modelSpinner', false);
          this.set('showSpinner', false);
          this.refresh();
        }).catch(() => {
          this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.node.somethingWrong'), {
            autoClear:     true,
            clearDuration: 4200,
            cssClasses:    'notification-warning'
          });
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

    selectStorage(type) {
      this.set('searchType', type);
    },
  },

  checkSubnetFormate(ip) {
    if (ip.match(C.REGEX.IPV4.SUBNET)) {
      this.set('ipType', C.IPTYPE.IPV4);

      return true;
    } else if (ip.match(C.REGEX.IPV6.SUBNET)) {
      this.set('ipType', C.IPTYPE.IPV6);

      return true;
    } else {
      return false;
    }
  },

  checkIpFormate(ip) {
    if (ip.match(C.REGEX.IPV4.IP)) {
      this.set('ipType', C.IPTYPE.IPV4);

      return true;
    } else if (ip.match(C.REGEX.IPV6.IP)) {
      this.set('ipType', C.IPTYPE.IPV6);

      return true;
    } else {
      return false;
    }
  },

  validationAdvanceSubnet() {
    this.set('validationWarning', '');
    var validationString = '';

    if (isEmpty(this.get('subnetAdvanceValue'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.emptySubnetAdvanceValue'));
    }

    if (!isEmpty(this.get('subnetAdvanceValue'))) {
      this.get('subnetAdvanceValue').replace(/\s/g, '').split(',').forEach((s) => {
        if (!this.checkSubnetFormate(s)) {
          validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.subnetRangeError'));
        } else if ((s.split('/')[0]).slice(-1) !== '0') {
          validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.subnetRangeZeroError'));
        }
      });
    }

    this.set('validationWarning', validationString);

    return isEmpty(this.get('validationWarning')) ? false : true;
  },

  validationRangeSubnet() {
    this.set('validationWarning', '');
    var validationString = '';

    if (isEmpty(this.get('subnetRangeFrom'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.emptySubnetRangeFrom'));
    }

    if (!isEmpty(this.get('subnetRangeFrom'))) {
      if (!this.checkIpFormate(this.get('subnetRangeFrom'))) {
        validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.subnetRangeValidFromError'));
      }
    }

    if (isEmpty(this.get('subnetRangeTo'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.emptySubnetRangeTo'));
    }

    if (!isEmpty(this.get('subnetRangeTo'))) {
      if (!this.checkIpFormate(this.get('subnetRangeTo'))) {
        validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.subnetRangeValidToError'));
      }
    }

    this.set('validationWarning', validationString);

    return isEmpty(this.get('validationWarning')) ? false : true;
  },

  cidrsFormate(cidrs) {
    return cidrs.map((s) => ({
      'ip':    s.split('/')[0],
      'range': parseInt(s.split('/')[1])
    }));
  },

  filterNodes(type) {
    let filter_nodes = [];

    for (var s in this.dummyData()) {
      if (!isEmpty(this.dummyData()[s])) {
        filter_nodes.push(this.dummyData()[s][type]);
      }

    }

    return [].concat.apply([], filter_nodes);
  },

  refresh() {
    this.setProperties({
      subnetAdvanceValue: '',
      subnetRangeFrom:    '',
      subnetRangeTo:      '',
    });
  },

});
