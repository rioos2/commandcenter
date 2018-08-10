import Component from '@ember/component';
import C from 'nilavu/utils/constants';

export default Component.extend({

  tagName:   '',
  className: '',

  groupedModel: function() {
    return this.get('fullmodel.stacks.content').filter((e) => {
      if (e.spec.assembly_factory) {
        return e.spec.assembly_factory.object_meta.labels.rioos_category === C.CATEGORIES.CONTAINER;
      } else {
        return false;
      }
    });
  }.property('fullmodel.stacks.content.@each'),

});
