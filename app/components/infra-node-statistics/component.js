import Component from '@ember/component';

export default Component.extend({
  classNames: ['category-tab'],

  reportNodesUpdate: function() {
    if (!Ember.isEmpty(this.get('counterModel.content'))) {
      this.get('counterModel.content').objectAt(0).results.statistics.ninjas.forEach((mn) => {
        if (this.get('model.id') == mn.id){
          this.set('model.counter', mn.counter);
        }
      });
    }
  }.observes('counterModel.content.@each.results.statistics.ninjas.@each.counter', 'model'),
});
