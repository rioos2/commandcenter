import { isEmpty } from '@ember/utils';
import { buildAdminSettingPanel } from '../admin-setting-panel/component';


export default buildAdminSettingPanel('entitlement', {

  licenses: function(){
    return isEmpty(this.get('model.license.content')) ? [] : this.get('model.license.content');
  }.property('model.license'),

  actions: {
    doReload() {
      this.sendAction('triggerReload');
    },
  }
});
