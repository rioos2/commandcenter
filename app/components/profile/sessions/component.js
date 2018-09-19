import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';


export default Component.extend({
  tagName:   'section',
  className: '',
  panels:           [],
  sessions:  alias('model.sessions'),

  tableData: computed('model.sessions', function() {
    return isEmpty(get(this, 'sessions.content')) ? [] : get(this, 'sessions.content');
  }),

});
