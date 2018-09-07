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

      // width: '150px'
    }];
  }),

  table: computed('model', function() {
    return new Table(this.get('columns'), this.get('model'));
  })

});
