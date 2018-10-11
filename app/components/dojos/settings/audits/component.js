import { isEmpty } from '@ember/utils';
import { buildSettingPanel } from '../basic-panel/component';
import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { formatTime } from 'nilavu/helpers/format-time';
import C from 'nilavu/utils/constants';


export default buildSettingPanel('audits', {

  audits:                  alias('model.audits'),
  auditAvailabilityStatus: alias('model.audits.code'),
  intl:                    service(),
  notifications:           service('notification-messages'),



  hasLogs: computed('audits.content', function() {
    return isEmpty(get(this, 'audits.content'));
  }),

  auditUnavailable: function() {
    if (C.BADGATEWAY_HTTP_CODES.includes(get(this, 'auditAvailabilityStatus'))) {
      get(this, 'notifications').warning(get(this, 'intl').t('dojos.settings.audits.error'), {
        htmlContent:   true,
        autoClear:     true,
        clearDuration: 6000,
        cssClasses:    'notification-warning'
      });
    }
  }.on('init'),

  tableData: computed('audits.content', function() {
    let data = isEmpty(get(this, 'audits.content')) ? [] : get(this, 'audits.content');

    if (!isEmpty(data)) {
      data.forEach((e) => {
        if (e.envelope.timestamp) {
          e.envelope.timestamp = formatTime([e.envelope.timestamp]);
        }
      });
    }

    return data;
  }),

  columns: computed(function() {
    return [{
      label:          get(this, 'intl').t('dojos.settings.audits.table.info'),
      valuePath:      'envelope.event.message',
      cellClassNames: 'info-column',
      sortable:       false,
      cellComponent:  'label-info'
    }, {
      label:          get(this, 'intl').t('dojos.settings.audits.table.ip'),
      valuePath:      'envelope.address',
      cellClassNames: 'ipaddress-column',
      width:          '16%',
      sortable:       false,

    }, {
      label:          get(this, 'intl').t('dojos.settings.audits.table.dateAndTime'),
      valuePath:      'envelope.timestamp',
      style:          'font-weight:bold',
      cellClassNames: 'date-column',
      width:          '20%',
      sortable:       true,
    }];
  }),
});
