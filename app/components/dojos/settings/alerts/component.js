import { isEmpty } from '@ember/utils';
import { buildSettingPanel } from '../basic-panel/component';
import { alias } from '@ember/object/computed';
import { set, get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { formatTime } from 'nilavu/helpers/format-time';
import { R } from 'ramda';

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
    let typeLens = R.lensProp('type');
    let reasonLens = R.lensProp('reason');
    let rulesLens = R.lensProp('rules');

    let data = isEmpty(get(this, 'alerts')) ? [] : get(this, 'alerts');
    if (!isEmpty(data)) {    

      //append type value   
      var mergeRulesType = x => R.set(typeLens,R.view(typeLens, nth(0, R.view(rulesLens, x))), x);
      R.map(mergeRulesType, data);

      //append reason value
      var mergeRulesReason = x => R.set(reasonLens,R.view(reasonLens, nth(0, R.view(rulesLens, x))), x);
      R.map(mergeRulesReason, data);
    }

   /* if (!isEmpty(data)) {
      data.forEach((e) => {
        if (e.rules[0].reason) {
          set(e, 'type', e.rules[0].rule_type);
          set(e, 'reason', e.rules[0].reason);
        }
      });
    }*/
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
