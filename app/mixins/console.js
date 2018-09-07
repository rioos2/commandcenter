import Mixin from '@ember/object/mixin';
import { inject as controller } from '@ember/controller';
import $ from 'jquery';
export default Mixin.create({
  application: controller(),
  queryParams: ['instanceId'],
  instanceId:  null,
  model:       null,

  bootstrap: function() {
    if (this.get('application.isPopup')) {
      $('body').css('overflow', 'hidden');
    }
  }.on('init'),

  actions: {
    cancel() {
      window.close();
    }
  }
});
