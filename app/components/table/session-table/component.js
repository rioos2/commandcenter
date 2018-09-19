import Component from '@ember/component';
import { computed } from '@ember/object';
import Table from 'ember-light-table';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';


export default Component.extend({

  intl:       service(),
  model: null,

  columns: computed(function() {
    return [{
      label:          get(this, 'intl').t('profile.sessions.table.colDevice'),
      valuePath:      'device.name',
      cellClassNames: 'session-name',
      cellComponent:  'label-info'
    }, {
      label:          get(this, 'intl').t('profile.sessions.table.colCategory'),
      valuePath:      'device.category',
      cellClassNames: 'session-category',
    }, {
      label:          get(this, 'intl').t('profile.sessions.table.colVersion'),
      valuePath:      'device.version',
      cellClassNames: 'session-browser-version',
    }, {
      label:          get(this, 'intl').t('profile.sessions.table.colIp'),
      valuePath:      'device.ip',
      cellClassNames: 'session-ip',
      width:          '16%',
      sortable:       false,
    }];
  }),

  table: computed('model', function() {
    console.log(JSON.stringify(this.get('model')));

    return new Table(this.get('columns'), this.get('model'));
  })

});
