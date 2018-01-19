import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({
  tagName: '',

  initializeChart: Ember.on('didInsertElement', function() {
    if (this.get('model.settings.storageType') === C.VPS.RESOURSE.HDD) {
      this.set("model.assemblyfactory.resources.storage_type", C.VPS.RESOURSE.HDD);
      this.set('selectHdd', true);
    } else {
      this.set("model.assemblyfactory.resources.storage_type", C.VPS.RESOURSE.SSD);
      this.set('selectFlash', true);
    }
  }),

  actions: {

    storageType: function(type) {
      if (type === C.VPS.RESOURSE.HDD) {
        this.set("model.assemblyfactory.resources.storage_type", C.VPS.RESOURSE.HDD);
        this.set('selectHdd', true);
        this.set('selectFlash', false);
      } else {
        this.set("model.assemblyfactory.resources.storage_type", C.VPS.RESOURSE.SSD);
        this.set('selectFlash', true);
        this.set('selectHdd', false);
      }
    },

  }

});
