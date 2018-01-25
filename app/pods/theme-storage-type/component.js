import Ember from 'ember';
import Config from 'nilavu/mixins/config';
import C from 'nilavu/utils/constants';
export function denormalizeName(str) {
  return str.replace(new RegExp('['+C.SETTING.DOT_CHAR+']','g'),'.').toLowerCase();
}
export default Ember.Component.extend(Config,{
  tagName: '',

  initializeChart: Ember.on('didInsertElement', function() {

    if (this.validateStorageType() === C.VPS.RESOURSE.HDD) {
      this.set("model.assemblyfactory.resources.storage_type", C.VPS.RESOURSE.HDD);
      this.set('selectHdd', true);
    } else {
      this.set("model.assemblyfactory.resources.storage_type", C.VPS.RESOURSE.SSD);
      this.set('selectFlash', true);
    }
  }),

  validateStorageType: function () {
    return this.get('model.settings')[denormalizeName(`${C.SETTING.DISK_TYPE}`)] || this.defaultVPS().storageType;
  },

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
