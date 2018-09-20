import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';


export default Component.extend({
  intl:       service(),


  tagName:   'section',
  className: '',
  panels:           [],
  events:    alias('model.events'),

  hasLogs: computed('events.content', function() {
    return isEmpty(get(this, 'events.content'));
  }),

  tableData: computed('events', function() {
    let data = get(this, 'events.content');

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
      label:          get(this, 'intl').t('eventsPage.table.info'),
      valuePath:      'envelope.event.message',
      cellClassNames: 'info-column',
      sortable:       false,
      cellComponent:  'label-info'
    }, {
      label:          get(this, 'intl').t('eventsPage.table.ip'),
      valuePath:      'envelope.address',
      cellClassNames: 'ipaddress-column',
      width:          '16%',
      sortable:       false,

    }, {
      label:          get(this, 'intl').t('eventsPage.table.dateAndTime'),
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
