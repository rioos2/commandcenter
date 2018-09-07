import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import C from 'nilavu/utils/constants';

export default Component.extend(DefaultHeaders, {
  intl:            service(),
  session:         service(),
  notifications:   service('notification-messages'),
  showPeerEditBox: true,
  repoUrl:         '',

  repoPlaceHolder: function() {
    return get(this, 'intl').t('launcherPage.repo.urlPlaceHolder');
  }.property('repoPlaceHolder'),

  didInsertElement() {
    this.set('repoUrl', this.get('model.buildconfig.spec.source.git.uri'));
  },

  actions: {
    setRepoUrl(repoUrl) {
      this.set('showPeerEditBox', true);
      if (isEmpty(repoUrl.trim())) {
        this.get('notifications').warning(get(this, 'intl').t('launcherPage.repo.emptyUrl'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      } else if (!C.REGEX.URI.test(repoUrl)){
        this.get('notifications').warning(get(this, 'intl').t('launcherPage.repo.invalidFormat'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      } else {
        this.set('model.buildconfig.spec.source.git.uri', repoUrl);
      }
    },

  }
});
