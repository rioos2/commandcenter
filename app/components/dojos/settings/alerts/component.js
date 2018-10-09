import { isEmpty } from '@ember/utils';
import { buildSettingPanel } from '../basic-panel/component';
import { alias } from '@ember/object/computed';
import { set, get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { formatTime } from 'nilavu/helpers/format-time';


export default buildSettingPanel('alerts', {

  alerts: alias('model.alertRules.content'),
  intl:   service(),

  hasAlerts: computed('alerts', function() {    
    return isEmpty(get(this, 'alerts'));
  }),

  alertsCount: computed('alerts', function() {
    return get(this, 'alerts').length;
  }),

  tableData: computed('alerts', function() {
    let data = isEmpty(get(this, 'alerts')) ? [] : get(this, 'alerts');

    if (!isEmpty(data)) {
      data.forEach((e) => {
        if (e.rules[0].reason) {
          set(e, 'type', e.rules[0].rule_type);
          set(e, 'reason', e.rules[0].reason);
        }
      });
    }
    return data;
  }),

  rules: function(rules) {
    return rules[0].rule_type;
  },

  columns: computed(function() {
    return [{
      label:          get(this, 'intl').t('dojos.settings.alerts.table.type'),
      valuePath:      'type',
      cellClassNames: 'info-column',
      sortable:       false,
      width:          '20%',
      cellComponent:  'label-info'
    }, {
      label:          get(this, 'intl').t('dojos.settings.alerts.table.reason'),
      valuePath:      'reason',
      cellClassNames: 'ipaddress-column',
      sortable:       false,
    }];
  }),

  actions: {
    
    doReload() {
      $('#alert_rule_modal').modal('hide');
      this.sendAction('triggerReload');
    },

    openModal() {
      $('#alert_rule_modal').modal('show');
    }
  }

});
