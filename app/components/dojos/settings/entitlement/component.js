import { isEmpty } from '@ember/utils';
import { buildSettingPanel } from '../basic-panel/component';


export default buildSettingPanel('entitlement', {

  licenses: function(){
    return isEmpty(this.get('model.license.content')) ? [] : this.get('model.license.content');
  }.property('model.license'),

  actions: {
    doInnerReload() {
      this.sendAction('triggerReload');
    },
  }
});
