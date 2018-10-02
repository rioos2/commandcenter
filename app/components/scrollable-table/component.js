import Component from '@ember/component';
import { computed } from '@ember/object';
import Table from 'ember-light-table';
import { get } from '@ember/object';


export default Component.extend({

  model: null,

  table: computed('model', function() {
    return new Table(get(this, 'columns'), get(this, 'model'));
  })

});
