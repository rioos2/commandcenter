import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  classNames: ['category-tab'],

  // Return the id
  id: computed('model',  function() {
    return get(this, 'model.id');
  }),

  // Return the name
  name: computed('model',  function() {
    return get(this, 'model.name');
  }),

  // Return the id
  date: computed('model',  function() {
    return get(this, 'model.date');
  }),

  // Return the health
  health: computed('model',  function() {
    return get(this, 'model.health');
  }),

  // Return the counter
  counter: computed('model',  function() {
    return get(this, 'model.counter');
  }),

  statisticsChanged: function() {
    const changed = this.get('healthzModel.content');

    if (!isEmpty(changed)) {
      const f = changed.get('firstObject');

      if (!isEmpty(f)) {
        f.results.statistics.ninjas.forEach((n) => {
          if (this.get('id') === n.id){
            this.set('counter', n.counter);
          }
        });
      }
    }
  }.observes('healthzModel.content.@each.results.statistics.ninjas.@each.counter', 'model'),
});
