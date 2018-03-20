import Component from '@ember/component';
import C from 'nilavu/utils/constants';

export default Component.extend({
  storageType: Ember.computed.alias('model.assemblyfactory.resources.storage_type'),

  isSelectedFlash: function() {
    return this.get('storageType') === C.VPS.RESOURSE.SSD;
  }.property('storageType'),

    actions: {
        clickFlash: function() {
            this.set('isSelectedFlash', true);
            this.set('storageType', C.VPS.RESOURSE.SSD);
        },
        clickHDD: function() {
            this.set('isSelectedFlash', false);
            this.set('storageType', C.VPS.RESOURSE.HDD);
        },
    }
});
