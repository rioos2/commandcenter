import C from 'nilavu/utils/constants';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';
import { schedule } from '@ember/runloop';
import $ from 'jquery';

export default Controller.extend({
  application: controller(),
  settings:    service(),
  error:       null,

  // Tells us current path of ember application
  currentPath: alias('application.currentPath'),

  bootstrap: function() {
    schedule('afterRender', this, () => {
      this.get('application').setProperties({
        error:             null,
        error_description: null,
        state:             null,
      });

      let bg = this.get(`prefs.${ C.PREFS.BODY_BACKGROUND }`);

      if (bg) {
        $('BODY').css('background', bg);
      }
    });
  }.on('init'),


  hasHosts: function() {
    return (this.get('model.hosts.length') > 0);
  }.property('model.hosts.length'),

  isReady: function() {
    return this.get('projects.isReady') && this.get('hasHosts');
  }.property('projects.isReady', 'hasHosts'),

  forceUpgrade: function() {
    return this.get('currentPath').indexOf('authenticated.settings.projects') !== 0 &&
      this.get('currentPath').indexOf('authenticated.admin-tab.') !== 0;
  }.property('currentPath'),
});
