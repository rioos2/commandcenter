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

      // width: '150px'
    }];
  }),

  table: computed('model', function() {
    return new Table(this.get('columns'), this.get('model'));
  })


});
