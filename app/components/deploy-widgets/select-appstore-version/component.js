import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import {
  get, set, computed, observer
} from '@ember/object';

export default Component.extend({
  tagName:                '',
  stacksfactoryResources: alias('stacksfactory.resources'),

  active: computed('stacksfactory.os', 'stacksfactoryResources.version', function() {
    var check = (get(this, 'stacksfactory.os') === get(this, 'versionDetail.type') && get(this, 'stacksfactoryResources.version') === get(this, 'versionDetail.version'));

    if (check) {
      set(this, 'stacksfactory.plan', get(this, 'versionDetail.id'));
      set(this, 'distroDescription', get(this, 'versionDetail.description'));
    }

    return (get(this, 'stacksfactory.os') === get(this, 'versionDetail.type') && get(this, 'stacksfactoryResources.version') === get(this, 'versionDetail.version')) ? 'selected' : '';
  }),

  selectionChecker: observer('activate', function() {
    var check = (get(this, 'stacksfactory.os') === get(this, 'versionDetail.type') && get(this, 'stacksfactoryResources.version') === get(this, 'versionDetail.version'));

    if (!check) {
      set(this, 'active', '');
    }
  }),

  actions: {
    chooseVM() {
      set(this, 'stacksfactory.plan', get(this, 'versionDetail.id'));
      set(this, 'stacksfactoryResources.version', get(this, 'versionDetail.version'));
      set(this, 'stacksfactory.os', get(this, 'versionDetail.type'));
      set(this, 'distroDescription', get(this, 'versionDetail.description'));
      set(this, 'active', 'selected');
      this.sendAction('done', get(this, 'versionDetail.type'));
    }
  }
});
