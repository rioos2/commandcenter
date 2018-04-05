import Component from '@ember/component';
import { computed } from '@ember/object';
import Table from 'ember-light-table';
import C from 'nilavu/utils/constants';
const  {get} = Ember;
import { denormalizeName } from 'nilavu/utils/denormalize';

export default Component.extend({

  intl:       Ember.inject.service(),
  model: null,

  columns: computed(function() {
  return [{
          label: get(this, 'intl').t('audits.tableHeader.info'),
          valuePath: 'event.message',
          cellClassNames: "info-column",
          sortable: false,
          cellComponent: 'label-info'
      }, {
          label: get(this, 'intl').t('audits.tableHeader.ip'),
          valuePath: 'address',
          cellClassNames: "ipaddress-column",
          width: '16%',
          sortable: false,

      }, {
          label: get(this, 'intl').t('audits.tableHeader.dateAndTime'),
          valuePath: 'date',
          style: "font-weight:bold",
          cellClassNames: "date-column",
          width: '20%',
          sortable: true,

          // width: '150px'
      }];
  }),

  table: computed('model', function() {
      return new Table(this.get('columns'), this.get('model'));
  })

});
