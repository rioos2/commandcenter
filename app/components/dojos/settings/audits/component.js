import { isEmpty } from '@ember/utils';
import { buildSettingPanel } from '../basic-panel/component';
import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default buildSettingPanel('audits', {

  audits: alias('model.audits'),
  intl:       service(),


  hasLogs: computed('audits.content', function() {
    return isEmpty(get(this, 'audits.content'));
  }),

  tableData: computed('audits.content', function() {
    let data = isEmpty(get(this, 'audits.content')) ? [] : get(this, 'audits.content');

    if (!isEmpty(data)) {
      data.forEach((e) => {
        if (e.envelope.timestamp) {
          e.envelope.timestamp = this.auditedTimestamp(e.envelope.timestamp);
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

  auditedTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD YYYY, h:mm:ss a').toString();
  },
});
