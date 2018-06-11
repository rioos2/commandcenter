import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { match } from '@ember/object/computed';
const { get } = Ember;
import { denormalizeName } from 'nilavu/utils/denormalize';


export default Component.extend(DefaultHeaders, {
    intl: Ember.inject.service(),
    session: Ember.inject.service(),
    notifications: Ember.inject.service('notification-messages'),
    showIcon: true,
    repoUrl:  '',

    didInsertElement() {
          this.set('repoUrl',this.get('model.buildconfig.spec.source.git.uri'));
    },

    repoPlaceHolder: function() {
      return get(this, 'intl').t('launcherPage.repo.urlPlaceHolder');
    }.property('repoPlaceHolder'),

    actions: {
        clickInputIcon() {
            this.set('showIcon', false);
        },

        setRepoUrl(repoUrl) {
            this.set('showIcon', true);
            if(Ember.isEmpty(this.get('repoUrl').trim())) {
              this.get('notifications').warning(get(this, 'intl').t('launcherPage.repo.emptyUrl'), {
                autoClear: true,
                clearDuration: 4200,
                cssClasses: 'notification-warning'
              });
            } else if(!C.REGEX.URI.test(this.get('repoUrl'))){
              this.get('notifications').warning(get(this, 'intl').t('launcherPage.repo.invalidFormat'), {
                autoClear: true,
                clearDuration: 4200,
                cssClasses: 'notification-warning'
              });
            }
              else {
              this.set("model.buildconfig.spec.source.git.uri", repoUrl);
            }
        },

        focusOut() {
            this.set('showIcon', true);
        },

    }
});
