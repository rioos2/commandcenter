import C from 'nilavu/utils/constants';
export default Ember.Component.extend({

  tagName: '',
  className: '',

  groupedModel: function() {
    return this.get('fullmodel.stacks.content').filter(function(e) {
      if (e.spec.assembly_factory) {
        return e.spec.assembly_factory.object_meta.labels.rioos_category == C.CATEGORIES.MACHINE;
      } else {
        return false;
      }
    });
  }.property('fullmodel.stacks.content.@each'),
});
