import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';

export default Component.extend({
  tagName:   'section',
  className: '',
  panels:           [],

  events:    alias('model.events'),
  emptyLogs: computed('events.content', function() {
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

  auditedTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD YYYY, h:mm:ss a').toString();
  },

});
