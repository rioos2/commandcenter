import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl:       service(),

  tagName:   'section',
  className: '',
  panels:           [],
  sessions:  alias('model.sessions'),

  tableData: computed('sessions', function() {
    return isEmpty(get(this, 'sessions.content')) ? [] : get(this, 'sessions.content');
  }),

  columns: computed(function() {
    return [{
      label:          get(this, 'intl').t('profile.recent-activity.table.colDevice'),
      valuePath:      'device.name',
      cellClassNames: 'session-name',
      cellComponent:  'label-info'
    }, {
      label:          get(this, 'intl').t('profile.recent-activity.table.colCategory'),
      valuePath:      'device.category',
      cellClassNames: 'session-category',
    }, {
      label:          get(this, 'intl').t('profile.recent-activity.table.colVersion'),
      valuePath:      'device.version',
      cellClassNames: 'session-browser-version',
    }, {
      label:          get(this, 'intl').t('profile.recent-activity.table.colIp'),
      valuePath:      'device.ip',
      cellClassNames: 'session-ip',
      width:          '16%',
      sortable:       false,
    }];
  }),

});
