import { isEmpty } from '@ember/utils';
import { buildSettingPanel } from '../basic-panel/component';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { formatTime } from 'nilavu/helpers/format-time';

export default buildSettingPanel('logs', {

  intl:       service(),

  emptyLogs: function() {
    return isEmpty(this.get('model.logs.content'));
  }.property('model.logs.content'),

  tableData: function() {
    let data = isEmpty(this.get('model.logs.content')) ? [] : this.get('model.logs.content');

    if (!isEmpty(data)) {
      data.forEach((e) => {
        if (e.time) {
          e.time = formatTime([e.time]);
        }
      });
    }

    return data;
  }.property('model'),

  columns: computed(function() {
    return [{
      label:          get(this, 'intl').t('dojos.settings.logs.table.info'),
      valuePath:      'log',
      cellClassNames: 'info-column',
      sortable:       false,
      cellComponent:  'label-info'
    }, {
      label:          get(this, 'intl').t('dojos.settings.logs.table.dateAndTime'),
      valuePath:      'time',
      style:          'font-weight:bold',
      cellClassNames: 'date-column',
      width:          '20%',
      sortable:       true,
    }];
  }),

});
